import User from '../models/user_model.js';
import { connectToDatabase } from './database.js';

export async function createUser(name, email, password, provider, options = {}) {
    await connectToDatabase();
    const userData = {
        name,
        email, 
        password,
        provider,
        profilePicture: options.profilePicture || {
            imageBase64: 'NO-IMAGE',
            imageFormat: 'webp'
        },
        favoritedEventsById: options.favoritedEventsById || [],
        favoritedCategories: options.favoritedCategories || [],
        friends: options.friends || []
    };

    const user = new User(userData);
    await user.save();
    return user;
}

export async function updateUserByEmail(email, updates) {
    await connectToDatabase();
    const updated = await User.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true }
    );
    return updated;
}

export async function userExists(email) {
  await connectToDatabase();
  try {
    return await User.findOne(
      { email },
      { email: 1, password: 1, _id: 0, provider: 1 }
    ) || false;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error.message);
    return false;
  }
}

export async function getUserRoleByEmail(email) {
  await connectToDatabase();
  try {
    return await User.findOne(
      { email },
      { role: 1, _id: 0 }
    );
  } catch (error) {
    console.error("Erro ao buscar usuário:", error.message);
    return null;
  }
}

export async function getUserDataByEmail(email) {
  await connectToDatabase();
  try {
    return await User.findOne(
      { email },
      { _id: 0, __v: 0, password: 0 }
    );
  }
  catch (error) {
    console.error("Erro ao buscar dados do usuário:", error.message);
    return null;
  }
}