import React, { createContext, useState, useEffect, useContext } from "react";

// Création du contexte
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté au démarrage
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Vérifier si l'utilisateur est connecté en vérifiant le cookie JWT
        const response = await fetch(
          "https://fhn-backend-2.onrender.com/auth/me",
          {
            method: "GET",
            credentials: "include", // Pour inclure les cookies dans la requête
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
        } else {
          // Pas d'utilisateur connecté ou token expiré
          setCurrentUser(null);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'authentification:",
          error
        );
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const response = await fetch(
        "https://fhn-backend-2.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include", // Pour stocker les cookies
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }

      // Mettre à jour l'état de l'utilisateur connecté
      setCurrentUser(data.user);

      return { success: true, user: data.user };
    } catch (error) {
      throw error;
    }
  };

  // Fonction d'inscription
  const signup = async (name, email, password) => {
    try {
      const response = await fetch(
        "https://fhn-backend-2.onrender.com/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
          credentials: "include", // Pour stocker les cookies
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      // Mettre à jour l'état de l'utilisateur connecté
      setCurrentUser(data.user);

      return { success: true, user: data.user };
    } catch (error) {
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      // Appel à l'API de déconnexion si disponible
      await fetch("https://fhn-backend-2.onrender.com/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      // Dans tous les cas, on réinitialise l'état local
      setCurrentUser(null);
    }
  };

  // Valeur du contexte
  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
