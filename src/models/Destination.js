import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  travelTime: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Destination = mongoose.models.Destination || mongoose.model("Destination", destinationSchema);
export default Destination;