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
  const [formType, setFormType] = useState(null); // null, "TARII", ou "WISI"
  const [currentStep, setCurrentStep] = useState(1); // Étape actuelle du formulaire
  const navigate = useNavigate();

  // Liste des types de documents autorisés
  const documentTypes = [
    { value: "acte_naissance", label: "Photocopie de l’acte de naissance" },
    { value: "livret_familial", label: "Livret familial" },
    { value: "carte_identite", label: "Photocopie de la carte d’identité" },
    { value: "carte_sejour", label: "Carte de séjour des responsables légaux" },
    {
      value: "carnet_vaccinations",
      label: "Photocopie du carnet de vaccinations",
    },
    {
      value: "bilan_ophtalmologique",
      label: "Photocopie du bilan ophtalmologique",
    },
    { value: "bilan_orthoptique", label: "Photocopie du bilan orthoptique" },
    {
      value: "comptes_rendus_medicaux",
      label: "Photocopie des comptes rendus médicaux",
    },
    {
      value: "comptes_rendus_paramedicaux",
      label: "Photocopie des comptes rendus paramédicaux",
    },
  ];

  // État du formulaire
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
    dateCreation: new Date().toISOString().split("T")[0], // Default to today’s date
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
        "https://fhn-backend-2.onrender.com/dossier-enfant",
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

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Gestion du téléversement de fichiers
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map((file) => ({
      file,
      type: "",
    }));
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments],
    }));
  };

  // Mise à jour du type de document
  const handleDocumentTypeChange = (index, type) => {
    setFormData((prev) => {
      const updatedDocuments = [...prev.documents];
      updatedDocuments[index].type = type;
      return { ...prev, documents: updatedDocuments };
    });
  };

  // Suppression d'un document
  const handleRemoveDocument = (index) => {
    setFormData((prev) => {
      const updatedDocuments = prev.documents.filter((_, i) => i !== index);
      return { ...prev, documents: updatedDocuments };
    });
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
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier que tous les documents ont un type
    if (formData.documents.some((doc) => !doc.type)) {
      alert("Veuillez sélectionner un type pour chaque document téléversé.");
      return;
    }

    // Valider tous les champs requis
    const requiredFields = {
      nom: "Le nom est requis",
      dateNaissance: "La date de naissance est requise",
      sexe: "Le sexe est requis",
      commune: "La commune est requise",
      diagnostic: "Le diagnostic est requis",
      parentNom: "Le nom du parent est requis",
      parentTelephone: "Le téléphone du parent est requis",
      parentEmail: "L'email du parent est requis",
      dateCreation: "La date de création est requise",
      estScolarise: "Le statut de scolarisation est requis",
      etablissementId: "L’établissement est requis",
    };

    const errors = Object.keys(requiredFields)
      .filter((key) => {
        const value = formData[key];
        return value === "" || value === null || value === undefined;
      })
      .map((key) => requiredFields[key]);

    if (errors.length > 0) {
      alert("Erreur(s) dans le formulaire :\n- " + errors.join("\n- "));
      return;
    }

    // Créer un FormData pour envoyer les données et fichiers
    const formDataToSend = new FormData();

    // Mapper les champs camelCase à snake_case
    const fieldMapping = {
      nom: "nom",
      dateNaissance: "date_de_naissance",
      sexe: "sexe",
      commune: "commune",
      diagnostic: "diagnostic",
      estScolarise: "est_scolarise",
      niveauScolaire: "niveau_scolaire",
      ancienEtablissement: "ancien_etablissement",
      activitesQuotidiennes: "activites_quotidiennes",
      parentNom: "parent_nom",
      parentTelephone: "parent_telephone",
      parentEmail: "parent_email",
      attente: "attente",
      observation: "observation",
      aConsulteOphtalmo: "a_consulte_ophtalmo",
      aAutreSuiviMedical: "a_autre_suivi_medical",
      detailsSuiviMedical: "details_suivi_medical",
      aPerceptionVisuelle: "a_perception_visuelle",
      estAveugle: "est_aveugle",
      suiviOrthophonique: "suivi_orthophonique",
      suiviPsychologique: "suivi_psychologique",
      psychomotricien: "psychomotricien",
      tradipracticien: "tradipracticien",
      etablissementId: "etablissement_id",
      dateCreation: "date_creation",
    };

    Object.keys(formData).forEach((key) => {
      if (key === "documents") return; // Gérer les documents séparément
      const value = formData[key];
      if (value !== undefined && value !== null) {
        const backendKey = fieldMapping[key] || key;
        formDataToSend.append(backendKey, value.toString());
      }
    });

    // Ajouter les documents
    formData.documents.forEach((doc, index) => {
      formDataToSend.append(`documents[${index}][file]`, doc.file);
      formDataToSend.append(`documents[${index}][type]`, doc.type);
    });

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Vous devez être connecté pour soumettre une demande.");
        navigate("/");
        return;
      }

      const response = await fetch(
        "https://fhn-backend-2.onrender.com/dossier-enfant",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (result.errors && Array.isArray(result.errors)) {
          const errorMessages = result.errors
            .map((err) => err.msg || err.message)
            .join("\n- ");
          throw new Error("Erreur(s) de validation :\n- " + errorMessages);
        }
        throw new Error(
          result.message || "Erreur lors de la soumission du dossier."
        );
      }

      await fetchDossiers();
      resetForm();
      setShowNewRequestForm(false);
      alert("Demande soumise avec succès !");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      alert(error.message || "Une erreur est survenue lors de la soumission.");
    }
  };

  // Navigation entre les étapes
  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    } else {
      alert("Veuillez remplir tous les champs requis avant de continuer.");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Validation des champs requis par étape
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

            {/* Formulaire de nouvelle demande */}
            {showNewRequestForm && (
              <div className="bg-white rounded-xl shadow mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Nouvelle demande d'inscription
                  </h3>
                </div>

                {/* Choix du type de formulaire */}
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
                            dateCreation: new Date()
                              .toISOString()
                              .split("T")[0],
                          }));
                        }}
                        className="p-4 border border-gray-300 rounded-md text-left hover:bg-gray-50"
                      >
                        <h5 className="text-sm font-medium text-gray-900">
                          TARII - Déficience intellectuelle
                        </h5>
                        <p className="text-sm text-gray-500">
                          Pour les enfants avec des troubles comme l'autisme ou
                          autres déficiences intellectuelles.
                        </p>
                      </button>
                      <button
                        onClick={() => {
                          setFormType("WISI");
                          setFormData((prev) => ({
                            ...prev,
                            etablissementId: 2,
                            diagnostic: "Déficience visuelle",
                            dateCreation: new Date()
                              .toISOString()
                              .split("T")[0],
                          }));
                        }}
                        className="p-4 border border-gray-300 rounded-md text-left hover:bg-gray-50"
                      >
                        <h5 className="text-sm font-medium text-gray-900">
                          WISI - Déficience visuelle
                        </h5>
                        <p className="text-sm text-gray-500">
                          Pour les enfants avec des déficiences visuelles,
                          incluant la cécité ou basse vision.
                        </p>
                      </button>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => {
                          resetForm();
                          setShowNewRequestForm(false);
                        }}
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
                    {/* Barre de progression */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span
                          className={`text-sm font-medium ${
                            currentStep >= 1
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          Étape 1: Enfant
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            currentStep >= 2
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          Étape 2: Parent/Documents
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            currentStep >= 3
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          Étape 3: Détails
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: `${(currentStep / 3) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Étape 1: Informations sur l'enfant */}
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
                              Nom complet
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
                            Scolarisation et activités
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
                                L'enfant est scolarisé
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

                    {/* Étape 2: Informations sur le parent/tuteur et documents */}
                    {currentStep === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-900">
                            Informations sur le parent/tuteur
                          </h4>
                          <div>
                            <label
                              htmlFor="parentNom"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Nom complet
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
                          {/* Liste des documents téléversés */}
                          {formData.documents.length > 0 && (
                            <div className="mt-4">
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
                                            e.target.value
                                          )
                                        }
                                        className="block w-48 border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                      >
                                        <option value="">
                                          Sélectionner le type
                                        </option>
                                        {documentTypes.map((type) => (
                                          <option
                                            key={type.value}
                                            value={type.value}
                                          >
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

                    {/* Étape 3: Détails spécifiques */}
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

                    {/* Navigation entre étapes */}
                    <div className="mt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          if (currentStep === 1) {
                            resetForm();
                            setShowNewRequestForm(false);
                          } else {
                            prevStep();
                          }
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        {currentStep === 1 ? "Annuler" : "Précédent"}
                      </button>
                      <div className="flex space-x-3">
                        {currentStep < 3 && (
                          <button
                            type="button"
                            onClick={nextStep}
                            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Suivant
                          </button>
                        )}
                        {currentStep === 3 && (
                          <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Soumettre la demande
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
