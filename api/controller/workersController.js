import addressModel from "../model/workers.model.js";
import projects from '../model/project.model.js';
import projectWorkers from '../model/projectWorker.model.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();



const generateOTP = () => {
    let digits = '0123456789';
    let OTP = '';
    let len = digits.length;
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * len)];
    }
    return OTP;
};


export async function register(req, res) {
    try {
        const { username, password, email, mobile, firstName, lastName, yearsOfExperience, profile, gender } = req.body;

        const existingUser = await addressModel.findOne({ username }).exec();
        const existingEmail = await addressModel.findOne({ email }).exec();
        const existingMobile = await addressModel.findOne({ mobile }).exec();

        if (existingUser) {
            return res.status(400).send({ error: "Please use a unique username." });
        }

        if (existingEmail) {
            return res.status(400).send({ error: "Please use a unique email." });
        }

        if (existingMobile) {
            return res.status(400).send({ error: "Mobile number already exists" });
        }

        // Generate OTP
        const otp = generateOTP();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with OTP
        const newUser = new addressModel({
            username,
            password: hashedPassword,
            email,
            mobile,
            firstName,
            lastName,
            yearsOfExperience,
            profile,
            gender,
            otp 
        });

        // Construct the message
        const phone = String(mobile).replace("+", "");
        const message = `Dear Customer, Your OTP for mobile number verification is ${otp}. Please do not share this OTP to anyone - Firstricoz Pvt. Ltd.`;

        // Make request to your company's SMS gateway
        const response = await fetch(`https://smsgw.tatatel.co.in:9095/campaignService/campaigns/qs?dr=false&sender=FRICOZ&recipient=${phone}&msg=${encodeURIComponent(message)}&user=FIRSTR&pswd=First^01&PE_ID=1601832170235925649&Template_ID=1607100000000306120`);

        // Check if the request was successful
        if (response.ok) {
            // Save the user to the database
            await newUser.save();
            
            // Send response
            return res.status(201).send({ msg: "User registered successfully. Please verify OTP." });
        } else {
            throw new Error('Failed to send OTP via SMS');
        }
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).send({ error: "An error occurred." });
    }
}









export async function verifyUser(req, res, next){
    try {
        const {username} = req.method == "GET" ? req.query : req.body;

        let exist = await addressModel.findOne({username});
        if(!exist) return res.status(404).send({error: "can't find user"});
        next();
    } catch (error) {
        return res.status(500).send({ error: "Authentication error" });
    }
}




export async function verifyOTP(req, res) {
    try {
        const { mobile, otp } = req.body;

        // Find user by mobile number
        const user = await addressModel.findOne({ mobile }).exec();

        if (!user) {
            return res.status(404).send({ error: "User not found." });
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            return res.status(400).send({ error: "Invalid OTP." });
        }

        // Update user's status to verified
        user.isVerified = true;

        // Save updated user
        await user.save();

        // Send response
        return res.status(200).send({ msg: "OTP verified successfully. User registered." });

    } catch (error) {
        console.error("Error during OTP verification:", error);
        return res.status(500).send({ error: "An error occurred." });
    }
}







export async function login(req, res) {
    const { username, password } = req.body;
    try {
        // Find user by username
        const user = await addressModel.findOne({ username,  }).exec();
        
        // If user doesn't exist
        if (!user) {
            return res.status(404).send({ error: "Username not found" });
        }

        // Check if password matches
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        // If password doesn't match
        if (!passwordMatch) {
            return res.status(400).send({ error: "Password does not match" });
        }

        const token = jwt.sign({
            userId: user._id,
            username: user.username
        }, process.env.JWT_SECRET, {expiresIn: "30d"});

        // Attach token to response headers
        res.setHeader('Authorization', `Bearer ${token}`);

        // Respond with successful login message
        return res.status(200).send({
            msg: "Login successful",
            token
            
        });
    } catch (error) {
        console.error("Error in login function:", error);
        return res.status(500).send({ error: "An error occurred." });
    }
}


export async function getUser(req, res) {
    const { username } = req.params;

    try {
        if (!username) {
            return res.status(501).send({ error: "Invalid username" });
        }

        const user = await addressModel.findOne({ username }).exec();
        
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        return res.status(200).send(user);
    } catch (error) {
        console.error("Error retrieving user data:", error);
        return res.status(500).send({ error: "An error occurred while fetching user data" });
    }
}




export async function updateUser(req, res) {
    const { username } = req.params;
    const updates = req.body; // New user details to update

    try {
        // Validate username
        if (!username) {
            return res.status(400).send({ error: "Invalid username" });
        }

        // Find the user by username
        const user = await addressModel.findOne({ username }).exec();
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        // Update user details
        Object.assign(user, updates);
        await user.save();

        return res.status(200).send({ msg: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).send({ error: "An error occurred while updating user" });
    }
}



export async function deleteUser(req, res) {
    const { username } = req.params;

    try {
        // Validate username
        if (!username) {
            return res.status(400).send({ error: "Invalid username" });
        }

        // Find the user by username and delete
        const deletedUser = await addressModel.findOneAndDelete({ username }).exec();

        // Check if user exists
        if (!deletedUser) {
            return res.status(404).send({ error: "User not found" });
        }

        return res.status(200).send({ msg: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).send({ error: "An error occurred while deleting user" });
    }
}




// Function to set address details
export async function setAddressDetails(req, res) {
    try {
        const { userId, addressId, address, state, pincode, latitude, longitude } = req.body;

        // Find the user by userId
        const user = await addressModel.findOne({ _id: userId }).exec();

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        // Push new address details to addresses array
        user.addresses.push({ addressId, address, state, pincode, latitude, longitude });

        await user.save();

        return res.status(200).send({ msg: "Address details added successfully" });
    } catch (error) {
        console.error("Error setting address details:", error);
        return res.status(500).send({ error: "An error occurred while setting address details" });
    }
}

// Function to set services offered by the worker
export async function setServicesOffered(req, res) {
    try {
        const { userId, services } = req.body;

        // Find the user by workerId
        const user = await addressModel.findOne({ _id: userId }).exec();

        if (!user) {
            return res.status(404).send({ error: "Worker not found" });
        }

        // Update services offered
        user.servicesOffered = services;

        await user.save();

        return res.status(200).send({ msg: "Services offered updated successfully" });
    } catch (error) {
        console.error("Error setting services offered:", error);
        return res.status(500).send({ error: "An error occurred while setting services offered" });
    }
}


// Function to get address details
export async function getAddressDetails(req, res) {
    try {
        const { username } = req.params;

        const user = await addressModel.findOne({ username }).exec();
        
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        // Return address details
        return res.status(200).send(user.addresses);
    } catch (error) {
        console.error("Error retrieving address details:", error);
        return res.status(500).send({ error: "An error occurred while fetching address details" });
    }
}

// Function to update address details
export async function updateAddressDetails(req, res) {
    try {
        const { username, addressId } = req.params;
        const updates = req.body;

        const user = await addressModel.findOne({ username }).exec();
        
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        // Find the address by its unique ID
        const addressToUpdate = user.addresses.find(address => address._id.toString() === addressId);
        if (!addressToUpdate) {
            return res.status(404).send({ error: "Address not found" });
        }

        // Update address details
        Object.assign(addressToUpdate, updates);
        await user.save();

        return res.status(200).send({ msg: "Address details updated successfully" });
    } catch (error) {
        console.error("Error updating address details:", error);
        return res.status(500).send({ error: "An error occurred while updating address details" });
    }
}







// Controller function
export async function createPastProject(req, res) {
    try {
        const { projectId, projectType, projectLocation, city, pincode, services, imageUrl, status } = req.body;
       

        // Create past project details
        const newProject = new projectWorkers({
            projectId,
            projectType,
            projectLocation,
            city,
            pincode,
            services,
            imageUrl,
            status // Status 4 represents completed project
        });
        await newProject.save();
        
        
        return res.status(201).send({ msg: "Past project created successfully" });
    } catch (error) {
        console.error("Error creating past project:", error);
        return res.status(500).send({ error: "An error occurred while creating past project" });
    }
}






export async function getPastProjects(req, res) {
    try {
        // const workerId = req.params.workerId;
        const { workerId } = req.params;

        // Fetch past project details for the worker
        const pastProjects = await projectWorkers.find({ workerId, isWorking: false }).exec();

        return res.status(200).send({ pastProjects });
    } catch (error) {
        console.error("Error fetching past projects:", error);
        return res.status(500).send({ error: "An error occurred while fetching past projects" });
    }
}


export async function getOngoingProjects(req, res) {
    try {
        const workerId = req.params.workerId;
        // Fetch ongoing project details for the worker
        const ongoingProjects = await projectWorkers.find({ workerId, isWorking: true }).populate('projectId').exec();
        return res.status(200).send({ ongoingProjects });
    } catch (error) {
        console.error("Error fetching ongoing projects:", error);
        return res.status(500).send({ error: "An error occurred while fetching ongoing projects" });
    }
}


export async function getOngoingProjectDetails(req, res) {
    try {
        const projectId = req.params.projectId;
        // Fetch project details along with owner and worker details for the specified project
        const projectDetails = await projects.findById(projectId).populate('ownerId').populate('workers').exec();
        return res.status(200).send({ projectDetails });
    } catch (error) {
        console.error("Error fetching ongoing project details:", error);
        return res.status(500).send({ error: "An error occurred while fetching ongoing project details" });
    }
}



export async function updateProjectDetails(req, res) {
    try {
        const projectId = req.params.projectId;
        const { siteImages } = req.body;
        // Update project details to allow workers to upload site images
        const updatedProject = await projects.findByIdAndUpdate(projectId, { $push: { siteImages } }, { new: true });
        return res.status(200).send({ msg: "Project details updated successfully", updatedProject });
    } catch (error) {
        console.error("Error updating project details:", error);
        return res.status(500).send({ error: "An error occurred while updating project details" });
    }
}


