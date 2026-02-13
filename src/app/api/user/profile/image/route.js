import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { verifyToken } from "../../../../../lib/auth";
import corsHeaders from "../../../../../lib/cors";
import path from "path";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401, headers: corsHeaders });
        }

        const decoded = verifyToken(token.value);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401, headers: corsHeaders });
        }

        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ message: "No file uploaded" }, { status: 400, headers: corsHeaders });
        }

        // Check if file is an image
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ message: "Only image files allowed" }, { status: 400, headers: corsHeaders });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = file.name.split(".").pop();
        const filename = `${uuidv4()}.${ext}`;
        const uploadDir = path.join(process.cwd(), "public", "profile-images");
        const filePath = path.join(uploadDir, filename);

        await fs.writeFile(filePath, buffer);
        const profileImage = `/profile-images/${filename}`;

        const client = await clientPromise;
        const db = client.db("userdb");

        // Remove old image if exists
        const user = await db.collection("users").findOne({ email: decoded.email });
        if (user && user.profileImage) {
            const oldImagePath = path.join(process.cwd(), "public", user.profileImage);
            try {
                await fs.unlink(oldImagePath);
            } catch (err) {
                console.error("Failed to delete old image:", err);
            }
        }

        await db.collection("users").updateOne(
            { email: decoded.email },
            { $set: { profileImage } }
        );

        return NextResponse.json({ imageUrl: profileImage, message: "Image updated successfully" }, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ message: error.toString() }, { status: 500, headers: corsHeaders });
    }
}

export async function DELETE(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401, headers: corsHeaders });
        }

        const decoded = verifyToken(token.value);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401, headers: corsHeaders });
        }

        const client = await clientPromise;
        const db = client.db("userdb");
        const email = decoded.email;

        const user = await db.collection("users").findOne({ email });

        if (user && user.profileImage) {
            const filePath = path.join(process.cwd(), "public", user.profileImage);
            try {
                await fs.unlink(filePath);
            } catch (err) {
                // File might not exist, ignore
                console.error("Error deleting file:", err);
            }

            await db.collection("users").updateOne(
                { email },
                { $set: { profileImage: null } }
            );
        }

        return NextResponse.json({ message: "OK" }, { status: 200, headers: corsHeaders });

    } catch (error) {
        return NextResponse.json({ message: error.toString() }, { status: 500, headers: corsHeaders });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}
