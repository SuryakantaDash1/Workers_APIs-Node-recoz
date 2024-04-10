import { Router } from "express";
import { createPastProject, getOngoingProjectDetails, getPastProjectDetails, listOngoingProjects, uploadProjectImages } from "../controller/projectController.js";

const route = Router();

// Get past project details for a worker
route.get('/getPastProjects/:workerId', getPastProjectDetails);

// Create past project
route.post('/pastProjects', createPastProject);

// List ongoing projects for a worker
route.get('/ongoing-projects/:workerId', listOngoingProjects);

// Get ongoing project details
route.get('/ongoing-projects/:projectId', getOngoingProjectDetails);

// Upload project images
route.put('/project-images/:projectId', uploadProjectImages);

export default route;

