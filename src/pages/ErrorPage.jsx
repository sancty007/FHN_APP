import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oups!</h1>
        <p className="mb-4 text-gray-600">Désolé, une erreur est survenue.</p>
        <p className="text-gray-800 font-medium">
          <i>{error.statusText || error.message}</i>
        </p>
        <div className="mt-6">
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
        <div className="mt-6">
          <a
            href="/"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}
