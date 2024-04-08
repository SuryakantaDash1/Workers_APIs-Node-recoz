import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "please provide username"],
        unique: [true, "Username exist"]
    },
    password: {
        type: String,
        required: [true, "please provide a password"],
        unique: false,
    },
    email: {
        type: String,
        required: [true, "please provide a email"],
        unique: true,
    },
    firstName: { 
        type: String, 
        
    },
    lastName: { 
        type: String, 
       
    },
   
    mobile: {
        type: Number,
        unique: true
    },
    profilePicture: {
        type: String
    },
    gender: {
        type: String
    },
    otp: {
        type: Number
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    yearsOfExperience: {
        type: Number
    },
    addresses: [{
        addressId: String,
        address: String,
        state: String,
        pincode: String,
        latitude: String,
        longitude: String
    }],
    servicesOffered: [{
        type: String
    }]
    
},
{ timestamps: true },

);

export default mongoose.model('Address', addressSchema);

