import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

async function createToken(email) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
} // Criar token de autenticação, que deverá ser chamado e salvo na expo local storage.

async function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.email;
    } catch (err) {
        console.log("Token inválido ou expirado!");
        return null;
    }
} // Verificar se o token é válido e retornar o email do usuário.

async function signIn(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        console.log("Usuário não encontrado!");
        return null;
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        console.log("Senha incorreta!");
        return null;
    }
    const token = await criarToken(email);
    console.log("Login bem-sucedido! Token:", token);
    return token;
} // Verificar se o usuário existe e se a senha está correta.

async function signUp(name, email, password) {
    try {
        const user = await User.findOne({ email });
        if (user) {
            return { success: false, message: "Usuário já existe!" };
        }

        if (password.length < 6) {
            return { success: false, message: "Senha muito curta! A senha deve ter pelo menos 6 caracteres." };
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = await criarToken(email); // Certifique-se de que essa função está implementada corretamente

        return {
            success: true,
            message: "Usuário criado com sucesso!",
            token
        };

    } catch (error) {
        console.error("Erro no cadastro:", error);
        return { success: false, message: "Erro interno ao criar usuário." };
    }
}
