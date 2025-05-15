import { useState, useEffect } from "react";
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
  User,
  FileCheck,
  MapPin,
  Phone,
  Mail,
  Book,
  Briefcase,
  MessageSquare,
  Eye as EyeIcon,
  EyeOff,
  Building,
  CheckSquare,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DossierForm from "./../components/DossierForm"; // Importer DossierForm

// Avatar Component
const Avatar = ({ name, status }) => {
  const getColorFromName = (name) => {
    if (!name) return "#4F46E5";
    const colors = [
      "#4F46E5",
      "#0EA5E9",
      "#10B981",
      "#8B5CF6",
      "#F59E0B",
      "#EC4899",
      "#06B6D4",
      "#6366F1",
      "#F97316",
      "#14B8A6",
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getBorderStyle = (status) => {
    switch (status) {
      case "Nouveau":
        return "ring-2 ring-blue-300";
      case "En cours":
        return "ring-2 ring-yellow-300";
      case "Incomplet":
        return "ring-2 ring-orange-300";
      case "Accepte":
        return "ring-2 ring-green-300";
      case "Rejete":
        return "ring-2 ring-red-300";
      case "Cloture":
        return "ring-2 ring-gray-300";
      default:
        return "";
    }
  };

  const getStatusDotColor = (statut) => {
    switch (statut) {
      case "Nouveau":
        return "#3B82F6";
      case "En cours":
        return "#F59E0B";
      case "Incomplet":
        return "#F97316";
      case "Accepte":
        return "#10B981";
      case "Rejete":
        return "#EF4444";
      case "Cloture":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const initials = getInitials(name);
  const bgColor = getColorFromName(name);
  const borderStyle = getBorderStyle(status);

  return (
    <div
      className={`relative flex items-center justify-center w-10 h-10 rounded-full text-white text-sm font-medium shadow-sm ${borderStyle}`}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
      {status && (
        <span
          className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white"
          style={{ backgroundColor: getStatusDotColor(status) }}
        ></span>
      )}
    </div>
  );
};

// ObservationModal Component
const ObservationModal = ({ isOpen, onClose, onSubmit, dossierId }) => {
  const [contenu, setContenu] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!contenu.trim()) {
      setError("L'observation ne peut pas être vide");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://fhn-backend-2.onrender.com/dossier_enfant/addObservation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dossierId,
            contenu,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de l'ajout de l'observation"
        );
      }

      onSubmit(dossierId, {
        texte: data.data.contenu,
        date: new Date(data.data.date),
        auteur: data.data.auteur.nom || "Utilisateur",
      });
      setContenu("");
      onClose();
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'observation:", err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Ajouter une observation
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="mb-4">
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
            placeholder="Écrivez votre observation ici..."
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Envoi..." : "Valider"}
          </button>
        </div>
      </div>
    </div>
  );
};

// DossierModal Component
const DossierModal = ({ dossier, isOpen, onClose, onStatusChange }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [expandedSections, setExpandedSections] = useState({
    enfant: true,
    parent: true,
    scolarisation: true,
    etablissement: true,
    documents: true,
    observations: true,
  });
  const [selectedStatus, setSelectedStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && dossier) {
      document.body.style.overflow = "hidden";
      setSelectedStatus(dossier.statutDossier || "");
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, dossier]);

  if (!isOpen || !dossier) return null;

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("fr-FR");
    } catch (e) {
      return "Date invalide";
    }
  };

  const formatBoolean = (value) => (value ? "Oui" : "Non");

  const getStatusColor = (statut) => {
    switch (statut) {
      case "Nouveau":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          icon: <FileText size={16} className="text-blue-600" />,
          accent: "border-blue-400",
        };
      case "En cours":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: <Clock size={16} className="text-yellow-600" />,
          accent: "border-yellow-400",
        };
      case "Incomplet":
        return {
          bg: "bg-orange-100",
          text: "text-orange-800",
          icon: <AlertCircle size={16} className="text-orange-600" />,
          accent: "border-orange-400",
        };
      case "Accepte":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: <CheckCircle size={16} className="text-green-600" />,
          accent: "border-green-400",
        };
      case "Rejete":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: <X size={16} className="text-red-600" />,
          accent: "border-red-400",
        };
      case "Cloture":
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: <CheckCircle size={16} className="text-gray-600" />,
          accent: "border-gray-400",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: <FileText size={16} className="text-gray-600" />,
          accent: "border-gray-400",
        };
    }
  };

  const getEligibilityStatus = (note) => {
    if (note >= 80) {
      return {
        label: "Dossier favorable",
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <CheckCircle size={16} className="text-green-600" />,
      };
    } else if (note >= 50) {
      return {
        label: "Dossier a examiner",
        bg: "bg-orange-100",
        text: "text-orange-800",
        icon: <AlertCircle size={16} className="text-orange-600" />,
      };
    } else {
      return {
        label: "Insuffisant",
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <XCircle size={16} className="text-red-600" />,
      };
    }
  };

  const statusOptions = [
    {
      value: "Incomplet",
      label: "Incomplet",
      icon: <AlertTriangle size={18} className="text-orange-600" />,
    },
    {
      value: "Accepte",
      label: "Accepte",
      icon: <CheckSquare size={18} className="text-green-600" />,
    },
    {
      value: "Rejete",
      label: "Rejete",
      icon: <XCircle size={18} className="text-red-600" />,
    },
    {
      value: "Cloture",
      label: "Cloture",
      icon: <CheckCircle size={18} className="text-gray-600" />,
    },
  ];

  const statusStyle = getStatusColor(dossier.statutDossier);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://fhn-backend-2.onrender.com/dossier_enfant/changeDossierState",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dossierId: dossier.id,
            newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors du changement de statut");
      }

      onStatusChange(dossier.id, newStatus);
    } catch (err) {
      console.error("Erreur lors du changement de statut:", err);
      setError(
        err.message || "Une erreur est survenue lors du changement de statut"
      );
      setSelectedStatus(dossier.statutDossier);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const DetailRow = ({ label, value, icon }) => (
    <div className="flex items-center py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center w-1/2 text-gray-600">
        {icon && <span className="mr-2">{icon}</span>}
        <span>{label}</span>
      </div>
      <div className="w-1/2 text-gray-900 font-medium">{value || "N/A"}</div>
    </div>
  );

  const Section = ({ title, icon, id, children }) => (
    <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-gray-50 to-white"
        onClick={() => toggleSection(id)}
      >
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-500 transition-transform ${
            expandedSections[id] ? "transform rotate-180" : ""
          }`}
        />
      </div>
      {expandedSections[id] && <div className="p-4">{children}</div>}
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30">
      <div className="bg-gray-50 rounded-xl shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="relative p-6 bg-green-700 text-white">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-2xl font-bold tracking-tight">
                  {dossier.nom}
                </h2>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                >
                  {statusStyle.icon}
                  <span className="ml-1">{dossier.statutDossier}</span>
                </span>
                {dossier.note !== undefined && (
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      getEligibilityStatus(dossier.note).bg
                    } ${getEligibilityStatus(dossier.note).text}`}
                  >
                    {getEligibilityStatus(dossier.note).icon}
                    <span className="ml-1">
                      {getEligibilityStatus(dossier.note).label} ({dossier.note}
                      )
                    </span>
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3 text-sm text-blue-100">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>Crée le {formatDate(dossier.dateCreation)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  <span>{dossier.commune || "Commune non spécifiée"}</span>
                </div>
                <div className="flex items-center">
                  <Building size={14} className="mr-1" />
                  <span>
                    {dossier.etablissementId === 1
                      ? "TARII"
                      : dossier.etablissementId === 2
                      ? "WISI"
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-6 right-16">
            <select
              className={`flex items-center space-x-2 px-4 py-2 rounded-md shadow-md transition-all border-l-4 ${statusStyle.accent} bg-white text-gray-800 hover:bg-gray-50 focus:outline-none`}
              value={selectedStatus}
              onChange={handleStatusChange}
              disabled={isLoading}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="mt-2 text-red-200 text-sm">{error}</div>}

          <div className="flex mt-6 space-x-2">
            <button
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === "info"
                  ? "bg-white text-blue-700"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
              onClick={() => setActiveTab("info")}
            >
              Informations
            </button>
            <button
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === "history"
                  ? "bg-white text-blue-700"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
              onClick={() => setActiveTab("history")}
            >
              Historique
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {activeTab === "info" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Section
                  title="Informations de l'enfant"
                  icon={<User size={18} className="text-blue-500" />}
                  id="enfant"
                >
                  <div className="space-y-1">
                    <DetailRow
                      label="Nom complet"
                      value={dossier.nom}
                      icon={<User size={16} className="text-gray-400" />}
                    />
                    <DetailRow
                      label="Date de naissance"
                      value={formatDate(
                        dossier.dateNaissance ||
                          dossier.dateAissance ||
                          dossier.dateCreation
                      )}
                      icon={<Calendar size={16} className="text-gray-400" />}
                    />
                    <DetailRow
                      label="Sexe"
                      value={dossier.sexe}
                      icon={<User size={16} className="text-gray-400" />}
                    />
                    <DetailRow
                      label="Commune"
                      value={dossier.commune}
                      icon={<MapPin size={16} className="text-gray-400" />}
                    />
                    <DetailRow
                      label="Diagnostic"
                      value={
                        dossier.diagnostic || dossier.diagnosis || dossier.diag
                      }
                      icon={<FileCheck size={16} className="text-gray-400" />}
                    />
                    <DetailRow
                      label="Note d'éligibilité"
                      value={
                        dossier.note !== undefined
                          ? `${dossier.note} (${
                              getEligibilityStatus(dossier.note).label
                            })`
                          : "N/A"
                      }
                      icon={<FileCheck size={16} className="text-gray-400" />}
                    />
                  </div>
                </Section>

                <Section
                  title="Parent/Tuteur"
                  icon={<User size={18} className="text-indigo-500" />}
                  id="parent"
                >
                  <div className="space-y-1">
                    <DetailRow
                      label="Nom complet"
                      value={dossier.parent?.nom}
                      icon={<User size={16} className="text-gray-400" />}
                    />
                    <DetailRow
                      label="Téléphone"
                      value={dossier.parent?.telephone}
                      icon={<Phone size={16} className="text-gray-400" />}
                    />
                    <DetailRow
                      label="Email"
                      value={dossier.parent?.email}
                      icon={<Mail size={16} className="text-gray-400" />}
                    />
                  </div>
                </Section>

                <Section
                  title="Scolarisation"
                  icon={<Book size={18} className="text-green-500" />}
                  id="scolarisation"
                >
                  <div className="space-y-1">
                    <DetailRow
                      label="Scolarisé"
                      value={formatBoolean(dossier.estScolarise)}
                      icon={<Book size={16} className="text-gray-400" />}
                    />
                    {dossier.estScolarise && (
                      <>
                        <DetailRow
                          label="Niveau scolaire"
                          value={dossier.niveauScolaire}
                          icon={<Book size={16} className="text-gray-400" />}
                        />
                        <DetailRow
                          label="Ancien établissement"
                          value={dossier.ancienEtablissement}
                          icon={
                            <Building size={16} className="text-gray-400" />
                          }
                        />
                      </>
                    )}
                    <DetailRow
                      label="Activités quotidiennes"
                      value={dossier.activitesQuotidiennes}
                      icon={<Briefcase size={16} className="text-gray-400" />}
                    />
                  </div>
                </Section>

                <Section
                  title={
                    dossier.etablissementId === 1
                      ? "Détails TARII"
                      : "Détails stimulants WISI"
                  }
                  icon={<Building size={18} className="text-yellow-500" />}
                  id="etablissement"
                >
                  <div className="space-y-1">
                    {dossier.etablissementId === 2 ? (
                      <>
                        <DetailRow
                          label="Consultation ophtalmologique"
                          value={formatBoolean(dossier.aConsulteOphtalmo)}
                          icon={<EyeIcon size={16} className="text-gray-400" />}
                        />
                        <DetailRow
                          label="Autre suivi médical"
                          value={formatBoolean(dossier.aAutreSuiviMedical)}
                          icon={
                            <FileCheck size={16} className="text-gray-400" />
                          }
                        />
                        {dossier.aAutreSuiviMedical && (
                          <DetailRow
                            label="Détails suivi médical"
                            value={dossier.detailsSuiviMedical}
                            icon={
                              <FileText size={16} className="text-gray-400" />
                            }
                          />
                        )}
                        <DetailRow
                          label="Perception visuelle"
                          value={formatBoolean(dossier.aPerceptionVisuelle)}
                          icon={<EyeIcon size={16} className="text-gray-400" />}
                        />
                        <DetailRow
                          label="Cécité totale"
                          value={formatBoolean(dossier.estAveugle)}
                          icon={<EyeOff size={16} className="text-gray-400" />}
                        />
                      </>
                    ) : (
                      <>
                        <DetailRow
                          label="Suivi orthophonique"
                          value={formatBoolean(dossier.suiviOrthophonique)}
                          icon={
                            <MessageSquare
                              size={16}
                              className="text-gray-400"
                            />
                          }
                        />
                        <DetailRow
                          label="Suivi psychologique"
                          value={formatBoolean(
                            dossier.suiviPsychologique ||
                              dossier.suiviPsylogique
                          )}
                          icon={<User size={16} className="text-gray-400" />}
                        />
                        <DetailRow
                          label="Suivi psychomoteur"
                          value={formatBoolean(dossier.psychomotricien)}
                          icon={<User size={16} className="text-gray-400" />}
                        />
                        <DetailRow
                          label="Consultation tradipraticien"
                          value={formatBoolean(dossier.tradipracticien)}
                          icon={<User size={16} className="text-gray-400" />}
                        />
                      </>
                    )}
                  </div>
                </Section>

                <Section
                  title="Documents"
                  icon={<FileText size={18} className="text-purple-500" />}
                  id="documents"
                >
                  {dossier.documents && dossier.documents.length > 0 ? (
                    <div className="space-y-2">
                      {dossier.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <FileText
                              size={16}
                              className="mr-2 text-gray-500"
                            />
                            <span className="text-sm">
                              {doc.nomFichier || "Document sans nom"}
                              {doc.type && (
                                <span className="text-xs text-gray-500 ml-1">
                                  ({doc.type})
                                </span>
                              )}
                            </span>
                          </div>
                          <button className="p-1 hover:bg-blue-100 rounded-full">
                            <Download size={14} className="text-blue-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-3 text-center text-gray-500 italic bg-gray-50 rounded-lg">
                      Aucun document attaché au dossier
                    </div>
                  )}
                </Section>

                <Section
                  title="Attentes et observations"
                  icon={<MessageSquare size={18} className="text-red-500" />}
                  id="observations"
                >
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        Attentes
                      </p>
                      <p className="text-sm text-blue-900">
                        {dossier.attente || "Non spécifié"}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-1">
                        Observations
                      </p>
                      <p className="text-sm text-green-900">
                        {dossier.observations || "Non spécifié"}
                      </p>
                    </div>
                  </div>
                </Section>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Calendar size={18} className="text-blue-500 mr-2" />
                  Historique des observations
                </h3>
                {dossier.observations ? (
                  <div className="space-y-4">
                    <div
                      key={idx}
                      className="relative pl-6 pb-6 border-l-2 border-blue-200 last:border-0"
                    >
                      <div className="absolute -left-2 top-0">
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-800">{dossier.observations}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center text-gray-500 italic bg-gray-50 rounded-lg">
                    Aucune observation dans l'historique
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="text-xs text-gray-500">
            Dossier #{dossier.id} • Dernière modification:{" "}
            {formatDate(dossier.dateCreation)}
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium transition-colors">
              Modifier
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-green-700 text-white rounded hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// NewDossierModal Component
const NewDossierModal = ({ isOpen, onClose, onSubmit, documentTypes }) => {
  const [formType, setFormType] = useState(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setFormType(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Nouvelle demande d'inscription
          </h3>
          <button
            onClick={resetForm}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        {!formType ? (
          <div className="p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Sélectionnez le type de dossier
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setFormType("TARII")}
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
                onClick={() => setFormType("WISI")}
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
        ) : (
          <DossierForm
            onSubmit={onSubmit}
            onCancel={resetForm}
            documentTypes={documentTypes}
            formType={formType}
          />
        )}
      </div>
    </div>
  );
};

// DossiersPage Component
const DossiersPage = () => {
  const [dossiers, setDossiers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("Tous");
  const [selectedCommune, setSelectedCommune] = useState("Toutes");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewMode, setViewMode] = useState("liste");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showDatePanel, setShowDatePanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);
  const [selectedDossierId, setSelectedDossierId] = useState(null);
  const [isNewDossierModalOpen, setIsNewDossierModalOpen] = useState(false); // Nouvel état pour la modale
  const navigate = useNavigate();

  // Types de documents
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

  useEffect(() => {
    const fetchDossiers = async () => {
      setIsLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("authToken");
        const headers = { Accept: "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(
          "https://fhn-backend-2.onrender.com/dossier_enfant",
          {
            method: "GET",
            headers,
            credentials: "include",
          }
        );
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/");
          return;
        }
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Erreur lors de la récupération des dossiers"
          );
        }
        const data = await response.json();
        const dossiersWithNote = (data.data || []).map((dossier) => ({
          ...dossier,
          note: dossier.note, // Use backend-provided note
        }));
        setDossiers(dossiersWithNote);
      } catch (err) {
        console.error("Erreur lors de la récupération des dossiers:", err);
        setError(
          err.message ||
            "Une erreur est survenue lors de la récupération des dossiers"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchDossiers();
  }, [navigate]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("fr-FR");
    } catch (e) {
      return "Date invalide";
    }
  };

  const statuts = [
    "Tous",
    "Nouveau",
    "En cours",
    "Incomplet",
    "Accepte",
    "Rejete",
    "Cloture",
  ];
  const communes = [
    "Toutes",
    ...Array.from(new Set(dossiers.map((d) => d.commune))),
  ];

  const filteredDossiers = dossiers.filter((dossier) => {
    const matchesSearch =
      dossier.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dossier.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      dossier.parent.nom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatut =
      selectedStatut === "Tous" || dossier.statutDossier === selectedStatut;
    const matchesCommune =
      selectedCommune === "Toutes" || dossier.commune === selectedCommune;
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

  const getStatusColor = (statut) => {
    switch (statut) {
      case "Nouveau":
        return "bg-blue-100 text-blue-800";
      case "En cours":
        return "bg-yellow-100 text-yellow-800";
      case "Incomplet":
        return "bg-orange-100 text-orange-800";
      case "Accepte":
        return "bg-green-100 text-green-800";
      case "Rejete":
        return "bg-red-100 text-red-800";
      case "Cloture":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (statut) => {
    switch (statut) {
      case "Nouveau":
        return <FileText size={16} />;
      case "En cours":
        return <Clock size={16} />;
      case "Incomplet":
        return <AlertCircle size={16} />;
      case "Accepte":
        return <CheckCircle size={16} />;
      case "Rejete":
        return <X size={16} />;
      case "Cloture":
        return <CheckCircle size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getEligibilityStatus = (note) => {
    if (note >= 80) {
      return {
        label: "Dossier favorable",
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <CheckCircle size={16} className="text-green-600" />,
      };
    } else if (note >= 50) {
      return {
        label: "Dossier a examiner",
        bg: "bg-orange-100",
        text: "text-orange-800",
        icon: <AlertCircle size={16} className="text-orange-600" />,
      };
    } else {
      return {
        label: "Insuffisant",
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <XCircle size={16} className="text-red-600" />,
      };
    }
  };

  const handleStatusChange = (dossierId, newStatus) => {
    setDossiers((prevDossiers) =>
      prevDossiers.map((d) =>
        d.id === dossierId ? { ...d, statutDossier: newStatus } : d
      )
    );
    if (selectedDossier && selectedDossier.id === dossierId) {
      setSelectedDossier((prev) => ({ ...prev, statutDossier: newStatus }));
    }
  };

  const handleObservationSubmit = (dossierId, newObservation) => {
    setDossiers((prevDossiers) =>
      prevDossiers.map((d) =>
        d.id === dossierId
          ? {
              ...d,
              observations: d.observations
                ? [...d.observations, newObservation]
                : [newObservation],
            }
          : d
      )
    );
    if (selectedDossier && selectedDossier.id === dossierId) {
      setSelectedDossier((prev) => ({
        ...prev,
        observations: prev.observations
          ? [...prev.observations, newObservation]
          : [newObservation],
      }));
    }
  };

  const openObservationModal = (dossierId) => {
    setSelectedDossierId(dossierId);
    setIsObservationModalOpen(true);
  };

  // Logique de soumission du formulaire
  const handleSubmit = async (formData) => {
    const formDataToSend = new FormData();
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

    Object.keys(fields).forEach((key) => {
      const value = fields[key];
      if (value !== undefined && value !== null) {
        formDataToSend.append(key, value.toString());
      }
    });

    const filesInfo = formData.documents.map((doc) => ({
      natureId: doc.type.toString(),
    }));

    formData.documents.forEach((doc) => {
      formDataToSend.append("fichiers", doc.file);
    });

    formDataToSend.append("filesInfo", JSON.stringify(filesInfo));

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Vous devez être connecté.");
        navigate("/");
        return;
      }

      const response = await fetch(
        "https://fhn-backend-2.onrender.com/dossier_enfant",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataToSend,
        }
      );

      const result = await response.json();
      if (!response.ok) {
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

      // Rafraîchir la liste des dossiers
      const fetchDossiers = async () => {
        try {
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
          const data = await response.json();
          if (!response.ok) {
            throw new Error(
              data.message || "Erreur lors de la récupération des dossiers"
            );
          }
          setDossiers(data.data || []);
        } catch (err) {
          setError(err.message);
        }
      };
      await fetchDossiers();
      setIsNewDossierModalOpen(false);
      alert("Demande soumise avec succès !");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      alert(`Une erreur est survenue : ${error.message}`);
    }
  };

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Gestion des dossiers
        </h1>
        <p className="text-gray-500">
          Liste et gestion des dossiers de recensement -{" "}
          {new Date().toLocaleDateString("fr-FR")}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6 justify-between">
        <button
          className="bg-green-600 rounded-lg shadow-sm px-4 py-2.5 flex items-center text-sm text-white hover:bg-green-700 transition-colors"
          onClick={() => setIsNewDossierModalOpen(true)} // Ouvre la modale
        >
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

      <div className="bg-white rounded-xl shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Chargement des dossiers...
          </div>
        ) : (
          <>
            {viewMode === "liste" ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avatar
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
                        Éligibilité
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
                      filteredDossiers.map((dossier) => {
                        const eligibility = getEligibilityStatus(
                          dossier.note || 0
                        );
                        return (
                          <tr key={dossier.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Avatar
                                name={dossier.nom}
                                status={dossier.statutDossier}
                              />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                              {dossier.nom}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                              {formatDate(dossier.dateNaissance)}
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
                                <span className="ml-1">
                                  {dossier.statutDossier}
                                </span>
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${eligibility.bg} ${eligibility.text}`}
                              >
                                {eligibility.icon}
                                <span className="ml-1">
                                  {eligibility.label} ({dossier.note})
                                </span>
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                              {formatDate(dossier.dateCreation)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => setSelectedDossier(dossier)}
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  className="text-gray-600 hover:text-gray-900"
                                  onClick={() =>
                                    openObservationModal(dossier.id)
                                  }
                                >
                                  <Pencil size={18} />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
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
                    filteredDossiers.map((dossier) => {
                      const eligibility = getEligibilityStatus(
                        dossier.note || 0
                      );
                      return (
                        <div
                          key={dossier.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className="mr-3">
                                <Avatar
                                  name={dossier.nom}
                                  status={dossier.statutDossier}
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {dossier.nom}
                                </h3>
                              </div>
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                dossier.statutDossier
                              )}`}
                            >
                              {getStatusIcon(dossier.statutDossier)}
                              <span className="ml-1">
                                {dossier.statutDossier}
                              </span>
                            </span>
                          </div>
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">
                                Date de naissance:
                              </span>
                              <span className="text-gray-700">
                                {formatDate(dossier.dateNaissance)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Commune:</span>
                              <span className="text-gray-700">
                                {dossier.commune}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">
                                Parent/Tuteur:
                              </span>
                              <span className="text-gray-700">
                                {dossier.parent.nom}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">
                                Éligibilité:
                              </span>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${eligibility.bg} ${eligibility.text}`}
                              >
                                {eligibility.icon}
                                <span className="ml-1">
                                  {eligibility.label} ({dossier.note})
                                </span>
                              </span>
                            </div>
                            {dossier.observations && (
                              <div className="text-sm mt-2">
                                <span className="text-gray-500">
                                  Observation:
                                </span>
                                <p className="text-gray-700 mt-1 italic">
                                  {dossier.observations}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="mt-4 pt-3 border-t flex justify-between items-center">
                            <div className="text-xs text-gray-500">
                              {dossier.documents ? dossier.documents.length : 0}{" "}
                              document(s):{" "}
                              {dossier.documents && dossier.documents.length > 0
                                ? dossier.documents
                                    .map((doc) => doc.nomFichier)
                                    .join(", ")
                                : "Aucun"}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                className="p-1 text-blue-600 hover:text-blue-900"
                                onClick={() => setSelectedDossier(dossier)}
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                className="p-1 text-gray-600 hover:text-gray-900"
                                onClick={() => openObservationModal(dossier.id)}
                              >
                                <Pencil size={18} />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-900">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full p-8 text-center text-gray-500">
                      Aucun dossier ne correspond à votre recherche
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
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

      <DossierModal
        dossier={selectedDossier}
        isOpen={!!selectedDossier}
        onClose={() => setSelectedDossier(null)}
        onStatusChange={handleStatusChange}
      />

      <ObservationModal
        isOpen={isObservationModalOpen}
        onClose={() => {
          setIsObservationModalOpen(false);
          setSelectedDossierId(null);
        }}
        onSubmit={handleObservationSubmit}
        dossierId={selectedDossierId}
      />

      <NewDossierModal
        isOpen={isNewDossierModalOpen}
        onClose={() => setIsNewDossierModalOpen(false)}
        onSubmit={handleSubmit}
        documentTypes={documentTypes}
      />
    </main>
  );
};

export default DossiersPage;
