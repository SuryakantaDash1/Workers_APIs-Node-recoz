import mongoose from 'mongoose';

const projectWorkerSchema = new mongoose.Schema({
    workerId: String,
    projectType: String,
    projectLocation: String,
    city: String,
    pincode: String,
    services: [String],
    imageUrl: String,
    status: { type: Number, default: 4 }, 
    isWorking: { type: Boolean, default: false }
});

const ProjectWorker = mongoose.model('ProjectWorker', projectWorkerSchema);

export default ProjectWorker;










// import mongoose from "mongoose";

// export const pastProjectSchema = new mongoose.Schema({
//     projectId: {
//         type: String,
//         required: true
//     },
//     projectType: {
//         type: String,
//         required: true
//     },
//     projectLocation: {
//         type: String,
//         required: true
//     },
//     city: {
//         type: String,
//         required: true
//     },
//     pincode: {
//         type: String,
//         required: true
//     },
//     services: {
//         type: [String],
//         required: true
//     },
//     imageUrl: {
//         type: String
//     },
//     status: {
//         type: Number,
//         enum: [0, 1, 2, 3, 4],
//         default: 1
//     },
    
// }, { timestamps: true });

// export default mongoose.model('PastProject', pastProjectSchema);

