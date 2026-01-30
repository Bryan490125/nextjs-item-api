import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// UPDATE item
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const client = await clientPromise;
  const db = client.db("itemdb");

  await db.collection("items").updateOne(
    { _id: new ObjectId(params.id) },
    {
      $set: {
        itemName: body.itemName,
        itemCategory: body.itemCategory,
        itemPrice: body.itemPrice,
        status: body.status,
      },
    }
  );

  return NextResponse.json({ message: "Updated" });
}

// DELETE item
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const client = await clientPromise;
  const db = client.db("itemdb");

  await db.collection("items").deleteOne({
    _id: new ObjectId(params.id),
  });

  return NextResponse.json({ message: "Deleted" });
}
