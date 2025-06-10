const API_URL = process.env.VERCEL_PUBLIC_API_URL

export async function signInAuth(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao fazer login');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function signUpAuth(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Erro ao fazer cadastro');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}