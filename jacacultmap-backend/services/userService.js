const usermodel = require("../models/user_model");
const User = usermodel.User;

async function createUser(email, password) {

    const user = new User({email, password });
    await user.save();
    console.log("Usuário criado:", user);
}

module.exports = {
    createUser
}