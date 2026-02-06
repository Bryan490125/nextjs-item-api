import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import corsHeaders from "../../../../lib/cors";
import { ObjectId } from "mongodb";

// PUT → Update User
export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("userdb");

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ message: error.toString() }, { headers: corsHeaders });
  }
}

// DELETE → Delete User
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("userdb");

    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ message: error.toString() }, { headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

