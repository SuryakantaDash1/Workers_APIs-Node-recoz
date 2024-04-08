import mongoose from "mongoose";

export const pastProjectSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true
    },
    projectType: {
        type: String,
        required: true
    },
    projectLocation: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    services: {
        type: [String],
        required: true
    },
    imageUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['In Process', '25% Completed', '75% Completed', 'Completed'],
        default: 'In Process'
    },
    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('PastProject', pastProjectSchema);

