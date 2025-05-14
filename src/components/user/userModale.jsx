"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "../toast";

// Define the form schema with Zod
const formSchema = z.object({
  nom: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  mot_de_passe: z
    .string()
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  role: z.enum(["analyste", "secretaire"], {
    required_error: "Veuillez sélectionner un rôle",
  }),
});

export function UserModal({ showModal, setShowModal, onUserCreated }) {
  const { toast, Toasts } = useToast();

  // Initialize React Hook Form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      email: "",
      mot_de_passe: "",
      role: "analyste",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  if (!showModal) return null;

  const onSubmit = (data) => {
    // Envoi des données au composant parent
    onUserCreated(data);
    // Envoi des données (à adapter avec Axios par exemple)
    console.log("Utilisateur à créer :", data);

    // Afficher un message de succès
    toast({
      title: "Utilisateur créé",
      description: "L'utilisateur a été créé avec succès",
    });

    // Réinitialiser le formulaire
    reset();

    // Fermer la modale après soumission
    setShowModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Créer un utilisateur
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="nom"
                className="block text-sm font-medium text-gray-700"
              >
                Nom d'utilisateur
              </label>
              <input
                id="nom"
                type="text"
                placeholder="Entrez le nom d'utilisateur"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.nom ? "border-red-500" : "border-gray-300"
                }`}
                {...register("nom")}
              />
              {errors.nom && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.nom.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="exemple@domaine.com"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Rôle
              </label>
              <select
                id="role"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.role ? "border-red-500" : "border-gray-300"
                }`}
                {...register("role")}
              >
                <option value="analyste">Analyste</option>
                <option value="secretaire">Secrétaire</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="mot_de_passe"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <input
                id="mot_de_passe"
                type="password"
                placeholder="Entrez un mot de passe"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.mot_de_passe ? "border-red-500" : "border-gray-300"
                }`}
                {...register("mot_de_passe")}
              />
              {errors.mot_de_passe && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.mot_de_passe.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </form>
        </div>
      </div>
      <Toasts />
    </>
  );
}

UserModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  onUserCreated: PropTypes.func.isRequired,
};
