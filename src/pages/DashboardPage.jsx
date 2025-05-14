import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  Calendar,
  Plus,
  ArrowRight,
} from "lucide-react";

// Données fictives pour le tableau de bord
const mockData = {
  totalDossiers: 145,
  statsDossiers: {
    nouveau: 23,
    enCours: 52,
    incomplet: 18,
    accepte: 37,
    rejete: 8,
    cloture: 7,
  },
  recentDossiers: [
    {
      id: "FHN-2025-0145",
      nom: "Koumba Sophie",
      age: 7,
      sexe: "F",
      statut: "Nouveau",
      date: "14/05/2025",
    },
    {
      id: "FHN-2025-0144",
      nom: "Ndong Jean",
      age: 10,
      sexe: "M",
      statut: "En cours",
      date: "13/05/2025",
    },
    {
      id: "FHN-2025-0143",
      nom: "Mezui Pierre",
      age: 5,
      sexe: "M",
      statut: "Incomplet",
      date: "13/05/2025",
    },
    {
      id: "FHN-2025-0142",
      nom: "Asseko Marie",
      age: 8,
      sexe: "F",
      statut: "Accepté",
      date: "12/05/2025",
    },
    {
      id: "FHN-2025-0141",
      nom: "Obame Daniel",
      age: 6,
      sexe: "M",
      statut: "En cours",
      date: "12/05/2025",
    },
  ],
  statParRegion: {
    labels: ["Libreville", "Port-Gentil", "Franceville", "Oyem", "Lambaréné"],
    values: [65, 27, 23, 18, 12],
  },
};

// Composant pour les cartes de statistiques
const StatCard = ({ title, value, icon, color, growth }) => {
  const colorClasses = {
    blue: "text-blue-500 bg-blue-100",
    green: "text-green-500 bg-green-100",
    yellow: "text-yellow-500 bg-yellow-100",
    orange: "text-orange-500 bg-orange-100",
    purple: "text-purple-500 bg-purple-100",
    red: "text-red-500 bg-red-100",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>{icon}</div>
      </div>
      <div>
        <p className="text-3xl font-bold mb-1">{value}</p>
        {growth && (
          <p
            className={`text-xs flex items-center font-medium ${
              growth > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {growth > 0 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>{Math.abs(growth)}% depuis le mois dernier</span>
          </p>
        )}
      </div>
    </div>
  );
};

// Composant tableau de dossiers récents
const RecentFiles = ({ dossiers }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Dossiers récents</h3>
        <button className="text-green-600 text-sm font-medium flex items-center hover:text-green-700 transition-colors">
          Voir tous <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Âge
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sexe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dossiers.map((dossier, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {dossier.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {dossier.nom}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {dossier.age} ans
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {dossier.sexe}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      dossier.statut
                    )}`}
                  >
                    {dossier.statut}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {dossier.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Couleurs pour les statuts de dossier
const getStatusColor = (status) => {
  switch (status) {
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

// Composant de visualisation des données par statut de dossier
const StatusChart = ({ stats }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold text-lg mb-6">Répartition par statut</h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {Object.entries({
          Nouveau: { count: stats.nouveau, color: "bg-blue-500" },
          "En cours": { count: stats.enCours, color: "bg-yellow-500" },
          Incomplet: { count: stats.incomplet, color: "bg-orange-500" },
          Accepté: { count: stats.accepte, color: "bg-green-500" },
          Rejeté: { count: stats.rejete, color: "bg-red-500" },
          Clôturé: { count: stats.cloture, color: "bg-gray-500" },
        }).map(([status, { count, color }]) => (
          <div key={status} className="flex flex-col items-center">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className={`${color} h-2 rounded-full`}
                style={{
                  width: `${(count / mockData.totalDossiers) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex items-center justify-center mb-1">
              <div className={`h-3 w-3 rounded-full ${color} mr-2`}></div>
              <span className="text-xs text-gray-600">{status}</span>
            </div>
            <p className="font-semibold text-sm">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Graphique de répartition par région
const RegionChart = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold text-lg mb-6">Répartition par région</h3>
      <div className="space-y-4">
        {data.labels.map((label, index) => (
          <div key={index} className="flex items-center">
            <span className="text-sm font-medium text-gray-700 w-28">
              {label}
            </span>
            <div className="flex-1 ml-2">
              <div className="bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full"
                  style={{
                    width: `${
                      (data.values[index] / Math.max(...data.values)) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <span className="ml-4 text-sm font-medium w-8 text-right">
              {data.values[index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulation de chargement de données
    setTimeout(() => {
      setData(mockData);
      setIsLoaded(true);
    }, 500);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-500">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Tableau de bord
        </h1>
        <p className="text-gray-500">
          Vue d'ensemble des dossiers de recensement -{" "}
          {new Date().toLocaleDateString("fr-FR")}
        </p>
      </div>

      {/* Filtres et bouton nouveau dossier */}
      <div className="flex flex-wrap gap-3 mb-8 justify-between">
        <button className="bg-green-600 rounded-lg shadow-sm px-4 py-2.5 flex items-center text-sm text-white hover:bg-green-700 transition-colors">
          <Plus size={16} className="mr-2" />
          Nouveau dossier
        </button>

        <div className="flex flex-wrap gap-3">
          <button className="bg-white rounded-lg shadow-sm px-4 py-2.5 flex items-center text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={16} className="mr-2" />
            Filtres
            <ChevronDown size={16} className="ml-2" />
          </button>
          <button className="bg-white rounded-lg shadow-sm px-4 py-2.5 flex items-center text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Calendar size={16} className="mr-2" />
            Période
            <ChevronDown size={16} className="ml-2" />
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Dossiers"
          value={data.totalDossiers}
          icon={<FileText size={18} className="text-blue-500" />}
          color="blue"
          growth={8}
        />
        <StatCard
          title="Dossiers en cours"
          value={data.statsDossiers.enCours}
          icon={<Clock size={18} className="text-yellow-500" />}
          color="yellow"
          growth={15}
        />
        <StatCard
          title="Dossiers acceptés"
          value={data.statsDossiers.accepte}
          icon={<CheckCircle size={18} className="text-green-500" />}
          color="green"
          growth={5}
        />
        <StatCard
          title="Dossiers incomplets"
          value={data.statsDossiers.incomplet}
          icon={<AlertCircle size={18} className="text-orange-500" />}
          color="orange"
          growth={-3}
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <StatusChart stats={data.statsDossiers} />
        <RegionChart data={data.statParRegion} />
      </div>

      {/* Tableau de dossiers récents */}
      <div className="mb-8">
        <RecentFiles dossiers={data.recentDossiers} />
      </div>
    </main>
  );
};

export default DashboardPage;
