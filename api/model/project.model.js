import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    workers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    siteImages: [String], // New field for storing site images
    status: {
        type: Number,
        enum: [0, 1, 2, 3, 4], // Project statuses: 0: Cancelled, 1: In Process, 2: 25% Completed, 3: 75% Completed, 4: Completed
        default: 1 // Default status: In Process
    }
});

const ProjectModel = mongoose.model('Project', projectSchema);

export default ProjectModel;








// import mongoose from 'mongoose';

// const projectSchema = new mongoose.Schema({
//     // Define your project schema fields here
//     // For simplicity, assuming only relevant fields here
//     owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     workers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
// });

// const ProjectModel = mongoose.model('Project', projectSchema);

// export default ProjectModel;
