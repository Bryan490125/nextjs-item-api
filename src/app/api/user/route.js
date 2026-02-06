import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import corsHeaders from "../../../lib/cors";

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
        const body = await req.json();

        const client = await clientPromise;
        const db = client.db("userdb");

        const result = await db.collection("users").insertOne(body);

        return NextResponse.json(result, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ message: error.toString() }, { headers: corsHeaders });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

