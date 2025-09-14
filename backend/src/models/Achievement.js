import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    rarity: {
        type: String,
        enum: ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'],
        required: true
    },
    points: { type: Number, required: true },
    criteria: { type: Map, of: mongoose.Schema.Types.Mixed },
    imageUrl: { type: String }
}, { timestamps: true });

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
