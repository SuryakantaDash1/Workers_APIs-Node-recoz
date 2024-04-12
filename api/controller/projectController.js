
import projectWorkers from "../model/projectWorker.model.js";
import projects from "../model/project.model.js";







// Create a past project
export async function createPastProject(req, res) {
    try {
        const { workerId, projectType, projectLocation, City, Pincode, services, imageUrl } = req.body;


        // Create a new entry in projectWorkers collection
        await projectWorkers.create({
            workerId,
            projectType,
            projectLocation,
            City,
            Pincode,
            services,
            imageUrl,
            status: 4, // Completed status
            isWorking: false
        });

        return res.status(201).send({ msg: "Past project created successfully" });
    } catch (error) {
        console.error("Error creating past project:", error);
        return res.status(500).send({ error: "An error occurred while creating past project" });
    }
}




// Get all past project details for a specific worker
export async function getPastProjectDetails(req, res) {
    try {
        const { workerId } = req.params;

        // Find all past projects for the worker from projectWorkers collection
        const pastProjects = await projectWorkers.find({ workerId }).exec();

        return res.status(200).send(pastProjects);
    } catch (error) {
        console.error("Error fetching past project details:", error);
        return res.status(500).send({ error: "An error occurred while fetching past project details" });
    }
}





// List all ongoing projects for the worker
export async function listOngoingProjects(req, res) {
    try {
        const { workerId } = req.params;

        // Find all ongoing projects for the worker from projectWorkers collection
        const ongoingProjects = await projectWorkers.find({ workerId}).exec();

        return res.status(200).send(ongoingProjects);
    } catch (error) {
        console.error("Error listing ongoing projects:", error);
        return res.status(500).send({ error: "An error occurred while listing ongoing projects" });
    }
}



// Fetch project details along with owner and workers details
export async function getOngoingProjectDetails(req, res) {
    try {
        const { projectId } = req.params;

        // Find project details along with owner and workers details
        const projectDetails = await projects.findById(projectId).populate('ownerId').populate('workers').exec();

        return res.status(200).send(projectDetails);
    } catch (error) {
        console.error("Error fetching ongoing project details:", error);
        return res.status(500).send({ error: "An error occurred while fetching ongoing project details" });
    }
}



// Allow workers to upload images for the project
export async function uploadProjectImages(req, res) {
    try {
        const { projectId } = req.params;
        const { siteImages } = req.body;

        // Update project details with uploaded images
        const project = await projects.findByIdAndUpdate(projectId, { $push: { siteImages } }, { new: true });

        return res.status(200).send({ msg: "Project images uploaded successfully", project });
    } catch (error) {
        console.error("Error uploading project images:", error);
        return res.status(500).send({ error: "An error occurred while uploading project images" });
    }
}
