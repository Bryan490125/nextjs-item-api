import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import corsHeaders from "../../../../lib/cors";
import { ObjectId } from "mongodb";
import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";

// PUT → Update User
export async function PUT(req, { params }) {
  try {
    const formData = await req.formData();
    const { id } = await params;

    const username = formData.get("username");
    const email = formData.get("email");
    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const password = formData.get("password");
    const file = formData.get("file");

    const updateData = {
      username,
      email,
      firstname,
      lastname,
      password
    };

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = file.name; // Use original filename
      const uploadDir = path.join(process.cwd(), "public/uploads");
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);
      updateData.profileImage = `/uploads/${fileName}`;
    }

    const client = await clientPromise;
    const db = client.db("userdb");

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
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

