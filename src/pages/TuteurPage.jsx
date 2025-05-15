import { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  UploadCloud,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  LogOut,
  User,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TuteurPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const navigate = useNavigate();

  // Types de documents avec ID numérique
  const documentTypes = [
    { id: 1, value: "acte_naissance", label: "Acte de naissance" },
    { id: 2, value: "livret_familial", label: "Livret familial" },
    { id: 3, value: "carte_identite", label: "Carte d’identité" },
    { id: 4, value: "carte_sejour", label: "Carte de séjour" },
    { id: 5, value: "carnet_vaccinations", label: "Carnet de vaccinations" },
    { id: 6, value: "bilan_ophtalmologique", label: "Bilan ophtalmologique" },
    { id: 7, value: "bilan_orthoptique", label: "Bilan orthoptique" },
    {
      id: 8,
      value: "comptes_rendus_medicaux",
      label: "Comptes rendus médicaux",
    },
    {
      id: 9,
      value: "comptes_rendus_paramedicaux",
      label: "Comptes rendus paramédicaux",
    },
  ];

  // État du formulaire
  const [formType, setFormType] = useState(null); // null, "TARII", ou "WISI"
  const [currentStep, setCurrentStep] = useState(1); // Étape actuelle
  const [formData, setFormData] = useState({
    nom: "",
    dateNaissance: "",
    sexe: "",
    commune: "",
    diagnostic: "",
    estScolarise: false,
    niveauScolaire: "",
    ancienEtablissement: "",
    activitesQuotidiennes: "",
    parentNom: "",
    parentTelephone: "",
    parentEmail: "",
    documents: [],
    attente: "",
    observation: "",
    aConsulteOphtalmo: false,
    aAutreSuiviMedical: false,
    detailsSuiviMedical: "",
    aPerceptionVisuelle: false,
    estAveugle: false,
    suiviOrthophonique: false,
    suiviPsychologique: false,
    psychomotricien: false,
    tradipracticien: false,
    etablissementId: null,
    dateCreation: new Date().toISOString().split("T")[0],
  });

  // État des dossiers
  const [dossiers, setDossiers] = useState([]);

  // Charger les dossiers depuis l'API
  const fetchDossiers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/");
        return;
      }

      const response = await fetch(
        "https://fhn-backend-2.onrender.com/dossier_enfant",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Erreur lors du chargement des dossiers."
        );
      }

      setDossiers(result.data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des dossiers:", error);
      alert(
        error.message ||
          "Une erreur est survenue lors de la récupération des dossiers."
      );
    }
  };

  // Charger les dossiers au montage du composant
  useEffect(() => {
    fetchDossiers();
  }, [navigate]);

  // Filtrer les dossiers par la recherche
  const filteredDossiers = dossiers.filter((dossier) =>
    dossier.nom.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Gestion des inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Gestion des fichiers
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map((file) => ({
      file,
      type: "", // Initialisé à vide, l'utilisateur choisira l'ID
    }));
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments],
    }));
  };

  // Mise à jour du type de document (stocke l'ID numérique)
  const handleDocumentTypeChange = (index, id) => {
    setFormData((prev) => {
      const updatedDocuments = [...prev.documents];
      updatedDocuments[index].type = id; // Stocker l'ID (nombre)
      return { ...prev, documents: updatedDocuments };
    });
  };

  // Suppression d'un document
  const handleRemoveDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      nom: "",
      dateNaissance: "",
      sexe: "",
      commune: "",
      diagnostic: "",
      estScolarise: false,
      niveauScolaire: "",
      ancienEtablissement: "",
      activitesQuotidiennes: "",
      parentNom: "",
      parentTelephone: "",
      parentEmail: "",
      documents: [],
      attente: "",
      observation: "",
      aConsulteOphtalmo: false,
      aAutreSuiviMedical: false,
      detailsSuiviMedical: "",
      aPerceptionVisuelle: false,
      estAveugle: false,
      suiviOrthophonique: false,
      suiviPsychologique: false,
      psychomotricien: false,
      tradipracticien: false,
      etablissementId: null,
      dateCreation: new Date().toISOString().split("T")[0],
    });
    setCurrentStep(1);
    setFormType(null);
    setShowNewRequestForm(false);
  };

  // Validation par étape
  const validateStep = () => {
    if (currentStep === 1) {
      return (
        formData.nom &&
        formData.dateNaissance &&
        formData.sexe &&
        formData.commune &&
        formData.diagnostic &&
        formData.activitesQuotidiennes &&
        formData.estScolarise !== null &&
        formData.etablissementId !== null
      );
    }
    if (currentStep === 2) {
      return (
        formData.parentNom &&
        formData.parentTelephone &&
        formData.parentEmail &&
        formData.documents.length > 0 &&
        formData.documents.every((doc) => doc.type) &&
        formData.dateCreation
      );
    }
    if (currentStep === 3) {
      return formData.attente && formData.observation;
    }
    return true;
  };

  // Navigation entre étapes
  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    } else {
      alert("Veuillez remplir tous les champs requis.");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier les documents
    if (formData.documents.some((doc) => !doc.type)) {
      alert("Veuillez sélectionner un type pour chaque document.");
      return;
    }

    // Créer FormData
    const formDataToSend = new FormData();

    // Champs communs
    const fields = {
      nom: formData.nom,
      date_naissance: formData.dateNaissance,
      sexe: formData.sexe === "Masculin" ? "M" : "F",
      commune: formData.commune,
      diagnostic: formData.diagnostic,
      est_scolarise: formData.estScolarise,
      niveau_scolaire: formData.niveauScolaire || "",
      ancien_etablissement: formData.ancienEtablissement || "",
      activites_quotidiennes: formData.activitesQuotidiennes,
      parentNom: formData.parentNom,
      parentTelephone: formData.parentTelephone,
      parentEmail: formData.parentEmail,
      attente: formData.attente || "",
      observation: formData.observation || "",
      etablissementId: formData.etablissementId.toString(),
      date_creation: formData.dateCreation,
    };

    // Champs spécifiques
    if (formData.etablissementId === 1) {
      fields.suivi_orthophonique = formData.suiviOrthophonique;
      fields.suivi_psychologique = formData.suiviPsychologique;
      fields.psychomotricien = formData.psychomotricien;
      fields.tradipracticien = formData.tradipracticien;
    } else if (formData.etablissementId === 2) {
      fields.a_consulte_ophtalmo = formData.aConsulteOphtalmo;
      fields.a_autre_suivi_medical = formData.aAutreSuiviMedical;
      fields.details_suivi_medical = formData.detailsSuiviMedical || "";
      fields.a_perception_visuelle = formData.aPerceptionVisuelle;
      fields.est_aveugle = formData.estAveugle;
    }

    // Ajouter les champs
    Object.keys(fields).forEach((key) => {
      const value = fields[key];
      if (value !== undefined && value !== null) {
        formDataToSend.append(key, value.toString());
      }
    });

    // Ajouter fichiers et filesInfo (natureId est une chaîne de caractères numérique)
    const filesInfo = formData.documents.map((doc) => ({
      natureId: doc.type.toString(), // Convertir l'ID en chaîne
    }));

    formData.documents.forEach((doc) => {
      formDataToSend.append("fichiers", doc.file);
    });

    formDataToSend.append("filesInfo", JSON.stringify(filesInfo));

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Aucun token trouvé dans localStorage");
        alert("Vous devez être connecté.");
        navigate("/");
        return;
      }

      console.log("Envoi de la requête POST avec les données suivantes:");
      console.log("Headers:", { Authorization: `Bearer ${token}` });
      console.log("FormData:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch(
        "https://fhn-backend-2.onrender.com/dossier_enfant",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const result = await response.json();
      console.log("Réponse du serveur:", result);

      if (!response.ok) {
        console.error("Erreur serveur:", { status: response.status, result });
        if (result.errors && Array.isArray(result.errors)) {
          const errorMessages = result.errors
            .map((err) => err.msg || err.message)
            .join("\n- ");
          alert("Erreur(s) de validation :\n- " + errorMessages);
        } else {
          alert(
            result.message || `Erreur ${response.status}: Problème serveur.`
          );
        }
        return;
      }

      await fetchDossiers(); // Refresh dossier list
      resetForm();
      alert("Demande soumise avec succès !");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      alert(`Une erreur est survenue : ${error.message}`);
    }
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
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          statusConfig[status]?.color || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusConfig[status]?.icon || <FileText size={16} className="mr-1" />}
        {status}
      </span>
    );
  };

  // Helper pour obtenir le libellé du type de document
  const getDocumentTypeLabel = (type) => {
    const docType = documentTypes.find((dt) => dt.value === type);
    return docType ? docType.label : type;
  };

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await fetch("https://fhn-backend-2.onrender.com/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      localStorage.removeItem("authToken");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      localStorage.removeItem("authToken");
      navigate("/");
    }
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
            <button
              onClick={handleLogout}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
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
                            {dossier.nom}
                          </p>
                          <p className="text-xs text-gray-500">
                            {dossier.observations?.[
                              dossier.observations.length - 1
                            ]?.texte || "Aucune observation"}{" "}
                            -{" "}
                            {dossier.observations?.[
                              dossier.observations.length - 1
                            ]?.date || dossier.dateCreation}
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

            {/* Formulaire */}
            {showNewRequestForm && (
              <div className="bg-white rounded-xl shadow mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Nouvelle demande d'inscription
                  </h3>
                </div>

                {/* Choix du type */}
                {!formType && (
                  <div className="p-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Sélectionnez le type de dossier
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => {
                          setFormType("TARII");
                          setFormData((prev) => ({
                            ...prev,
                            etablissementId: 1,
                            diagnostic: "Trouble du spectre autistique",
                          }));
                        }}
                        className="p-4 border border-gray-300 rounded-md text-left hover:bg-gray-50"
                      >
                        <h5 className="text-sm font-medium text-gray-900">
                          TARII - Déficience intellectuelle
                        </h5>
                        <p className="text-sm text-gray-500">
                          Pour autisme ou déficiences intellectuelles.
                        </p>
                      </button>
                      <button
                        onClick={() => {
                          setFormType("WISI");
                          setFormData((prev) => ({
                            ...prev,
                            etablissementId: 2,
                            diagnostic: "Déficience visuelle",
                          }));
                        }}
                        className="p-4 border border-gray-300 rounded-md text-left hover:bg-gray-50"
                      >
                        <h5 className="text-sm font-medium text-gray-900">
                          WISI - Déficience visuelle
                        </h5>
                        <p className="text-sm text-gray-500">
                          Pour cécité ou basse vision.
                        </p>
                      </button>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={resetForm}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {/* Formulaire multi-étapes */}
                {formType && (
                  <form onSubmit={handleSubmit} className="p-6">
                    {/* Progression */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span
                          className={`text-sm font-medium ${
                            currentStep >= 1
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          Enfant
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            currentStep >= 2
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          Parent/Documents
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            currentStep >= 3
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          Détails
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: `${(currentStep / 3) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Étape 1: Enfant */}
                    {currentStep === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-900">
                            Informations sur l'enfant
                          </h4>
                          <div>
                            <label
                              htmlFor="nom"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Nom
                            </label>
                            <input
                              type="text"
                              id="nom"
                              name="nom"
                              value={formData.nom}
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
                              Commune
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
                          <div>
                            <label
                              htmlFor="diagnostic"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Diagnostic
                            </label>
                            <input
                              type="text"
                              id="diagnostic"
                              name="diagnostic"
                              value={formData.diagnostic}
                              onChange={handleInputChange}
                              required
                              disabled
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-900">
                            Scolarisation
                          </h4>
                          <div>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                name="estScolarise"
                                checked={formData.estScolarise}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Enfant scolarisé
                              </span>
                            </label>
                          </div>
                          {formData.estScolarise && (
                            <>
                              <div>
                                <label
                                  htmlFor="niveauScolaire"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Niveau scolaire
                                </label>
                                <input
                                  type="text"
                                  id="niveauScolaire"
                                  name="niveauScolaire"
                                  value={formData.niveauScolaire}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="ancienEtablissement"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Ancien établissement
                                </label>
                                <input
                                  type="text"
                                  id="ancienEtablissement"
                                  name="ancienEtablissement"
                                  value={formData.ancienEtablissement}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                              </div>
                            </>
                          )}
                          <div>
                            <label
                              htmlFor="activitesQuotidiennes"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Activités quotidiennes
                            </label>
                            <textarea
                              id="activitesQuotidiennes"
                              name="activitesQuotidiennes"
                              value={formData.activitesQuotidiennes}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                              rows="4"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Étape 2: Parent/Documents */}
                    {currentStep === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-900">
                            Parent/Tuteur
                          </h4>
                          <div>
                            <label
                              htmlFor="parentNom"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Nom
                            </label>
                            <input
                              type="text"
                              id="parentNom"
                              name="parentNom"
                              value={formData.parentNom}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="parentTelephone"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Téléphone
                            </label>
                            <input
                              type="tel"
                              id="parentTelephone"
                              name="parentTelephone"
                              value={formData.parentTelephone}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="parentEmail"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              id="parentEmail"
                              name="parentEmail"
                              value={formData.parentEmail}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-900">
                            Documents
                          </h4>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Ajouter des documents
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
                                      accept=".pdf,.jpg,.png"
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
                          </div>
                          {formData.documents.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">
                                Documents téléversés
                              </h5>
                              <ul className="space-y-2">
                                {formData.documents.map((doc, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center justify-between text-sm border-b border-gray-200 pb-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <FileText
                                        size={14}
                                        className="text-gray-400"
                                      />
                                      <span>{doc.file.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <select
                                        value={doc.type}
                                        onChange={(e) =>
                                          handleDocumentTypeChange(
                                            idx,
                                            parseInt(e.target.value)
                                          )
                                        }
                                        className="block w-48 border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                      >
                                        <option value="">Type</option>
                                        {documentTypes.map((type) => (
                                          <option key={type.id} value={type.id}>
                                            {type.label}
                                          </option>
                                        ))}
                                      </select>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveDocument(idx)
                                        }
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Étape 3: Détails */}
                    {currentStep === 3 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-900">
                            {formType === "TARII"
                              ? "Détails TARII"
                              : "Détails WISI"}
                          </h4>
                          {formType === "WISI" && (
                            <>
                              <div>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name="aConsulteOphtalmo"
                                    checked={formData.aConsulteOphtalmo}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    Consultation ophtalmologique
                                  </span>
                                </label>
                              </div>
                              <div>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name="aAutreSuiviMedical"
                                    checked={formData.aAutreSuiviMedical}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    Autre suivi médical
                                  </span>
                                </label>
                              </div>
                              {formData.aAutreSuiviMedical && (
                                <div>
                                  <label
                                    htmlFor="detailsSuiviMedical"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Détails du suivi médical
                                  </label>
                                  <textarea
                                    id="detailsSuiviMedical"
                                    name="detailsSuiviMedical"
                                    value={formData.detailsSuiviMedical}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    rows="4"
                                  ></textarea>
                                </div>
                              )}
                              <div>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name="aPerceptionVisuelle"
                                    checked={formData.aPerceptionVisuelle}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    Perception visuelle
                                  </span>
                                </label>
                              </div>
                              <div>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name="estAveugle"
                                    checked={formData.estAveugle}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    Cécité totale
                                  </span>
                                </label>
                              </div>
                            </>
                          )}
                          {formType === "TARII" && (
                            <>
                              <div>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name="suiviOrthophonique"
                                    checked={formData.suiviOrthophonique}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    Suivi orthophonique
                                  </span>
                                </label>
                              </div>
                              <div>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name="suiviPsychologique"
                                    checked={formData.suiviPsychologique}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    Suivi psychologique
                                  </span>
                                </label>
                              </div>
                              <div>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name="psychomotricien"
                                    checked={formData.psychomotricien}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    Suivi psychomoteur
                                  </span>
                                </label>
                              </div>
                              <div>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name="tradipracticien"
                                    checked={formData.tradipracticien}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    Consultation tradipraticien
                                  </span>
                                </label>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-900">
                            Attentes et observations
                          </h4>
                          <div>
                            <label
                              htmlFor="attente"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Attentes
                            </label>
                            <textarea
                              id="attente"
                              name="attente"
                              value={formData.attente}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                              rows="4"
                            ></textarea>
                          </div>
                          <div>
                            <label
                              htmlFor="observation"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Observations
                            </label>
                            <textarea
                              id="observation"
                              name="observation"
                              value={formData.observation}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                              rows="4"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="mt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          if (currentStep === 1) {
                            resetForm();
                          } else {
                            prevStep();
                          }
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        {currentStep === 1 ? "Annuler" : "Précédent"}
                      </button>
                      <div>
                        {currentStep < 3 && (
                          <button
                            type="button"
                            onClick={nextStep}
                            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                          >
                            Suivant
                          </button>
                        )}
                        {currentStep === 3 && (
                          <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                          >
                            Soumettre
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                )}
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
                        {selectedDossier.nom}
                      </h4>
                      <div className="mt-1 flex items-center">
                        <StatusBadge status={selectedDossier.statut} />
                        <span className="ml-2 text-sm text-gray-500">
                          Créé le {selectedDossier.date_creation}
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
                              {selectedDossier.nom}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Date de naissance:
                            </span>
                            <p className="font-medium text-gray-900">
                              {selectedDossier.date_de_naissance}
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
                          <div>
                            <span className="text-gray-500">Diagnostic:</span>
                            <p className="font-medium text-gray-900">
                              {selectedDossier.diagnostic}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Établissement:
                            </span>
                            <p className="font-medium text-gray-900">
                              {selectedDossier.etablissement_id === 1
                                ? "TARII"
                                : "WISI"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <h5 className="text-sm font-medium text-gray-700 mt-4 mb-2">
                        Scolarisation
                      </h5>
                      <div className="bg-gray-50 rounded-md p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Scolarisé:</span>
                            <p className="font-medium text-gray-900">
                              {selectedDossier.est_scolarise ? "Oui" : "Non"}
                            </p>
                          </div>
                          {selectedDossier.est_scolarise && (
                            <>
                              <div>
                                <span className="text-gray-500">
                                  Niveau scolaire:
                                </span>
                                <p className="font-medium text-gray-900">
                                  {selectedDossier.niveau_scolaire || "-"}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Ancien établissement:
                                </span>
                                <p className="font-medium text-gray-900">
                                  {selectedDossier.ancien_etablissement || "-"}
                                </p>
                              </div>
                            </>
                          )}
                          <div>
                            <span className="text-gray-500">
                              Activités quotidiennes:
                            </span>
                            <p className="font-medium text-gray-900">
                              {selectedDossier.activites_quotidiennes}
                            </p>
                          </div>
                        </div>
                      </div>
                      <h5 className="text-sm font-medium text-gray-700 mt-4 mb-2">
                        Documents fournis
                      </h5>
                      <div className="bg-gray-50 rounded-md p-4">
                        <ul className="space-y-2">
                          {selectedDossier.documents?.map((doc, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <FileText
                                size={16}
                                className="mr-2 text-gray-400"
                              />
                              <span>
                                {doc.name} ({getDocumentTypeLabel(doc.type)})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Détails spécifiques
                      </h5>
                      <div className="bg-gray-50 rounded-md p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {selectedDossier.etablissement_id === 2 ? (
                            <>
                              <div>
                                <span className="text-gray-500">
                                  Consultation ophtalmologique:
                                </span>
                                <p className="font-medium text-gray-900">
                                  {selectedDossier.a_consulte_ophtalmo
                                    ? "Oui"
                                    : "Non"}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Autre suivi médical:
                                </span>
                                <p className="font-medium text-gray-900">
                                  {selectedDossier.a_autre_suivi_medical
                                    ? "Oui"
                                    : "Non"}
                                </p>
                              </div>
                              {selectedDossier.a_autre_suivi_medical && (
                                <div className="col-span-2">
                                  <span className="text-gray-500">
                                    Détails suivi médical:
                                  </span>
                                  <p className="font-medium text-gray-900">
                                    {selectedDossier.details_suivi_medical ||
                                      "-"}
                                  </p>
                                </div>
                              )}
                              <div>
                                <span className="text-gray-500">
                                  Perception visuelle:
                                </span>
                                <p className="font-medium text-gray-900">
                                  {selectedDossier.a_perception_visuelle
                                    ? "Oui"
                                    : "Non"}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Cécité totale:
                                </span>
                                <p className="font-medium text-gray-900">
                                  {selectedDossier.est_aveugle ? "Oui" : "Non"}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <span className="text-gray-500">
                                  Suivi orthophonique:
                                </span>
                                <p className="font-medium text-gray-900">
                                  {selectedDossier.suivi_orthophonique
                                    ? "Oui"
                                    : "Non"}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Suivi psychologique:
                                </span>
                                <p className="font-medium text-gray-900">
                                  {selectedDossier.suivi_psychologique
                                    ? "Oui"
                                    : "Non"}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Suivi psychomoteur:
                                </span>
                                <p className="font-medium text-gray-900">
                                  {selectedDossier.psychomotricien
                                    ? "Oui"
                                    : "Non"}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Consultation tradipraticien:
                                </span>
                                <p className="font-medium text-gray-900">
                                  {selectedDossier.tradipracticien
                                    ? "Oui"
                                    : "Non"}
                                </p>
                              </div>
                            </>
                          )}
                          <div className="col-span-2">
                            <span className="text-gray-500">Attentes:</span>
                            <p className="font-medium text-gray-900">
                              {selectedDossier.attente}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500">Observations:</span>
                            <p className="font-medium text-gray-900">
                              {selectedDossier.observation}
                            </p>
                          </div>
                        </div>
                      </div>
                      <h5 className="text-sm font-medium text-gray-700 mt-4 mb-2">
                        Historique du dossier
                      </h5>
                      <div className="bg-gray-50 rounded-md p-4">
                        <div className="space-y-4">
                          {selectedDossier.observations?.map((obs, idx) => (
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

              {/* Liste des dossiers */}
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
                          Établissement
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
                            colSpan="6"
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
                                {dossier.nom}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {dossier.etablissement_id === 1
                                  ? "TARII"
                                  : "WISI"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {dossier.date_creation}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={dossier.statut} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {dossier.observations?.[
                                dossier.observations.length - 1
                              ]?.date || dossier.date_creation}
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
