"use client";

import {
  Edit,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { UserModal } from "../components/user/userModale";

const UtilisateursPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fonction pour générer des avatars basés sur les initiales
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Fonction pour générer une couleur d'arrière-plan basée sur le nom
  const getAvatarBg = (name) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-yellow-100 text-yellow-600",
      "bg-pink-100 text-pink-600",
      "bg-indigo-100 text-indigo-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => {
      return [...prevUsers, { ...newUser, id: Date.now() }];
    });
  };

  const handleDeleteUser = (userId) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    }
  };

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter(
    (user) =>
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <UserModal
        showModal={showModal}
        setShowModal={setShowModal}
        onUserCreated={handleAddUser}
      />

      {/* En-tête de page */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <Users className="mr-3 text-green-600" size={28} />
          Gestion des utilisateurs
        </h1>
        <p className="text-gray-500 flex items-center">
          Administration des comptes et des permissions
          <span className="inline-block mx-2 w-1 h-1 rounded-full bg-gray-300"></span>
          {new Date().toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Carte principale */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {/* En-tête de la carte */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <UserPlus className="mr-2 text-green-600" size={20} />
              Utilisateurs
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                {users.length}
              </span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Gérez les comptes utilisateurs et leurs permissions
            </p>
          </div>

          <button
            className="bg-green-600 rounded-lg px-4 py-2.5 flex items-center text-sm text-white hover:bg-green-700 transition-all transform hover:scale-105 shadow-sm"
            onClick={() => setShowModal(true)}
          >
            <Plus size={18} className="mr-2" />
            Nouvel utilisateur
          </button>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <div className="flex flex-wrap gap-3 justify-between">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                className="bg-white rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
            </div>
            <button className="bg-white rounded-lg border border-gray-200 px-4 py-2.5 flex items-center text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Filter size={16} className="mr-2 text-gray-500" />
              Filtres
            </button>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${getAvatarBg(
                            user.nom
                          )}`}
                        >
                          {getInitials(user.nom)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.nom}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "analyste"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Supprimer"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                          title="Plus d'options"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              {searchTerm
                ? "Aucun utilisateur ne correspond à votre recherche. Essayez avec d'autres termes."
                : "Vous n'avez pas encore ajouté d'utilisateurs. Commencez par créer un nouvel utilisateur."}
            </p>
            <button
              className="bg-green-600 rounded-lg px-4 py-2.5 flex items-center text-sm text-white hover:bg-green-700 transition-all transform hover:scale-105"
              onClick={() => setShowModal(true)}
            >
              <Plus size={18} className="mr-2" />
              Ajouter un utilisateur
            </button>
          </div>
        )}

        {/* Pied de page avec pagination (à implémenter si nécessaire) */}
        {users.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Affichage de {filteredUsers.length} sur {users.length}{" "}
              utilisateurs
            </div>
            <div className="flex space-x-1">
              <button className="px-3 py-1 rounded border border-gray-200 text-sm text-gray-600 hover:bg-white">
                Précédent
              </button>
              <button className="px-3 py-1 rounded border border-gray-200 bg-white text-sm text-gray-800 font-medium">
                1
              </button>
              <button className="px-3 py-1 rounded border border-gray-200 text-sm text-gray-600 hover:bg-white">
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default UtilisateursPage;
