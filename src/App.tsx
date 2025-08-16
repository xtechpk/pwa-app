import "./App.css";
import InstallButton from "./components/InstallButton";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-3 tracking-tight">
          🚀 My React + TypeScript PWA
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome to your Progressive Web App built with <span className="font-semibold">Vite + React!</span>
        </p>

        <div className="mt-6 bg-blue-50 rounded-xl p-4 text-gray-700 text-sm leading-relaxed shadow-inner">
          <p>✅ This app can now be installed on desktop & mobile.</p>
          <p>📶 Works offline with caching.</p>
          <p>📲 Try adding it to your home screen!</p>
        </div>

        <div className="mt-6 flex justify-center">
          {/* Install button */}
          <InstallButton />
        </div>
      </div>
    </div>
  );
}

export default App;
