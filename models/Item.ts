import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    itemName: String,
    itemCategory: String,
    itemPrice: Number,
    status: String,
  },
  { timestamps: true }
);

export default mongoose.models.Item ||
  mongoose.model("Item", ItemSchema);
