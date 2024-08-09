import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
});

export default mongoose.model("Category", categorySchema);

// Note:-
// A slug is a string that can only include characters, numbers, dashes, and underscores.
// It is the part of a URL that identifies a particular page on a website, in a human-friendly form.