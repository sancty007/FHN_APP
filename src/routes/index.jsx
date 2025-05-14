// src/routes/index.js
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import Layout from "../components/dashboard/Layout";
import DossiersPage from "../pages/DossiersPage";
import UtilisateursPage from "../pages/UtilisateursPage";
import ErrorPage from "../pages/ErrorPage";
import TuteurPage from "../pages/TuteurPage";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "tuteur",
    element: (
      <ProtectedRoute>
        <TuteurPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "dossiers",
        element: (
          <ProtectedRoute>
            <DossiersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "utilisateurs",
        element: (
          <ProtectedRoute>
            <UtilisateursPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
