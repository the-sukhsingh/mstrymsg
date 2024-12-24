import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const conncection:ConnectionObject = {};

async function dbConnect():Promise<void>{ 
    if(conncection.isConnected){
        console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        conncection.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.log("Error connecting to database", error);
        process.exit(1);
    }

}


export default dbConnect;