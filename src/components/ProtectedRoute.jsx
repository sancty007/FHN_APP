import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md">
      <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-medium text-gray-700">
        Vérification de l'authentification...
      </h2>
      <p className="mt-2 text-gray-500">Veuillez patienter un instant</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState({
    isChecking: true,
    isAuthenticated: false,
  });
  const [authDebug, setAuthDebug] = useState(""); // Pour déboguer

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Déboguer les cookies actuels
        const cookieDebug = document.cookie;
        console.log("Cookies actuels:", cookieDebug);
        setAuthDebug(`Cookies: ${cookieDebug || "Aucun"}`);

        // Vérifier si nous avons un token dans localStorage
        const localToken = localStorage.getItem("authToken");
        console.log(
          "Token dans localStorage:",
          localToken ? "Présent" : "Absent"
        );

        let headers = {
          Accept: "application/json",
        };

        // Ajouter le token dans les headers si présent
        if (localToken) {
          headers["Authorization"] = `Bearer ${localToken}`;
        }

        const response = await fetch(
          "https://fhn-backend-2.onrender.com/auth/checkAuth",
          {
            method: "GET",
            credentials: "include",
            headers: headers,
          }
        );

        console.log("ProtectedRoute: Statut de la réponse =", response.status);
        console.log("ProtectedRoute: OK =", response.ok);

        if (!response.ok) {
          const errorData = await response.json();
          console.log("ProtectedRoute: Détails de l'erreur =", errorData);
        }

        setAuthStatus({
          isChecking: false,
          isAuthenticated: response.ok,
        });
      } catch (err) {
        console.error("ProtectedRoute: Erreur lors de la vérification =", err);
        setAuthStatus({ isChecking: false, isAuthenticated: false });
      }
    };

    checkAuth();
  }, []);

  if (authStatus.isChecking) {
    return <LoadingSpinner />;
  }

  return authStatus.isAuthenticated ? (
    <>
      {/* Zone de débogage - À supprimer en production */}
      {authDebug && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-50 text-blue-700 p-2 text-xs z-50">
          <details>
            <summary>Informations de débogage</summary>
            {authDebug}
          </details>
        </div>
      )}
      {children}
    </>
  ) : (
    <Navigate to="/" state={{ error: "Veuillez vous connecter." }} />
  );
};

export default ProtectedRoute;
