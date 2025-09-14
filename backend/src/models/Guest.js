import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    weekNumber: { type: Number },
    status: {
        type: String,
        enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    },
    completedAt: { type: Date }
}, { timestamps: true });

const guestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
    assignedToId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    preferredChannel: {
        type: String,
        enum: ['WHATSAPP', 'PHONE', 'SMS', 'EMAIL', 'IN_PERSON'],
        default: 'WHATSAPP'
    },
    assimilationStage: {
        type: String,
        enum: ['INVITED', 'ATTENDED', 'DISCIPLED', 'JOINED'],
        default: 'INVITED'
    },
    prayerRequest: { type: String },
    address: { type: String },
    nextAction: { type: String },
    lastContact: { type: Date },
    milestones: [milestoneSchema],
    meta: { type: Map, of: mongoose.Schema.Types.Mixed }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for engagements
guestSchema.virtual('engagements', {
    ref: 'Engagement',
    localField: '_id',
    foreignField: 'guestId'
});

const Guest = mongoose.model('Guest', guestSchema);
export default Guest;
