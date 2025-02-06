import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,    //category is a reference to the category model
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    // imageUrl:{
    //   type:String
    // },
    shipping: {
      type: Boolean,
    },
  },
  { timestamps: true }  //it will tell the creation time of product
);

export default mongoose.model("Products", productSchema);