import InstallButton from "./components/InstallButton";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white text-center p-6">
      <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">🚀 My React + TypeScript PWA</h1>
      <p className="text-lg max-w-lg mb-6">
        Welcome to your Progressive Web App built with <span className="font-semibold">Vite + React</span>!
      </p>
      <div className="bg-white text-gray-900 rounded-2xl shadow-lg p-6 w-full max-w-md">
        <p className="text-base leading-relaxed">
          ✅ Installable on desktop & mobile.<br />📶 Works offline with caching.<br />📲 Add it to your home screen!
        </p>
      </div>
      <InstallButton />
    </div>
  );
}
