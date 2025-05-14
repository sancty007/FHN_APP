// src/pages/UtilisateursPage.jsx
import { UserCog, Filter, Plus, Search } from "lucide-react";

const UtilisateursPage = () => {
  return (
    <main className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Gestion des utilisateurs
        </h1>
        <p className="text-gray-500">
          Administration des comptes et des permissions -{" "}
          {new Date().toLocaleDateString("fr-FR")}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-8 justify-between">
        <button className="bg-green-600 rounded-lg shadow-sm px-4 py-2.5 flex items-center text-sm text-white hover:bg-green-700 transition-colors">
          <Plus size={16} className="mr-2" />
          Nouvel utilisateur
        </button>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className="bg-white rounded-lg shadow-sm pl-10 pr-4 py-2.5 text-sm text-gray-600 w-64"
            />
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button className="bg-white rounded-lg shadow-sm px-4 py-2.5 flex items-center text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={16} className="mr-2" />
            Filtres
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-lg mb-6">Liste des utilisateurs</h3>
        <p className="text-gray-600">
          Cette page permettra de gérer les utilisateurs du système, leurs rôles
          et leurs permissions. Vous pourrez ajouter de nouveaux utilisateurs,
          modifier leurs informations et gérer leurs accès.
        </p>
        <div className="mt-4 p-8 border border-dashed border-gray-300 rounded-lg flex items-center justify-center">
          <p className="text-gray-400 text-center">
            Contenu de la page des utilisateurs à implémenter
          </p>
        </div>
      </div>
    </main>
  );
};

export default UtilisateursPage;
