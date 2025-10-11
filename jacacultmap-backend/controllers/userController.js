import { getUserDataByEmail, updateUserByEmail } from "../services/userService.js";
import { verifyToken } from "../services/authService.js";

export async function getUserDataController(req, res) {

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: "Token é obrigatório" });
  }

  const email = await verifyToken(token);
  if (!email) {
    return res.status(401).json({ message: "Token inválido" });
  }

  const userData = await getUserDataByEmail(email);
  if (!userData) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  return res.status(201).json({userData});
}


export async function updateUserDataController(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  const { update } = req.body;
  console.log(update);

  if (!token) {
    return res.status(400).json({ message: "Token é obrigatório" });
  }

  const email = await verifyToken(token);
  if (!email) {
    return res.status(401).json({ message: "Token inválido" });
  }

  if (!update || typeof update !== 'object') {
    return res.status(400).json({ message: "Dados de atualização inválidos" });
  }

  try {
    await updateUserByEmail(email, update);
    return res.status(201).json({ message: "Dados do usuário atualizados com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar dados do usuário:", error.message);
    return res.status(500).json({ message: "Erro ao atualizar dados do usuário, tente novamente mais tarde." });
  }
} 