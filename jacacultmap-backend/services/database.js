import mongoose from "mongoose";

export async function connectToDatabase(cluster, dbName) {
    await mongoose.connect(cluster, {dbName});
}