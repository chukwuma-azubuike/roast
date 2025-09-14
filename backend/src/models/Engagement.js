import mongoose from 'mongoose';

const engagementSchema = new mongoose.Schema({
    guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['WHATSAPP', 'PHONE', 'SMS', 'EMAIL', 'IN_PERSON'],
        required: true
    },
    notes: { type: String },
    outcome: { type: String },
    duration: { type: Number }, // in minutes
    followUpDate: { type: Date }
}, { timestamps: true });

const Engagement = mongoose.model('Engagement', engagementSchema);
export default Engagement;
