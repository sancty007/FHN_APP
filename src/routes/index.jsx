import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import Layout from "../components/dashboard/Layout";
import DossiersPage from "../pages/DossiersPage";
import UtilisateursPage from "../pages/UtilisateursPage";
import ErrorPage from "../pages/ErrorPage"; // Importez votre page d'erreur personnalisée
import TuteurPage from "../pages/TuteurPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />, // Page d'erreur pour cette route
  },
  {
    path: "tuteur",
    element: <TuteurPage />,
  },
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />, // Page d'erreur pour ce groupe de routes
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "dossiers",
        element: <DossiersPage />,
      },
      {
        path: "utilisateurs",
        element: <UtilisateursPage />,
      },
    ],
  },
]);

export default router;
