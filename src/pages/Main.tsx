import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";

export default function Main() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="flex gap-6 mb-8">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} alt="Vite logo" className="h-20 w-20 animate-bounce" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} alt="React logo" className="h-20 w-20 animate-spin-slow" />
        </a>
      </div>

      <h1 className="text-5xl font-bold text-green-300 mb-8">
        Vite + React + Tailwind
      </h1>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center gap-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors"
          onClick={() => setCount((c) => c + 1)}
        >
          Count: {count}
        </button>
        <p className="text-gray-300 text-center">
          Edit <code>src/pages/Main.tsx</code> and save to test HMR
        </p>
      </div>

      <p className="mt-6 text-gray-400">
        Click the button to increase the counter
      </p>
    </div>
  );
}
