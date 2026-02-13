import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import corsHeaders from "../../../lib/cors";
import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";

// GET → User List
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("userdb");

        const users = await db.collection("users").find({}).toArray();

        return NextResponse.json(users, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ message: error.toString() }, { headers: corsHeaders });
    }
}

// POST → Create User
export async function POST(req) {
    try {
        const formData = await req.formData();
        const username = formData.get("username");
        const email = formData.get("email");
        const firstname = formData.get("firstname");
        const lastname = formData.get("lastname");
        const password = formData.get("password");
        const file = formData.get("file");

        let profileImage = "";

        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = file.name; // Use original filename
            const uploadDir = path.join(process.cwd(), "public/uploads");
            const filePath = path.join(uploadDir, fileName);

            await fs.writeFile(filePath, buffer);
            profileImage = `/uploads/${fileName}`;
        }

        const client = await clientPromise;
        const db = client.db("userdb");

        const result = await db.collection("users").insertOne({
            username,
            email,
            firstname,
            lastname,
            password,
            profileImage
        });

        return NextResponse.json(result, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ message: error.toString() }, { headers: corsHeaders });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

