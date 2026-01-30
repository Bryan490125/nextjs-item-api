import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET items with pagination
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = 5;
  const skip = (page - 1) * limit;

  const client = await clientPromise;
  const db = client.db("itemdb");

  const items = await db
    .collection("items")
    .find({})
    .skip(skip)
    .limit(limit)
    .toArray();

  return NextResponse.json(items);
}

// CREATE item
export async function POST(req: Request) {
  const body = await req.json();

  const client = await clientPromise;
  const db = client.db("itemdb");

  const result = await db.collection("items").insertOne({
    itemName: body.itemName,
    itemCategory: body.itemCategory,
    itemPrice: body.itemPrice,
    status: body.status,
  });

  return NextResponse.json(result);
}
