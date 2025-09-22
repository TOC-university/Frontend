import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Main from "./pages/Main";
import HomePage from "./pages/HomePage";
import ResultTable from "./pages/ResultTable";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* <nav className="flex gap-4 p-4 bg-gray-800 text-white">
          <Link className="text-green-400 hover:text-green-200" to="/">Home</Link>
          <Link className="text-green-400 hover:text-green-200" to="/about">About</Link>
        </nav> */}

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/ResultTable" element={<ResultTable />} />
        </Routes>
      </div>
    </Router>
  );
}

