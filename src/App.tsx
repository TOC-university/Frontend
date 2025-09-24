import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import HomePage from "./pages/HomePage";
import Logo from "./assets/logo-nav.svg";
import CatGithub from "./assets/cat-github.svg";
import ResultTable from "./pages/ResultTable"

export default function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col ">
        {/* Navbar */}
        <nav className="flex justify-between items-center px-20 py-5 fixed bg-white/80 backdrop-blur-md z-50 opacity-99 w-full">
          <div className="flex items-center space-x-2">
            <img className="h-10 w-10" src={Logo} alt="universities search" />
            <span className="font-bold text-purple-100 text-2xl">
              Universities<span className="text-pink-100">Search</span>
            </span>
          </div>
          <a
            href="https://github.com/TOC-university"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-2 justify-center items-center bg-purple-100 text-white px-5 py-2 rounded-full hover:bg-purple-200 transition"
          >
            <img className="h-6 w-6" src={CatGithub} alt="GitHub" />
            GitHub
          </a>
        </nav>

        {/* Routes */}
        <div className="flex-1 ">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/ResultTable" element={<ResultTable />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}