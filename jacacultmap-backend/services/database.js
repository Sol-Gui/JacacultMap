const mongoose = require("mongoose");
const usermodel = require("../models/user_model");
const User = usermodel.User;

async function connectToDatabase(cluster, dbName) {
    await mongoose.connect(cluster, {dbName});
    console.log("Conectado ao MongoDB!");
}

async function createUser(email, password) {

    const user = new User({email, password });
    await user.save();
    console.log("Usuário criado:", user);
}

async function updateUserByEmail(email, updates) {
    const updated = await User.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true }
    );
    console.log('Usuário atualizado:', updated);
    return updated;
  }  

module.exports = { connectToDatabase, createUser };