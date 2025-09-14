import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['FOLLOW_UP', 'MILESTONE', 'STAGNANT', 'ASSIGNMENT', 'REMINDER', 'WELCOME'],
        required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest' },
    guestName: { type: String },
    isRead: { type: Boolean, default: false },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'MEDIUM'
    },
    actionRequired: { type: Boolean, default: false },
    recipients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
