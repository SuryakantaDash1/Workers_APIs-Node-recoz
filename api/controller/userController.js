import userModel from "../model/address.model.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();



const twilioAccountId = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(twilioAccountId, twilioAuthToken);

const generateOTP = () => {
    let digits = '0123456789';
    let OTP = '';
    let len = digits.length;
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * len)];
    }
    return OTP;
};





export async function verifyUser(req, res, next){
    try {
        const {username} = req.method == "GET" ? req.query : req.body;

        let exist = await userModel.findOne({username});
        if(!exist) return res.status(404).send({error: "can't find user"});
        next();
    } catch (error) {
        return res.status(500).send({ error: "Authentication error" });
    }
}




export async function register(req, res) {
    try {
        const { username, password, email, mobile, firstName, lastName, companyName,  profile, gender } = req.body;

        const existingUser = await userModel.findOne({ username }).exec();
        const existingEmail = await userModel.findOne({ email }).exec();
        const existingMobile = await userModel.findOne({ mobile }).exec();

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

        // Create a new user with OTP
        const newUser = new userModel({
            username,
            password,
            email,
            mobile,
            firstName,
            lastName,
            companyName,
            profile,
            gender,
            otp 
        });

        // Send OTP to user's mobile number using Twilio
        await client.messages.create({
            body: `Your OTP for registration is ${otp}`,
            messagingServiceSid: 'MGd8a92961ee9519e8ff116dea991aadae', 
            to: mobile // Send OTP to the user's mobile number
        });

        // Save the user to the database
        await newUser.save();

        // Send response
        return res.status(201).send({ msg: "User registered successfully. Please verify OTP." });

    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).send({ error: "An error occurred." });
    }
}

export async function verifyOTP(req, res) {
    try {
        const { mobile, otp } = req.body;

        // Find user by mobile number
        const user = await userModel.findOne({ mobile }).exec();

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
        const user = await userModel.findOne({ username,  }).exec();
        
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

        const user = await userModel.findOne({ username }).exec();
        
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
        const user = await userModel.findOne({ username }).exec();
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
        const deletedUser = await userModel.findOneAndDelete({ username }).exec();

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


