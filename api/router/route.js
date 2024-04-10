import { Router } from "express";
import { register, deleteUser,  updateUser, verifyOTP, verifyUser, setAddressDetails, setServicesOffered, getAddressDetails, updateAddressDetails, login, getUser } from "../controller/workersController.js";
const router = Router();
import Auth from "../middleware/auth.js";
import { validationSchema } from "../utils/userValidation.js";



router.post('/register', (req, res) => {
    // Validate request body against the schema 
    const { error } = validationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    register(req, res);
});

router.post('/verifyOtp', verifyOTP);
router.post('/login', verifyUser, login);
router.get('/getuser/:username', getUser);
router.put('/updateuser/:username', Auth,  updateUser);
router.delete('/deleteuser/:username', deleteUser);

router.post('/setAddressDetails', setAddressDetails);
router.post('/setServicesOffered', setServicesOffered);
router.get('/getAddressDetails/:username', getAddressDetails);
router.put('/updateAddressDetails/:username/:addressId', updateAddressDetails);




// router.post('/createPastProject', createPastProject);
// router.get('/getPastProject/:workerId', getPastProjects);


// router.get('/getOngoingProjects/:workerId', getOngoingProjects);
// router.get('/getOngoingProjectDetails/:projectId', getOngoingProjectDetails);
// router.put('/updateProjectDetails/:projectId', updateProjectDetails);


export default router;












