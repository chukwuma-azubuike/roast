import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema({
    name: { type: String, required: true },
    coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Zone = mongoose.model('Zone', zoneSchema);
export default Zone;
