// // components/admin/users/UserList.tsx
// "use client";
// import ModalUserForm from "@/components/ModalUserForm";
// import { useEffect, useState } from "react";
// import { Pencil, Trash2, Plus } from "lucide-react";
// import { motion } from "framer-motion";

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// const UserList = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editUser, setEditUser] = useState<User | null>(null);

//   const fetchUsers = async () => {
//     try {
//       const res = await fetch("/api/admin/users");
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       const data = await res.json();
//       setUsers(data);
//       setLoading(false);
//     } catch (e: any) {
//       setError(e.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     let updated = users;
//     if (searchTerm) {
//       updated = updated.filter((user) =>
//         `${user.name} ${user.email}`
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       );
//     }
//     if (roleFilter !== "all") {
//       updated = updated.filter((user) => user.role === roleFilter);
//     }
//     setFilteredUsers(updated);
//   }, [searchTerm, roleFilter, users]);

//   const handleDelete = async (id: string) => {
//     if (!confirm("Confirmer la suppression ?")) return;
//     try {
//       const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Erreur lors de la suppression");
//       fetchUsers();
//     } catch (err) {
//       alert("Erreur de suppression");
//     }
//   };

//   const openAddModal = () => {
//     setEditUser(null);
//     setIsModalOpen(true);
//   };

//   const openEditModal = (user: User) => {
//     setEditUser(user);
//     setIsModalOpen(true);
//   };

//   return (
//     <section className="space-y-8">
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//         <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
//           <div className="relative w-full sm:w-64">
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//               🔍
//             </span>
//             <input
//               type="text"
//               placeholder="Rechercher un utilisateur..."
//               className="pl-10 pr-4 py-2 w-full rounded-xl bg-white border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-300 focus:outline-none text-gray-800 placeholder:text-gray-400"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <div className="relative w-full sm:w-48">
//             <select
//               value={roleFilter}
//               onChange={(e) => setRoleFilter(e.target.value)}
//               className="w-full appearance-none pl-4 pr-10 py-2 rounded-xl bg-white border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-300 focus:outline-none text-gray-800"
//             >
//               <option value="all" className="bg-white text-gray-800">
//                 🎭 Tous les rôles
//               </option>
//               <option value="admin" className="bg-white text-red-500">
//                 🔴 Administrateur
//               </option>
//               <option value="entreprise" className="bg-white text-green-500">
//                 🟢 Entreprise
//               </option>
//               <option value="etudiant" className="bg-white text-blue-500">
//                 🔵 Étudiant
//               </option>
//             </select>
//             <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
//               ▼
//             </span>
//           </div>
//         </div>

//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.97 }}
//           className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition duration-200"
//           onClick={openAddModal}
//         >
//           <motion.span
//             initial={{ rotate: 0 }}
//             whileHover={{ rotate: 90 }}
//             transition={{ type: "spring", stiffness: 300 }}
//             className="text-white"
//           >
//             <Plus className="w-5 h-5" />
//           </motion.span>
//           <span>Ajouter un utilisateur</span>
//         </motion.button>
//       </div>

//       <div className="overflow-auto rounded-xl shadow-md border border-gray-200 bg-white">
//         <table className="min-w-full table-auto">
//           <thead className="bg-pink-50 border-b border-pink-100 text-gray-700">
//             <tr>
//               <th className="text-left text-sm font-semibold text-pink-500 px-6 py-4">
//                 Nom
//               </th>
//               <th className="text-left text-sm font-semibold text-pink-500 px-6 py-4">
//                 Email
//               </th>
//               <th className="text-left text-sm font-semibold text-pink-500 px-6 py-4">
//                 Rôle
//               </th>
//               <th className="text-center text-sm font-semibold text-pink-500 px-6 py-4">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.map((user, index) => (
//               <tr
//                 key={user._id}
//                 className={`border-b border-gray-200 ${
//                   index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                 } hover:bg-pink-50/10 transition text-gray-800`}
//               >
//                 <td className="px-6 py-4 text-sm truncate max-w-xs">
//                   {user.name}
//                 </td>
//                 <td className="px-6 py-4 text-sm truncate max-w-xs">
//                   {user.email}
//                 </td>
//                 <td className="px-6 py-4">
//                   <span
//                     className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
//                       user.role === "admin"
//                         ? "bg-red-500"
//                         : user.role === "recruteur"
//                         ? "bg-green-500"
//                         : "bg-blue-500"
//                     }`}
//                   >
//                     {user.role}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-center">
//                   <div className="flex justify-center gap-4">
//                     <motion.button
//                       whileHover={{ scale: 1.2 }}
//                       className="text-indigo-500 hover:text-indigo-600"
//                       title="Modifier"
//                       onClick={() => openEditModal(user)}
//                     >
//                       <Pencil className="w-5 h-5" />
//                     </motion.button>
//                     <motion.button
//                       whileHover={{ scale: 1.2 }}
//                       className="text-red-500 hover:text-red-600"
//                       title="Supprimer"
//                       onClick={() => handleDelete(user._id)}
//                     >
//                       <Trash2 className="w-5 h-5" />
//                     </motion.button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <ModalUserForm
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={fetchUsers}
//         editUser={editUser}
//       />
//     </section>
//   );
// };

// export default UserList;
// components/admin/users/UserList.tsx
"use client";
import ModalUserForm from "@/components/ModalUserForm";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import { FaFileExport } from "react-icons/fa"; // Import pour l'icône d'exportation

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let updated = users;
    if (searchTerm) {
      updated = updated.filter((user) =>
        `${user.name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (roleFilter !== "all") {
      updated = updated.filter((user) => user.role === roleFilter);
    }
    setFilteredUsers(updated);
  }, [searchTerm, roleFilter, users]);

  const handleDelete = async (id: string) => {
    if (!confirm("Confirmer la suppression ?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      fetchUsers();
    } catch (err: any) {
      alert("Erreur de suppression");
    }
  };

  const openAddModal = () => {
    setEditUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditUser(user);
    setIsModalOpen(true);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des Utilisateurs", 10, 10);
    doc.setFontSize(12);

    let y = 20;
    const headers = ["Nom", "Email", "Rôle"];
    let x = 10;
    headers.forEach((header) => {
      doc.text(header, x, y);
      x += 60; // Ajuster l'espacement
    });
    y += 5;
    doc.line(10, y, 200, y);
    y += 5;
    doc.setFontSize(10);

    filteredUsers.forEach((user) => {
      x = 10;
      doc.text(user.name, x, y);
      x += 60;
      doc.text(user.email, x, y);
      x += 60;
      doc.text(user.role, x, y);
      y += 10;
    });

    doc.save("liste_utilisateurs.pdf");
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className="pl-10 pr-4 py-2 w-full rounded-xl bg-white border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-300 focus:outline-none text-gray-800 placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full sm:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2 rounded-xl bg-white border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-300 focus:outline-none text-gray-800"
            >
              <option value="all" className="bg-white text-gray-800">
                🎭 Tous les rôles
              </option>
              <option value="admin" className="bg-white text-red-500">
                🔴 Administrateur
              </option>
              <option value="recruteur" className="bg-white text-green-500">
                🟢 Recruteur
              </option>
              <option value="etudiant" className="bg-white text-blue-500">
                🔵 Étudiant
              </option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              ▼
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-300 hover:bg-pink-400 text-white font-semibold shadow-lg hover:shadow-xl transition duration-200"
            onClick={generatePDF}
          >
            <FaFileExport className="w-5 h-5" /> {/* Icône d'exportation */}
            <span>Exporter</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition duration-200"
            onClick={openAddModal}
          >
            <motion.span
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-white"
            >
              <Plus className="w-5 h-5" />
            </motion.span>
            <span>Ajouter un utilisateur</span>
          </motion.button>
        </div>
      </div>

      <div className="overflow-auto rounded-xl shadow-md border border-gray-200 bg-white">
        <table className="min-w-full table-auto">
          <thead className="bg-pink-50 border-b border-pink-100 text-gray-700">
            <tr>
              <th className="text-left text-sm font-semibold text-pink-500 px-6 py-4">
                Nom
              </th>
              <th className="text-left text-sm font-semibold text-pink-500 px-6 py-4">
                Email
              </th>
              <th className="text-left text-sm font-semibold text-pink-500 px-6 py-4">
                Rôle
              </th>
              <th className="text-center text-sm font-semibold text-pink-500 px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user._id}
                className={`border-b border-gray-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-pink-50/10 transition text-gray-800`}
              >
                <td className="px-6 py-4 text-sm truncate max-w-xs">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-sm truncate max-w-xs">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
                      user.role === "admin"
                        ? "bg-red-500"
                        : user.role === "recruteur"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      className="text-indigo-500 hover:text-indigo-600"
                      title="Modifier"
                      onClick={() => openEditModal(user)}
                    >
                      <Pencil className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      className="text-red-500 hover:text-red-600"
                      title="Supprimer"
                      onClick={() => handleDelete(user._id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalUserForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchUsers}
        editUser={editUser}
      />
    </section>
  );
};

export default UserList;