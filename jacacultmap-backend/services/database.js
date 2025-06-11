const mongoose = require("mongoose");
const usermodel = require("../models/user_model");
const User = usermodel.User;

async function connectToDatabase(cluster, dbName) {
    await mongoose.connect(cluster, {dbName});
}

module.exports = { connectToDatabase };