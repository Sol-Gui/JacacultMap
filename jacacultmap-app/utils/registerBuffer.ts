let email = '';
let senha = '';

export function setRegisterData(data: { email: string; senha: string }) {
  email = data.email;
  senha = data.senha;
}

export function getRegisterData() {
  return { email, senha };
}