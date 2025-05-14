import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
      <div className="max-w-xl w-full px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-md">
            <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-green-500 bg-clip-text text-transparent">
              FHN
            </span>
          </div>
        </div>

        <Outlet />

        <div className="text-center text-gray-400 text-sm mt-12">
          <p>© 2025 Fondation Horizons Nouveaux</p>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
