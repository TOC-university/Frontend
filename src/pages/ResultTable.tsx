import Logo from "../assets/logo-nav.svg";
import CatGithub from "../assets/cat-github.svg";
import BackWorld from "../assets/background-home.svg";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ResultTable() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState(null);

    // รับค่า search
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const search = params.get("search");
        if (search) setSearchInput(search);
    }, [location.search]);

    const allUniversities: { name: string; abbreviation: string; country: string }[] = [
        { name: "King Mongkut's Institute of Technology Ladkrabang", abbreviation: "KMITL", country: "Thailand" },
        { name: "King Mongkut's University of Technology North Bangkok", abbreviation: "KMUTNB", country: "Thailand" },
        { name: "King Mongkut's University of Technology Thonburi", abbreviation: "KMUTT", country: "Thailand" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 flex flex-col overflow-y-auto relative">
        <img src={BackWorld} alt="background" className="absolute bottom-0 object-cover z-0" />

        {/* Navbar */}
        <nav className="flex justify-between items-center px-20 py-10 z-10">
            <div className="flex items-center space-x-2">
            <img className="h-10 w-10" src={Logo} alt="universities search" />
            <span className="font-bold text-purple-100 text-2xl">
                Universities<span className="text-pink-100">Search</span>
            </span>
            </div>
            <button className="flex gap-2 justify-center items-center bg-purple-100 text-white px-5 py-2 rounded-full hover:bg-purple-200 transition">
            <img className="h-6 w-6" src={CatGithub} alt="" />
            GitHub
            </button>
        </nav>

        {/* Main Section */}
        <div className="flex flex-col items-center justify-center text-center z-10 px-20 p-4">
            <div className="w-full flex items-center justify-between mb-4">
                <div className="flex gap-3 items-center ">
                    <button className="p-2 rounded-full bg-pink-50 transition cursor-pointer" onClick={() => navigate("/home")}>
                        <Icon icon="mdi:arrow-left" className="text-purple-100" width={24} />
                    </button>
                    <span className="text-xl  text-purple-100">
                        Result : <span className="font-bold">{searchInput}</span>
                    </span>
                </div>
                <button className="flex items-center gap-2 px-5 py-2 border-2 border-purple-100 rounded-full text-purple-100  transition">
                    <Icon icon="mdi:file-download-outline" width={20} />
                    Get CSV
                </button>
            </div>

            {/* Table */}
            <div className="w-full rounded-3xl overflow-hidden border-2 border-pink-50">
            <table className="w-full text-left">
                <thead className="bg-pink-50 ">
                <tr>
                    <th className="px-6 py-4">University Name</th>
                    <th className="px-6 py-4">Abbreviation</th>
                    <th className="px-6 py-4">Country</th>
                    <th className="px-6 py-4 ">More Detail</th>
                </tr>
                </thead>
                <tbody className="bg-white">
                {allUniversities.map((uni, index) => (
                    <tr key={index} className="border-t-1 border-pink-50 ">
                    <td className="px-6 py-2">{uni.name}</td>
                    <td className="px-6 py-2">{uni.abbreviation}</td>
                    <td className="px-6 py-2">{uni.country} ↗</td>
                    <td className="px-6 py-2 ">
                        <button className="flex items-center gap-2 px-5 py-2 border-2 border-purple-100 rounded-full text-purple-100 hover:bg-purple-100 hover:text-white transition cursor-pointer">
                        Detail <Icon icon="mdi:arrow-right" width={18} />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            
        </div>
        </div>
    );
}
