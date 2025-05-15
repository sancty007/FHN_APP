import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  BarChart2,
  Menu,
  X,
  UserCog,
  LogOut,
} from "lucide-react";

// Logo FHN avec dégradé
const FHNLogo = () => {
  return (
    <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm">
      <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-green-500 bg-clip-text text-transparent">
        FHN
      </span>
    </div>
  );
};

// Composant pour la sidebar
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Récupérer les données utilisateur depuis localStorage
  const userNom = localStorage.getItem("nom") || "Utilisateur";
  const userEmail = localStorage.getItem("email") || "email@non.defini";
  const userRole = localStorage.getItem("role") || "";

  // Définir les éléments du menu
  const menuItems = [
    {
      name: "Tableau de bord",
      icon: <BarChart2 size={20} />,
      path: "/dashboard",
      roles: ["analyste", "secretaire"], // Visible pour analyste et secretaire
    },
    {
      name: "Gestion des Dossiers",
      icon: <FileText size={20} />,
      path: "/dossiers",
      roles: ["analyste", "secretaire"], // Visible pour analyste et secretaire
    },
    {
      name: "Gestion des utilisateurs",
      icon: <UserCog size={20} />,
      path: "/utilisateurs",
      roles: [], // Visible pour tous les autres rôles
    },
  ];

  // Filtrer les éléments du menu selon le rôle
  const filteredMenuItems = menuItems.filter((item) => {
    if (item.roles.length === 0) {
      // Afficher pour tous les rôles sauf analyste et secretaire
      return !["analyste", "secretaire"].includes(userRole);
    }
    return item.roles.includes(userRole);
  });

  // Fonction de déconnexion
  const handleLogout = () => {
    // Supprimer toutes les données utilisateur du localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("nom");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/"); // Rediriger vers la page d'accueil
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-green-700 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FHNLogo />
              <h2 className="text-xl font-bold ml-3">Admin</h2>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-white hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>
          <div className="mt-8 space-y-1">
            {filteredMenuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm rounded-lg hover:bg-green-600 transition-colors ${
                    isActive ? "bg-green-600" : ""
                  }`
                }
                end
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 w-full p-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
              <span className="font-medium text-sm">
                {userNom.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{userNom}</p>
              <p className="text-xs text-green-200">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center w-full text-sm text-green-200 hover:text-white"
          >
            <LogOut size={16} className="mr-2" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
};

// Header mobile
const MobileHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  // Fonction de déconnexion
  const handleLogout = () => {
    // Supprimer toutes les données utilisateur du localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("nom");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/"); // Rediriger vers la page d'accueil
  };

  return (
    <header className="bg-white shadow-sm lg:hidden">
      <div className="px-4 py-3 flex items-center justify-between">
        <button onClick={toggleSidebar} className="text-gray-600">
          <Menu size={24} />
        </button>
        <div className="flex items-center">
          <FHNLogo />
          <h1 className="text-lg font-bold text-green-700 ml-2">Admin</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <LogOut size={16} className="mr-1" />
          <span>Déconnexion</span>
        </button>
      </div>
    </header>
  );
};

// Layout principal qui contient la sidebar et le contenu
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 transition-all duration-300 lg:ml-64">
        <MobileHeader toggleSidebar={toggleSidebar} />

        {/* Outlet pour le contenu des différentes pages */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
