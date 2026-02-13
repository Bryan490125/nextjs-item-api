import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "../../../../lib/mongodb";
import { verifyToken } from "../../../../lib/auth";
import corsHeaders from "../../../../lib/cors";

export async function GET() {
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

        const user = await db.collection("users").findOne({ email: decoded.email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404, headers: corsHeaders });
        }

        // Remove sensitive data
        const { password, ...userProfile } = user;

        return NextResponse.json(userProfile, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ message: error.toString() }, { status: 500, headers: corsHeaders });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}
