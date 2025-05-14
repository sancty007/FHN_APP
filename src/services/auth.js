// src/services/auth.js
export const checkAuth = async () => {
  try {
    const response = await fetch(
      "https://fhn-backend-2.onrender.com/auth/verify",
      {
        method: "GET",
        credentials: "include", // Inclut le cookie authToken
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Non authentifié");
    }

    return data.data; // Retourne les données utilisateur (email, role, userId)
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'authentification:",
      error
    );
    return null;
  }
};
