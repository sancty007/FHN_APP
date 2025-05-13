import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Plateforme FHN – Recensement et Suivi des Enfants</h1>
        <nav>{/* Ajouter des liens de navigation ici plus tard */}</nav>
      </header>

      <main className="app-main">
        <Outlet /> {/* C'est ici que le contenu de la page sera rendu */}
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Plateforme FHN</p>
      </footer>
    </div>
  );
};

export default MainLayout;
