import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserPlus, LogIn, Eye, EyeOff, Lock, Mail, User } from "lucide-react";

const HomePage = () => {
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoaded(true);
    if (location.state?.error) {
      setError(location.state.error);
      navigate("/", { replace: true, state: {} });
    }

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const headers = {
          Accept: "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          "https://fhn-backend-2.onrender.com/auth/checkAuth",
          {
            method: "GET",
            credentials: "include",
            headers: headers,
          }
        );
        console.log("HomePage: Statut de la réponse =", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.log("HomePage: Détails de l'erreur =", errorData);
        }

        setIsAuthenticated(response.ok);
      } catch (err) {
        console.error("HomePage: Erreur lors de la vérification =", err);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [location, navigate]);

  const validateForm = () => {
    if (
      !email ||
      !password ||
      (authMode === "signup" && (!username || !confirmPassword))
    ) {
      setError("Veuillez remplir tous les champs.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Adresse email invalide.");
      return false;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return false;
    }
    if (authMode === "signup" && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://fhn-backend-2.onrender.com/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ name: username, email, password }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Erreur lors de l'inscription");

      // Store token and user data from response
      if (data.data) {
        localStorage.setItem("authToken", data.data.token);
        localStorage.setItem("nom", data.data.nom || username);
        localStorage.setItem("email", data.data.email || email);
        localStorage.setItem("role", data.data.role || "");
        console.log(
          "Données utilisateur stockées dans localStorage après inscription"
        );
      }

      setSuccess(
        "Inscription réussie ! Vous serez redirigé automatiquement..."
      );
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");

      // Auto redirect after successful signup
      setTimeout(() => {
        setIsAuthenticated(true);
        if (data.data?.role === "parent") {
          navigate("/tuteur");
        } else if (
          data.data?.role === "analyste" ||
          data.data?.role === "secretaire"
        ) {
          navigate("/dashboard");
        } else {
          navigate("/utilisateurs"); // Redirection pour admin ou autres rôles
        }
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://fhn-backend-2.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log("HomePage: Réponse de /login =", data);

      if (!response.ok)
        throw new Error(data.message || "Erreur lors de la connexion");

      // Store token and user data from response
      if (data.data) {
        localStorage.setItem("authToken", data.data.token);
        localStorage.setItem("nom", data.data.nom || "");
        localStorage.setItem("email", data.data.email || email);
        localStorage.setItem("role", data.data.role || "");
        console.log(
          "Données utilisateur stockées dans localStorage après connexion"
        );
      }

      setSuccess("Connexion réussie !");
      setEmail("");
      setPassword("");
      setIsAuthenticated(true);

      setTimeout(() => {
        if (data.data?.role === "parent") {
          navigate("/tuteur");
        } else if (
          data.data?.role === "analyste" ||
          data.data?.role === "secretaire"
        ) {
          navigate("/dashboard");
        } else {
          navigate("/utilisateurs"); // Redirection pour admin ou autres rôles
        }
      }, 500);
    } catch (err) {
      console.error("HomePage: Erreur lors de la connexion =", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      await fetch("https://fhn-backend-2.onrender.com/auth/logout", {
        method: "POST",
        credentials: "include",
        headers,
      });

      // Remove all user data from localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("nom");
      localStorage.removeItem("email");
      localStorage.removeItem("role");

      setIsAuthenticated(false);
      navigate("/");
      setSuccess("Déconnexion réussie.");
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);

      // Disconnect user client-side even if API fails
      localStorage.removeItem("authToken");
      localStorage.removeItem("nom");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      setIsAuthenticated(false);
      navigate("/");
    }
  };

  const handleModeChange = (mode) => {
    if (mode === authMode) return;
    setIsLoaded(false);
    setTimeout(() => {
      setAuthMode(mode);
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess("");
      setIsLoaded(true);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
      <div className="max-w-xl w-full px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-md">
            <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-green-500 bg-clip-text text-transparent">
              FHN
            </span>
          </div>
        </div>

        <div
          className={`transition-all duration-1000 transform ${
            isLoaded ? "opacity-100" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-light text-gray-800 tracking-wider">
              Plateforme <span className="font-bold">Horizons Nouveaux</span>
            </h1>
            <p className="mt-2 text-gray-500 font-light">
              Recensement et suivi des enfants
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex mb-8 border-b">
              <div
                className={`flex-1 text-center py-3 cursor-pointer transition-all ${
                  authMode === "login"
                    ? "border-b-2 border-orange-500 text-orange-600 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleModeChange("login")}
              >
                <div className="flex items-center justify-center">
                  <LogIn size={18} className="mr-2" />
                  <span>Connexion</span>
                </div>
              </div>
              <div
                className={`flex-1 text-center py-3 cursor-pointer transition-all ${
                  authMode === "signup"
                    ? "border-b-2 border-green-500 text-green-600 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleModeChange("signup")}
              >
                <div className="flex items-center justify-center">
                  <UserPlus size={18} className="mr-2" />
                  <span>Inscription</span>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {authMode === "login" ? "Connexion" : "Création de compte"}
              </h2>
              <p className="text-gray-500 mt-2">
                {authMode === "login"
                  ? "Connectez-vous à votre compte"
                  : "Créez un nouveau compte"}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 text-sm">
                {success}
              </div>
            )}

            <div className="space-y-4">
              {authMode === "signup" && (
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nom d'utilisateur
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-2"
                      placeholder="Votre nom d'utilisateur"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium the-gray-700 mb-1"
                >
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-2"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-2"
                    placeholder="••••••••••"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {authMode === "signup" && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-2"
                      placeholder="••••••••••"
                    />
                  </div>
                </div>
              )}
            </div>

            {authMode === "login" && (
              <div className="flex justify-end mt-2">
                <span className="text-sm text-orange-500 hover:underline cursor-pointer">
                  Mot de passe oublié ?
                </span>
              </div>
            )}

            <button
              onClick={authMode === "login" ? handleLogin : handleSignup}
              disabled={isLoading}
              className={`w-full mt-6 py-3 px-4 rounded-md text-white font-medium flex items-center justify-center transition-colors ${
                authMode === "login"
                  ? "bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                "Chargement..."
              ) : authMode === "login" ? (
                <>
                  <LogIn size={18} className="mr-2" />
                  Se connecter
                </>
              ) : (
                <>
                  <UserPlus size={18} className="mr-2" />
                  S'inscrire
                </>
              )}
            </button>
          </div>

          <div className="text-center text-gray-500 text-sm">
            <p>
              Besoin d'aide ?{" "}
              <span className="text-green-500 hover:underline cursor-pointer">
                Contactez-nous
              </span>
            </p>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="mt-4 text-sm text-orange-500 hover:underline"
              >
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </div>
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 Fondation Horizons Nouveaux. Tous droits réservés.</p>
            <p className="mt-2">
              <span className="inline-flex space-x-4">
                <a href="#" className="hover:text-gray-700">
                  Conditions d'utilisation
                </a>
                <span className="text-gray-300">|</span>
                <a href="#" className="hover:text-gray-700">
                  Politique de confidentialité
                </a>
                <span className="text-gray-300">|</span>
                <a href="#" className="hover:text-gray-700">
                  Nous contacter
                </a>
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
