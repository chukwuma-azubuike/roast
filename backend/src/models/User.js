import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    role: {
        type: String,
        enum: ['WORKER', 'ZONAL_COORDINATOR', 'ADMIN'],
        required: true
    },
    password: { type: String, required: true },
    zoneName: { type: String },
    zoneIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Zone' }],
    isActive: { type: Boolean, default: true },
    guestCount: { type: Number, default: 0 }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});

const User = mongoose.model('User', userSchema);
export default User;
