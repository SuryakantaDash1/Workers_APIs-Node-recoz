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
        type: Number,
        enum: [0, 1, 2, 3, 4],
        default: 1
    },
    
}, { timestamps: true });

export default mongoose.model('PastProject', pastProjectSchema);

