import User from '../models/user_model.js';

export async function createUser(name, email, password, provider, options = {}) {
    const userData = {
        name,
        email, 
        password,
        provider,
        profilePicture: options.profilePicture || {
            imageBase64: process.env.DEFAULT_USER_ICON_B64,
            imageFormat: 'webp'
        },
        favoritedEventsById: options.favoritedEventsById || [],
        favoritedCategories: options.favoritedCategories || [],
        friends: options.friends || []
    };

    const user = new User(userData);
    await user.save();
    console.log("Usuário criado:", user);
    return user;
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
    return await User.findOne(
      { email },
      { email: 1, password: 1, _id: 0, provider: 1 }
    ) || false;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error.message);
    return false;
  }
}