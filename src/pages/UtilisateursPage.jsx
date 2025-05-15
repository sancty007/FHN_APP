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
import { useEffect, useState } from "react";
import { UserModal } from "../components/user/userModale";

const UtilisateursPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://fhn-backend-2.onrender.com/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Échec de la récupération des utilisateurs");
      }

      const data = await response.json();
      console.log("Utilisateurs récupérés:", data.data);
      setUsers(data.data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      setError("Impossible de charger les utilisateurs. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fonction pour générer des avatars basés sur les initiales
  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "";
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
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  // Après l'ajout d'un utilisateur, récupérer la liste mise à jour
  const handleAddUser = async () => {
    await fetchUsers();
    setShowModal(false);
  };

  // Supprimer un utilisateur et mettre à jour la liste
  const handleDeleteUser = async (userId) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      try {
        const response = await fetch(
          `https://fhn-backend-2.onrender.com/users/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Échec de la suppression de l'utilisateur");
        }

        // Récupérer la liste mise à jour
        fetchUsers();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression de l'utilisateur");
      }
    }
  };

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter((user) => {
    const nom = user.nom || ""; // Fallback to empty string
    const email = user.email || ""; // Fallback to empty string
    const query = searchTerm.toLowerCase();
    return (
      nom.toLowerCase().includes(query) || email.toLowerCase().includes(query)
    );
  });

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

          <div className="flex gap-2">
            <button
              className="bg-gray-100 rounded-lg px-4 py-2.5 flex items-center text-sm text-gray-600 hover:bg-gray-200 transition-all"
              onClick={fetchUsers}
              disabled={isLoading}
            >
              Actualiser
            </button>

            <button
              className="bg-green-600 rounded-lg px-4 py-2.5 flex items-center text-sm text-white hover:bg-green-700 transition-all transform hover:scale-105 shadow-sm"
              onClick={() => setShowModal(true)}
            >
              <Plus size={18} className="mr-2" />
              Nouvel utilisateur
            </button>
          </div>
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

        {/* Message d'erreur */}
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-100">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* État de chargement */}
        {isLoading && !error && (
          <div className="p-12 flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Chargement des utilisateurs...
            </h3>
          </div>
        )}

        {/* Liste des utilisateurs */}
        {!isLoading && !error && filteredUsers.length > 0 ? (
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
        ) : !isLoading && !error ? (
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
        ) : null}

        {/* Pied de page avec pagination */}
        {!isLoading && !error && users.length > 0 && (
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
