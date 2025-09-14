import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
    timeRange: { type: String, required: true },
    zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
    totalGuests: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    avgTimeToConversion: { type: Number, default: 0 },
    activeWorkers: { type: Number, default: 0 },
    monthlyTrends: [{
        month: String,
        newGuests: Number,
        converted: Number
    }],
    zonePerformance: [{
        zone: String,
        invited: Number,
        attended: Number,
        discipled: Number,
        joined: Number,
        conversion: Number
    }],
    stageDistribution: [{
        name: String,
        value: Number,
        color: String
    }],
    dropOffAnalysis: [{
        stage: String,
        dropOff: Number,
        reason: String
    }],
    topPerformers: [{
        name: String,
        zone: String,
        conversions: Number,
        trend: {
            type: String,
            enum: ['UP', 'DOWN', 'STABLE']
        }
    }]
}, { timestamps: true });

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
