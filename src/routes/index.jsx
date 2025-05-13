import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layouts/MainLayout";

import HomePage from "../pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);

export default router;
