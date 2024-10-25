import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_URI);
        console.log(`BD connect on ${connection.connection.db.databaseName}`);
        console.log(`DB port ${connection.connection.port}`);
        console.log(`DB host ${connection.connection.host}`);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
    }
}

export default connectDb;