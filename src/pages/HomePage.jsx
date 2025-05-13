const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h2>Bienvenue sur la Plateforme FHN</h2>
        <p>Recensement et Suivi des Enfants</p>
      </div>

      <div className="actions-container">
        <div className="action-card">
          <h3>Soumettre un dossier</h3>
          <p>Parents et tuteurs, soumettez un nouveau dossier d'enfant</p>
          <button className="btn primary">Commencer</button>
        </div>

        <div className="action-card">
          <h3>Connexion</h3>
          <p>Personnel interne, connectez-vous pour accéder aux dossiers</p>
          <button className="btn secondary">Se connecter</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
