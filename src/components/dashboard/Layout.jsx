import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Users, FileText, BarChart2, Menu, X, UserCog } from "lucide-react";

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

  const menuItems = [
    {
      name: "Tableau de bord",
      icon: <BarChart2 size={20} />,
      path: "/dashboard",
    },
    {
      name: "Gestion des Dossiers",
      icon: <FileText size={20} />,
      path: "/dossiers",
    },
    {
      name: "Gestion des utilisateurs",
      icon: <UserCog size={20} />,
      path: "/utilisateurs",
    },
  ];

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
            {menuItems.map((item, index) => (
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
              <span className="font-medium text-sm">AD</span>
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-green-200">admin@fhn.org</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

// Header mobile
const MobileHeader = ({ toggleSidebar }) => {
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
        <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
          <span className="font-medium text-xs">AD</span>
        </div>
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
