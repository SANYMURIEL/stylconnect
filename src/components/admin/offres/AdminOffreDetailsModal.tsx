// AdminOffreDetailsModal.tsx
import { Pencil } from "lucide-react";

interface Offre {
  _id?: string;
  titre: string;
  description: string;
  type: "stage" | "emploi";
  datePublication?: string;
  statut?: "approuve" | "en attente";
  idRecruteur?: any; // Peut être une chaîne ou un objet
  recruteur?: {
    _id: string;
    nom: string;
    email: string;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  offre: Offre | null;
  onEdit: () => void;
}

const AdminOffreDetailsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  offre,
  onEdit,
}) => {
  if (!offre || !isOpen) return null;

  // Afficher le champ 'name' si idRecruteur est un objet
  const displayedIdRecruteur =
    typeof offre.idRecruteur === "object" &&
    offre.idRecruteur !== null &&
    "name" in offre.idRecruteur
      ? offre.idRecruteur.name
      : String(offre.idRecruteur || "N/A");

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-medium mb-4">Détails de l'offre</h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Titre
            </label>
            <p className="text-gray-800">{offre.titre}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <p className="text-gray-800 whitespace-pre-line">
              {offre.description}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Type
              </label>
              <p className="capitalize text-gray-800">{offre.type}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Statut
              </label>
              <p className="capitalize text-gray-800">{offre.statut}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nom Recruteur
            </label>
            <p className="text-gray-800">{displayedIdRecruteur}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Publication
              </label>
              <p className="text-gray-800">
                {offre.datePublication
                  ? new Date(offre.datePublication).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
         
          </div>
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

export default AdminOffreDetailsModal;
