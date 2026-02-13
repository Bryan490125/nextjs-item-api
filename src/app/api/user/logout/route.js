import { NextResponse } from "next/server";
import { serialize } from "cookie";
import corsHeaders from "../../../../lib/cors";

export async function POST() {
    const cookie = serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: -1,
        path: "/",
    });

    const headers = { ...corsHeaders, "Set-Cookie": cookie };

    return NextResponse.json({ message: "Logout successful" }, { headers });
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}
