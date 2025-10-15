import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  validUntil: { type: Date, required: true },
  discount: { type: Number },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Offer = mongoose.models.Offer || mongoose.model("Offer", offerSchema);
export default Offer;