const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path: "../.env"});

const User = mongoose.model("Users", new mongoose.Schema({
    name: String,
    email: String,
    password: String
}));

async function connectToDatabase() {
    await mongoose.connect(process.env.DATABASE_URL_CLUSTER_0, {dbName: process.env.DB_NAME});
    console.log("Conectado ao MongoDB!");
}

async function createUser(name, email, password) {

    const user = new User({ name, email, password });
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

connectToDatabase().catch(err => console.log(err));
createUser("lepinho", "lepo22@gmail.com", "123456").catch(err => console.log(err));
updateUserByEmail("lepo22@gmail.com", { name: "João Eduardo"}).catch(err => console.log(err));