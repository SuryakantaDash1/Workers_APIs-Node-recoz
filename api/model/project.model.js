import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectType: String,
    projectLocation: String,
    city: String,
    pincode: String,
    services: [String],
    imageUrl: String,
    siteImages: [String],
    status: { type: Number, default: 1 } // Default status: In Process
});

const Project = mongoose.model('Project', projectSchema);

export default Project;









// import mongoose from 'mongoose';

// const projectSchema = new mongoose.Schema({
//     projectType: String,
//     projectLocation: String,
//     city: String,
//     pincode: String,
//     services: [String],
//     imageUrl: String,
//     status: {
//         type: Number,
//         default: 4 // Default status for completed project
//     },
//     siteImages: [String]
// });

// export default mongoose.model('Project', projectSchema);







// import mongoose from 'mongoose';

// const projectSchema = new mongoose.Schema({
//     // Define your project schema fields here
//     // For simplicity, assuming only relevant fields here
//     owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     workers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
// });

// const ProjectModel = mongoose.model('Project', projectSchema);

// export default ProjectModel;
