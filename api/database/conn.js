import mongoose from "mongoose";

async function connect() {
    try {
        const URL = process.env.MONGOURL;
        await mongoose.connect(URL);
        console.log("Database connected successfully!");
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
}

export default connect;
