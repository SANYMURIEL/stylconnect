import { Pencil } from "lucide-react";

interface Projet {
  _id?: string;
  titre: string;
  description?: string;
  dateCreation?: string;
  media?: string;
  auteurId?: any; // Peut être une chaîne ou un objet
  auteur?: {
    _id: string;
    nom: string;
    email: string;
  };
  likes?: number;
  statut?: "approuve" | "en attente";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projet: Projet | null;
  onEdit: () => void;
}

const AdminProjetDetailsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  projet,
  onEdit,
}) => {
  if (!projet || !isOpen) return null;

  // Afficher le champ 'name' si auteurId est un objet
  const displayedAuteurId =
    typeof projet.auteurId === "object" &&
    projet.auteurId !== null &&
    "name" in projet.auteurId
      ? projet.auteurId.name
      : String(projet.auteurId || "N/A");

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-medium mb-4">Détails du projet</h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Titre
            </label>
            <p className="text-gray-800">{projet.titre}</p>
          </div>
          {projet.description && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <p className="text-gray-800 whitespace-pre-line">
                {projet.description}
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Création
              </label>
              <p className="capitalize text-gray-800">
                {projet.dateCreation
                  ? new Date(projet.dateCreation).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Statut
              </label>
              <p className="capitalize text-gray-800">{projet.statut}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nom Auteur
            </label>
            <p className="text-gray-800">{displayedAuteurId}</p>
          </div>
          {projet.media && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Média
              </label>
              <a
                href={projet.media}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Voir le média
              </a>
            </div>
          )}
          {projet.likes !== undefined && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Likes
              </label>
              <p className="text-gray-800">{projet.likes}</p>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Fermer
          </button>
          <button
            onClick={onEdit}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            <Pencil className="mr-2 w-4 h-4" /> Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProjetDetailsModal;
