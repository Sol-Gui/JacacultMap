const usermodel = require("../models/user_model");
const { hash } = require("bcrypt")
const User = usermodel.User;

async function createUser(email, password) {

    const user = new User({ email, password });
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

async function userExists(email) {
    try {
        const exists = await User.findOne({ email });
        if (exists) return exists;
        else return false;
    } catch (err) {
        return false;
    }
}

module.exports = {
    createUser,
    updateUserByEmail,
    userExists
}