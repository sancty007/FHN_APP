import { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  UploadCloud,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Search,
  LogOut,
  User,
} from "lucide-react";

const TuteurPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    nomEnfant: "",
    dateNaissance: "",
    sexe: "",
    commune: "",
    nomParent: "",
    telephoneParent: "",
    emailParent: "",
    documents: [],
  });

  // Données factices pour les dossiers
  const [dossiers, setDossiers] = useState([
    {
      id: "d1",
      nomEnfant: "Koumba Michel",
      dateNaissance: "2018-06-12",
      sexe: "Masculin",
      commune: "Akanda",
      dateCreation: "2025-04-03",
      statut: "Nouveau",
      observations: [
        {
          date: "2025-04-03",
          texte: "Dossier créé et soumis",
          auteur: "Parent",
        },
      ],
      documents: ["acte-naissance.pdf"],
    },
    {
      id: "d2",
      nomEnfant: "Nzamba Marie",
      dateNaissance: "2017-09-24",
      sexe: "Féminin",
      commune: "Libreville",
      dateCreation: "2025-03-15",
      statut: "En cours",
      observations: [
        {
          date: "2025-03-15",
          texte: "Dossier créé et soumis",
          auteur: "Parent",
        },
        {
          date: "2025-03-20",
          texte: "Dossier en cours d'analyse",
          auteur: "Secrétaire",
        },
      ],
      documents: ["acte-naissance.pdf", "carnet-sante.pdf"],
    },
    {
      id: "d3",
      nomEnfant: "Mouloungui Pierre",
      dateNaissance: "2019-01-05",
      sexe: "Masculin",
      commune: "Owendo",
      dateCreation: "2025-02-10",
      statut: "Incomplet",
      observations: [
        {
          date: "2025-02-10",
          texte: "Dossier créé et soumis",
          auteur: "Parent",
        },
        {
          date: "2025-02-15",
          texte: "Dossier incomplet, manque carnet de santé",
          auteur: "Analyste",
        },
      ],
      documents: ["acte-naissance.pdf"],
    },
    {
      id: "d4",
      nomEnfant: "Ondo Sophie",
      dateNaissance: "2018-03-17",
      sexe: "Féminin",
      commune: "Libreville",
      dateCreation: "2025-01-22",
      statut: "Accepté",
      observations: [
        {
          date: "2025-01-22",
          texte: "Dossier créé et soumis",
          auteur: "Parent",
        },
        { date: "2025-01-25", texte: "Dossier complet", auteur: "Secrétaire" },
        { date: "2025-02-05", texte: "Dossier accepté", auteur: "Analyste" },
      ],
      documents: ["acte-naissance.pdf", "carnet-sante.pdf", "photo.jpg"],
    },
  ]);

  // Filtrer les dossiers par la recherche
  const filteredDossiers = dossiers.filter((dossier) =>
    dossier.nomEnfant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistiques des dossiers
  const getStatsByStatus = () => {
    const stats = {
      total: dossiers.length,
      nouveaux: dossiers.filter((d) => d.statut === "Nouveau").length,
      enCours: dossiers.filter((d) => d.statut === "En cours").length,
      incomplets: dossiers.filter((d) => d.statut === "Incomplet").length,
      acceptes: dossiers.filter((d) => d.statut === "Accepté").length,
      rejetes: dossiers.filter((d) => d.statut === "Rejeté").length,
      clotures: dossiers.filter((d) => d.statut === "Clôturé").length,
    };
    return stats;
  };

  const stats = getStatsByStatus();

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }));
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    // Création d'un nouveau dossier
    const newDossier = {
      id: `d${dossiers.length + 1}`,
      nomEnfant: formData.nomEnfant,
      dateNaissance: formData.dateNaissance,
      sexe: formData.sexe,
      commune: formData.commune,
      dateCreation: new Date().toISOString().slice(0, 10),
      statut: "Nouveau",
      observations: [
        {
          date: new Date().toISOString().slice(0, 10),
          texte: "Dossier créé et soumis",
          auteur: "Parent",
        },
      ],
      documents: formData.documents.map((doc) => doc.name),
    };

    // Ajout du dossier
    setDossiers([...dossiers, newDossier]);

    // Réinitialisation du formulaire
    setFormData({
      nomEnfant: "",
      dateNaissance: "",
      sexe: "",
      commune: "",
      nomParent: "",
      telephoneParent: "",
      emailParent: "",
      documents: [],
    });

    // Fermeture du formulaire
    setShowNewRequestForm(false);
  };

  // Helper pour afficher le statut
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      Nouveau: {
        color: "bg-blue-100 text-blue-800",
        icon: <Clock size={16} className="mr-1" />,
      },
      "En cours": {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock size={16} className="mr-1" />,
      },
      Incomplet: {
        color: "bg-orange-100 text-orange-800",
        icon: <AlertCircle size={16} className="mr-1" />,
      },
      Accepté: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle size={16} className="mr-1" />,
      },
      Rejeté: {
        color: "bg-red-100 text-red-800",
        icon: <XCircle size={16} className="mr-1" />,
      },
      Clôturé: {
        color: "bg-gray-100 text-gray-800",
        icon: <FileText size={16} className="mr-1" />,
      },
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[status].color}`}
      >
        {statusConfig[status].icon}
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-green-500 bg-clip-text text-transparent">
                FHN
              </span>
            </div>
            <h1 className="ml-3 text-xl font-medium text-gray-900">
              Plateforme <span className="font-bold">Horizons Nouveaux</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-700">
              <User size={16} className="mr-1" />
              <span>Parent</span>
            </div>
            <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
              <LogOut size={16} className="mr-1" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation onglets */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-4 px-6 font-medium text-sm ${
              activeTab === "dashboard"
                ? "border-b-2 border-green-500 text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Tableau de bord
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm ${
              activeTab === "demandes"
                ? "border-b-2 border-green-500 text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("demandes")}
          >
            Mes demandes
          </button>
        </div>

        {/* Contenu du tableau de bord */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Bienvenue sur votre espace parent
              </h2>
              <p className="text-gray-600 mb-4">
                Vous pouvez soumettre des demandes d'inscription pour vos
                enfants et suivre l'évolution de vos dossiers en cours. Pour
                commencer une nouvelle demande, cliquez sur "Nouvelle demande".
              </p>
              <button
                onClick={() => {
                  setActiveTab("demandes");
                  setShowNewRequestForm(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus size={16} className="mr-2" />
                Nouvelle demande
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  Total des dossiers
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Nouveaux</span>
                    <span className="font-medium text-blue-600">
                      {stats.nouveaux}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">En cours</span>
                    <span className="font-medium text-yellow-600">
                      {stats.enCours}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Incomplets</span>
                    <span className="font-medium text-orange-600">
                      {stats.incomplets}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Acceptés</span>
                    <span className="font-medium text-green-600">
                      {stats.acceptes}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  Activité récente
                </h3>
                <div className="space-y-4">
                  {dossiers
                    .slice(-3)
                    .reverse()
                    .map((dossier) => (
                      <div key={dossier.id} className="flex items-start">
                        <div className="flex-shrink-0">
                          <StatusBadge status={dossier.statut} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {dossier.nomEnfant}
                          </p>
                          <p className="text-xs text-gray-500">
                            {
                              dossier.observations[
                                dossier.observations.length - 1
                              ].texte
                            }{" "}
                            -
                            {" " +
                              dossier.observations[
                                dossier.observations.length - 1
                              ].date}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenu des demandes */}
        {activeTab === "demandes" && (
          <div>
            {/* En-tête avec recherche et bouton nouvelle demande */}
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Rechercher un dossier"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                onClick={() => setShowNewRequestForm(!showNewRequestForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus size={16} className="mr-2" />
                Nouvelle demande
              </button>
            </div>

            {/* Formulaire de nouvelle demande */}
            {showNewRequestForm && (
              <div className="bg-white rounded-xl shadow mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Nouvelle demande d'inscription
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900">
                        Informations sur l'enfant
                      </h4>

                      <div>
                        <label
                          htmlFor="nomEnfant"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nom complet de l'enfant
                        </label>
                        <input
                          type="text"
                          id="nomEnfant"
                          name="nomEnfant"
                          value={formData.nomEnfant}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="dateNaissance"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Date de naissance
                        </label>
                        <input
                          type="date"
                          id="dateNaissance"
                          name="dateNaissance"
                          value={formData.dateNaissance}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="sexe"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Sexe
                        </label>
                        <select
                          id="sexe"
                          name="sexe"
                          value={formData.sexe}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="">Sélectionner</option>
                          <option value="Masculin">Masculin</option>
                          <option value="Féminin">Féminin</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="commune"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Commune de résidence
                        </label>
                        <input
                          type="text"
                          id="commune"
                          name="commune"
                          value={formData.commune}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900">
                        Informations sur le parent/tuteur
                      </h4>

                      <div>
                        <label
                          htmlFor="nomParent"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nom complet du parent/tuteur
                        </label>
                        <input
                          type="text"
                          id="nomParent"
                          name="nomParent"
                          value={formData.nomParent}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="telephoneParent"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          id="telephoneParent"
                          name="telephoneParent"
                          value={formData.telephoneParent}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="emailParent"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="emailParent"
                          name="emailParent"
                          value={formData.emailParent}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Documents (Acte de naissance, Carnet de santé, etc.)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                              >
                                <span>Ajouter des fichiers</span>
                                <input
                                  id="file-upload"
                                  name="documents"
                                  type="file"
                                  className="sr-only"
                                  multiple
                                  onChange={handleFileUpload}
                                />
                              </label>
                              <p className="pl-1">ou glisser-déposer</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PDF, JPG, PNG jusqu'à 10MB
                            </p>
                          </div>
                        </div>

                        {/* Liste des fichiers sélectionnés */}
                        {formData.documents.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {formData.documents.map((doc, idx) => (
                              <div
                                key={idx}
                                className="flex items-center text-sm text-gray-600"
                              >
                                <FileText size={14} className="mr-1" />
                                <span>{doc.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={() => setShowNewRequestForm(false)}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Soumettre la demande
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Liste des dossiers */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Mes dossiers ({filteredDossiers.length})
                </h3>
              </div>

              {/* Dossier sélectionné en détail */}
              {selectedDossier && (
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {selectedDossier.nomEnfant}
                      </h4>
                      <div className="mt-1 flex items-center">
                        <StatusBadge status={selectedDossier.statut} />
                        <span className="ml-2 text-sm text-gray-500">
                          Créé le {selectedDossier.dateCreation}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDossier(null)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Retour à la liste
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Informations de l'enfant
                      </h5>
                      <div className="bg-gray-50 rounded-md p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Nom:</span>
                            <p className="font-medium text-gray-900">
                              {selectedDossier.nomEnfant}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Date de naissance:
                            </span>
                            <p className="font-medium text-gray-900">
                              {selectedDossier.dateNaissance}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Sexe:</span>
                            <p className="font-medium text-gray-900">
                              {selectedDossier.sexe}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Commune:</span>
                            <p className="font-medium text-gray-900">
                              {selectedDossier.commune}
                            </p>
                          </div>
                        </div>
                      </div>

                      <h5 className="text-sm font-medium text-gray-700 mt-4 mb-2">
                        Documents fournis
                      </h5>
                      <div className="bg-gray-50 rounded-md p-4">
                        <ul className="space-y-2">
                          {selectedDossier.documents.map((doc, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <FileText
                                size={16}
                                className="mr-2 text-gray-400"
                              />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Historique du dossier
                      </h5>
                      <div className="bg-gray-50 rounded-md p-4">
                        <div className="space-y-4">
                          {selectedDossier.observations.map((obs, idx) => (
                            <div key={idx} className="relative pb-4">
                              {idx <
                                selectedDossier.observations.length - 1 && (
                                <span
                                  className="absolute top-5 left-2.5 -ml-px h-full w-0.5 bg-gray-200"
                                  aria-hidden="true"
                                ></span>
                              )}
                              <div className="relative flex items-start">
                                <div className="flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-600 mt-1">
                                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">
                                    {obs.texte}
                                  </p>
                                  <div className="mt-1 flex text-xs text-gray-500">
                                    <span>{obs.date}</span>
                                    <span className="mx-1">•</span>
                                    <span>{obs.auteur}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedDossier.statut === "Incomplet" && (
                        <div className="mt-4">
                          <div className="p-4 bg-orange-50 rounded-md">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-orange-400" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-orange-800">
                                  Action requise
                                </h3>
                                <div className="mt-2 text-sm text-orange-700">
                                  <p>
                                    Votre dossier est incomplet. Veuillez
                                    fournir les documents manquants pour
                                    continuer le traitement.
                                  </p>
                                </div>
                                <div className="mt-4">
                                  <button
                                    type="button"
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                  >
                                    <UploadCloud size={16} className="mr-2" />
                                    Ajouter des documents
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {!selectedDossier && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Nom de l'enfant
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date de création
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Statut
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Dernière mise à jour
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDossiers.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-4 text-sm text-center text-gray-500"
                          >
                            Aucun dossier trouvé
                          </td>
                        </tr>
                      ) : (
                        filteredDossiers.map((dossier) => (
                          <tr
                            key={dossier.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => setSelectedDossier(dossier)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {dossier.nomEnfant}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {dossier.dateCreation}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={dossier.statut} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {
                                dossier.observations[
                                  dossier.observations.length - 1
                                ].date
                              }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDossier(dossier);
                                }}
                                className="text-green-600 hover:text-green-900"
                              >
                                Voir détails
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
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

export default TuteurPage;
