import mongoose from 'mongoose';

const userRequestSchema = new mongoose.Schema({
    // Define your user request schema fields here
    serviceId: String,
    date: Date,
    time: String,
    requiredServices: [String],
    additionalServices: [String],
    addressId: String,
    propertyImage: String,
    propertyArea: String,
    propertySpaceType: String,
    status: Number // 0: Cancelled, 1: Created, 2: Accepted, 3: Denied, 4: Proposal Created
});

const UserRequestModel = mongoose.model('UserRequest', userRequestSchema);

export default UserRequestModel;
