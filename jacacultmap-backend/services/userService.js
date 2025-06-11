import User from '../models/user_model.js';

export async function createUser(email, password) {

    const user = new User({ email, password });
    await user.save();
    console.log("Usuário criado:", user);
}

export async function updateUserByEmail(email, updates) {
    const updated = await User.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true }
    );
    console.log('Usuário atualizado:', updated);
    return updated;
}

export async function userExists(email) {
    try {
        const exists = await User.findOne({ email });
        if (exists) return exists;
        else return false;
    } catch (err) {
        return false;
    }
}