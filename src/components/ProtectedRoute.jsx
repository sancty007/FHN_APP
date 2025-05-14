import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const authUser = localStorage.getItem("authUser");
      setIsAuthenticated(!!authUser); // true si authUser existe, false sinon
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Chargement...</div>; // Afficher un loader pendant la vérification
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
