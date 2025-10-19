// models/Reservation.ts
import mongoose, { Schema, model, models } from "mongoose";

const GuestSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
});

const ReservationSchema = new Schema({
    hotel: { type: Object, required: true },
    rooms: { type: Array, required: true },
    pricing: { type: Object, required: true },
    booking: { type: Object, required: true },
    guests: { type: [GuestSchema], required: true },
    selectedRoomId: { type: String, required: true },
    selectedMeal: { type: String, default: "none" },
    paymentStatus: { type: String, default: "pending" }, // par défaut non payé
    createdAt: { type: Date, default: Date.now },
});

const Reservation = models.Reservation || model("Reservation", ReservationSchema);
export default Reservation;
