import { Router } from "express";
import { createNewUserRequest, createPastProjectDetails, deletePastProject, deleteUser, editProjectDetails, getAllUserRequests, getOngoingProjectDetails, getPastProjectDetails, getUser, listOngoingProjects, login, register, setServicesOffered, updateAllRequestStatus, updatePastProject, updateProjectDetails, updateUser, verifyOTP, verifyUser } from "../controller/userController.js";
const router = Router();
import Auth from "../middleware/auth.js";
import { validationSchema } from "../utils/userValidation.js";


// router.post('/register', register);
router.post('/register', (req, res) => {
    // Validate request body against the schema
    const { error } = validationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Call the register function from the controller
    register(req, res);
});

router.post('/verifyOtp', verifyOTP);
router.post('/login', verifyUser, login);
router.get('/getuser/:username', getUser);
router.put('/updateuser/:username', Auth,  updateUser);
router.delete('/deleteuser/:username', deleteUser);


// router.post('/setServicesOffered', setServicesOffered); 
// router.get('/getPastProjectDetails/:partnerId', getPastProjectDetails); 
// router.post('/createPastProjectDetails', createPastProjectDetails); 
// router.put('/updatePastProject/:projectId', updatePastProject);
// router.delete('/deletePastProject', deletePastProject);



// router.post('/user-requests', createNewUserRequest);
// router.get('/getAllUserReq', getAllUserRequests);
// router.put('/updateRequestStatus', updateAllRequestStatus);

// // Routes for ongoing projects related APIs
// router.get('/ongoing-projects', listOngoingProjects);
// router.get('/ongoing-project-details/:projectId', getOngoingProjectDetails);
// router.put('/update-project-details', updateProjectDetails); 
// router.put('/edit-project-details', editProjectDetails);

export default router;












