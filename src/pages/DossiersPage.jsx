import { useState } from "react";
import {
  FileText,
  Filter,
  ChevronDown,
  Calendar,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Upload,
  Download,
  List,
  Grid,
} from "lucide-react";

// Données fictives pour la démo
const mockDossiers = [
  {
    id: "2025-0001",
    nom: "Ngoyi Mabanza",
    dateNaissance: "2018-05-12",
    sexe: "M",
    commune: "Akiéni Centre",
    parent: {
      nom: "Albert Mabanza",
      telephone: "077123456",
      email: "albert@example.com",
    },
    statutDossier: "Nouveau",
    dateCreation: "2025-05-10T09:23:45",
    utilisateurCreateur: "parent",
    observations: [],
    documents: ["carte_identite.pdf", "certificat_naissance.pdf"],
  },
  {
    id: "2025-0002",
    nom: "Marie Okemba",
    dateNaissance: "2019-11-23",
    sexe: "F",
    commune: "Okondja",
    parent: {
      nom: "Jeanne Okemba",
      telephone: "074567890",
      email: "jeanne@example.com",
    },
    statutDossier: "En cours",
    dateCreation: "2025-05-08T14:12:30",
    utilisateurCreateur: "secretaire",
    observations: ["Présente un retard de développement à confirmer"],
    documents: ["formulaire_medical.pdf"],
  },
  {
    id: "2025-0003",
    nom: "Patrice Mouyabi",
    dateNaissance: "2017-03-04",
    sexe: "M",
    commune: "Franceville",
    parent: { nom: "Pierre Mouyabi", telephone: "066789123", email: null },
    statutDossier: "Incomplet",
    dateCreation: "2025-05-07T10:45:22",
    utilisateurCreateur: "secretaire",
    observations: ["Manque certificat médical"],
    documents: ["photo_identite.jpg"],
  },
  {
    id: "2025-0004",
    nom: "Charlotte Ndong",
    dateNaissance: "2020-09-17",
    sexe: "F",
    commune: "Akiéni Centre",
    parent: {
      nom: "Sylvie Ndong",
      telephone: "074123789",
      email: "sylvie@example.com",
    },
    statutDossier: "Accepté",
    dateCreation: "2025-05-05T16:34:12",
    utilisateurCreateur: "secretaire",
    observations: ["Admise pour la rentrée prochaine"],
    documents: [
      "carte_identite.pdf",
      "certificat_medical.pdf",
      "formulaire_admission.pdf",
    ],
  },
  {
    id: "2025-0005",
    nom: "Jean Boubala",
    dateNaissance: "2019-07-30",
    sexe: "M",
    commune: "Mounana",
    parent: {
      nom: "Marc Boubala",
      telephone: "066456123",
      email: "marc@example.com",
    },
    statutDossier: "Rejeté",
    dateCreation: "2025-05-04T11:23:56",
    utilisateurCreateur: "secretaire",
    observations: ["Ne correspond pas aux critères d'admission"],
    documents: ["carte_identite.pdf", "lettre_motivation.pdf"],
  },
  {
    id: "2025-0006",
    nom: "Sophie Matsanga",
    dateNaissance: "2018-12-05",
    sexe: "F",
    commune: "Akiéni Centre",
    parent: {
      nom: "Paul Matsanga",
      telephone: "077345678",
      email: "paul@example.com",
    },
    statutDossier: "Clôturé",
    dateCreation: "2025-05-01T08:16:45",
    utilisateurCreateur: "secretaire",
    observations: ["Dossier complet, suivi terminé"],
    documents: [
      "carte_identite.pdf",
      "certificat_medical.pdf",
      "rapport_final.pdf",
    ],
  },
];

const DossiersPage = () => {
  // États
  const [dossiers, setDossiers] = useState(mockDossiers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("Tous");
  const [selectedCommune, setSelectedCommune] = useState("Toutes");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewMode, setViewMode] = useState("liste");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showDatePanel, setShowDatePanel] = useState(false);

  // Liste des statuts possibles
  const statuts = [
    "Tous",
    "Nouveau",
    "En cours",
    "Incomplet",
    "Accepté",
    "Rejeté",
    "Clôturé",
  ];

  // Liste des communes (extraite des données)
  const communes = [
    "Toutes",
    ...Array.from(new Set(mockDossiers.map((d) => d.commune))),
  ];

  // Filtrage des dossiers
  const filteredDossiers = dossiers.filter((dossier) => {
    // Filtre par recherche textuelle
    const matchesSearch =
      dossier.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dossier.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dossier.parent.nom.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtre par statut
    const matchesStatut =
      selectedStatut === "Tous" || dossier.statutDossier === selectedStatut;

    // Filtre par commune
    const matchesCommune =
      selectedCommune === "Toutes" || dossier.commune === selectedCommune;

    // Filtre par date
    const dossierDate = new Date(dossier.dateCreation);
    const matchesStartDate = !startDate || dossierDate >= new Date(startDate);
    const matchesEndDate = !endDate || dossierDate <= new Date(endDate);

    return (
      matchesSearch &&
      matchesStatut &&
      matchesCommune &&
      matchesStartDate &&
      matchesEndDate
    );
  });

  // Fonction pour obtenir la couleur en fonction du statut
  const getStatusColor = (statut) => {
    switch (statut) {
      case "Nouveau":
        return "bg-blue-100 text-blue-800";
      case "En cours":
        return "bg-yellow-100 text-yellow-800";
      case "Incomplet":
        return "bg-orange-100 text-orange-800";
      case "Accepté":
        return "bg-green-100 text-green-800";
      case "Rejeté":
        return "bg-red-100 text-red-800";
      case "Clôturé":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fonction pour obtenir l'icône en fonction du statut
  const getStatusIcon = (statut) => {
    switch (statut) {
      case "Nouveau":
        return <FileText size={16} />;
      case "En cours":
        return <Clock size={16} />;
      case "Incomplet":
        return <AlertCircle size={16} />;
      case "Accepté":
        return <CheckCircle size={16} />;
      case "Rejeté":
        return <X size={16} />;
      case "Clôturé":
        return <CheckCircle size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <main className="p-4 md:p-6 lg:p-8">
      {/* En-tête avec statistiques */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Gestion des dossiers
        </h1>
        <p className="text-gray-500">
          Liste et gestion des dossiers de recensement -{" "}
          {new Date().toLocaleDateString("fr-FR")}
        </p>

        {/* Carte de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total des dossiers</p>
                <h3 className="text-2xl font-bold">{dossiers.length}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText size={20} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">En attente</p>
                <h3 className="text-2xl font-bold">
                  {
                    dossiers.filter((d) =>
                      ["Nouveau", "En cours", "Incomplet"].includes(
                        d.statutDossier
                      )
                    ).length
                  }
                </h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock size={20} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Acceptés</p>
                <h3 className="text-2xl font-bold">
                  {dossiers.filter((d) => d.statutDossier === "Accepté").length}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Rejetés</p>
                <h3 className="text-2xl font-bold">
                  {dossiers.filter((d) => d.statutDossier === "Rejeté").length}
                </h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <X size={20} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et bouton nouveau dossier */}
      <div className="flex flex-wrap gap-3 mb-6 justify-between">
        <button className="bg-green-600 rounded-lg shadow-sm px-4 py-2.5 flex items-center text-sm text-white hover:bg-green-700 transition-colors">
          <Plus size={16} className="mr-2" />
          Nouveau dossier
        </button>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <button
              className="bg-white rounded-lg shadow-sm px-4 py-2.5 flex items-center text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <Filter size={16} className="mr-2" />
              Filtres
              <ChevronDown size={16} className="ml-2" />
            </button>

            {showFilterPanel && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-10">
                <h4 className="font-semibold mb-2">Filtrer par statut</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {statuts.map((statut) => (
                    <button
                      key={statut}
                      className={`px-3 py-1 rounded-full text-xs ${
                        selectedStatut === statut
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedStatut(statut)}
                    >
                      {statut}
                    </button>
                  ))}
                </div>

                <h4 className="font-semibold mb-2">Filtrer par commune</h4>
                <select
                  className="w-full p-2 border rounded-lg mb-4"
                  value={selectedCommune}
                  onChange={(e) => setSelectedCommune(e.target.value)}
                >
                  {communes.map((commune) => (
                    <option key={commune} value={commune}>
                      {commune}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end">
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                    onClick={() => {
                      setSelectedStatut("Tous");
                      setSelectedCommune("Toutes");
                      setShowFilterPanel(false);
                    }}
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="bg-white rounded-lg shadow-sm px-4 py-2.5 flex items-center text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={() => setShowDatePanel(!showDatePanel)}
            >
              <Calendar size={16} className="mr-2" />
              Période
              <ChevronDown size={16} className="ml-2" />
            </button>

            {showDatePanel && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10">
                <h4 className="font-semibold mb-2">Filtrer par date</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-lg"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-lg"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                      setShowDatePanel(false);
                    }}
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative grow md:grow-0 min-w-[240px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white rounded-lg shadow-sm pl-10 pr-4 py-2.5 w-full text-sm text-gray-600"
              placeholder="Rechercher un dossier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex rounded-lg shadow-sm overflow-hidden">
            <button
              className={`px-3 py-2 ${
                viewMode === "liste"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600"
              }`}
              onClick={() => setViewMode("liste")}
            >
              <List size={18} />
            </button>
            <button
              className={`px-3 py-2 ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="bg-white rounded-xl shadow-sm">
        {viewMode === "liste" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Naissance
                  </th>
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commune
                  </th>
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent/Tuteur
                  </th>
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="py-3.5 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredDossiers.length > 0 ? (
                  filteredDossiers.map((dossier) => (
                    <tr key={dossier.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dossier.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {dossier.nom}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(dossier.dateNaissance).toLocaleDateString(
                          "fr-FR"
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {dossier.commune}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {dossier.parent.nom}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            dossier.statutDossier
                          )}`}
                        >
                          {getStatusIcon(dossier.statutDossier)}
                          <span className="ml-1">{dossier.statutDossier}</span>
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(dossier.dateCreation).toLocaleDateString(
                          "fr-FR"
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye size={18} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Pencil size={18} />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Aucun dossier ne correspond à votre recherche
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDossiers.length > 0 ? (
                filteredDossiers.map((dossier) => (
                  <div
                    key={dossier.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {dossier.nom}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ID: {dossier.id}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          dossier.statutDossier
                        )}`}
                      >
                        {getStatusIcon(dossier.statutDossier)}
                        <span className="ml-1">{dossier.statutDossier}</span>
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Date de naissance:
                        </span>
                        <span className="text-gray-700">
                          {new Date(dossier.dateNaissance).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Commune:</span>
                        <span className="text-gray-700">{dossier.commune}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Parent/Tuteur:</span>
                        <span className="text-gray-700">
                          {dossier.parent.nom}
                        </span>
                      </div>
                      {dossier.observations.length > 0 && (
                        <div className="text-sm mt-2">
                          <span className="text-gray-500">Observation:</span>
                          <p className="text-gray-700 mt-1 italic">
                            {dossier.observations[0]}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {dossier.documents.length} document(s)
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-900">
                          <Eye size={18} />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-gray-900">
                          <Pencil size={18} />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-900">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-8 text-center text-gray-500">
                  Aucun dossier ne correspond à votre recherche
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">1</span> à{" "}
                <span className="font-medium">{filteredDossiers.length}</span>{" "}
                sur{" "}
                <span className="font-medium">{filteredDossiers.length}</span>{" "}
                résultats
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-6 flex gap-4">
        <button className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm text-gray-600 hover:bg-gray-50">
          <Download size={16} className="mr-2" />
          Exporter CSV
        </button>
        <button className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm text-gray-600 hover:bg-gray-50">
          <Upload size={16} className="mr-2" />
          Importer
        </button>
      </div>
    </main>
  );
};

export default DossiersPage;
