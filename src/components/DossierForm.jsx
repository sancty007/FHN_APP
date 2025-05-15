import { useState } from "react";
import { UploadCloud, FileText, Trash2 } from "lucide-react";

const DossierForm = ({
  onSubmit,
  onCancel,
  documentTypes,
  formType,
  initialData = {},
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nom: "",
    dateNaissance: "",
    sexe: "",
    commune: "",
    diagnostic:
      formType === "TARII"
        ? "Trouble du spectre autistique"
        : "Déficience visuelle",
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
    etablissementId: formType === "TARII" ? 1 : 2,
    dateCreation: new Date().toISOString().split("T")[0],
    ...initialData,
  });

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
      type: "",
    }));
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments],
    }));
  };

  // Mise à jour du type de document
  const handleDocumentTypeChange = (index, id) => {
    setFormData((prev) => {
      const updatedDocuments = [...prev.documents];
      updatedDocuments[index].type = id;
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

  // Soumission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.documents.some((doc) => !doc.type)) {
      alert("Veuillez sélectionner un type pour chaque document.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Nouvelle demande d'inscription ({formType})
        </h3>
      </div>
      <form onSubmit={handleFormSubmit} className="p-6">
        {/* Progression */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span
              className={`text-sm font-medium ${
                currentStep >= 1 ? "text-green-600" : "text-gray-500"
              }`}
            >
              Enfant
            </span>
            <span
              className={`text-sm font-medium ${
                currentStep >= 2 ? "text-green-600" : "text-gray-500"
              }`}
            >
              Parent/Documents
            </span>
            <span
              className={`text-sm font-medium ${
                currentStep >= 3 ? "text-green-600" : "text-gray-500"
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
              <h4 className="text-md font-medium text-gray-900">Documents</h4>
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
                          <FileText size={14} className="text-gray-400" />
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
                            onClick={() => handleRemoveDocument(idx)}
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
                {formType === "TARII" ? "Détails TARII" : "Détails WISI"}
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
                onCancel();
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
    </div>
  );
};

export default DossierForm;
