import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { signToken } from "../../../../lib/auth";
import { serialize } from "cookie";
import corsHeaders from "../../../../lib/cors";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body;

        const client = await clientPromise;
        const db = client.db("userdb");

        const user = await db.collection("users").findOne({ email, password });

        if (!user) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401, headers: corsHeaders });
        }

        const token = signToken({ email: user.email, id: user._id });

        const cookie = serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60, // 1 hour
            path: "/",
        });

        const headers = { ...corsHeaders, "Set-Cookie": cookie };

        return NextResponse.json({ message: "Login successful" }, { headers });
    } catch (error) {
        return NextResponse.json({ message: error.toString() }, { status: 500, headers: corsHeaders });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}
