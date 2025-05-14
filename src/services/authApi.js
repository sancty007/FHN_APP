// src/services/authApi.js
export const signup = async ({ username, email, password }) => {
  if (!email || !username || !password) {
    throw new Error("Veuillez remplir tous les champs.");
  }

  const response = await fetch(
    "https://fhn-backend-2.onrender.com/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        email,
        password,
      }),
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de l'inscription");
  }

  return data;
};

export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Veuillez remplir tous les champs.");
  }

  // Placeholder for login API call
  // Replace with actual endpoint when available
  const response = await fetch(
    "https://fhn-backend-2.onrender.com/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de la connexion");
  }

  return data;
};
