import Logo from "../assets/logo-nav.svg";
import CatGithub from "../assets/cat-github.svg";
import BackWorld from "../assets/background-home.svg";
import Cross from "../assets/cross.svg";
import GoIcon from "../assets/go-icon.svg";
import { Icon } from '@iconify/react';
import { useState } from 'react';

export default function HomePage() {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const allUniversities: string[] = [
    "king mongkut's institute of technology ladkrabang",
    "king mongkut's university of technology north bangkok",
    "king mongkut's university of technology thonburi",
    "king mongkut's university of technology thonburi",
    "king mongkut's university of technology thonburi",
    "king mongkut's university of technology thonburi",
  ];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      setSuggestions(
        allUniversities.filter((u) =>
          u.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };


  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
  };

  function highlightText(text: string, query: string) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-pink-100 ">
          {part}
        </span>
      ) : (
        part
      )
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 flex flex-col overflow-y-auto ">
      <img
        src={BackWorld}
        alt="background"
        className="absolute bottom-0 object-cover z-0 "
      />
      {/* Navbar */}
      <nav className="flex justify-between items-center px-20 py-10 z-10">
        <div className="flex items-center space-x-2">
          <img className="h-10 w-10" src={Logo} alt="universities search" />
          <span className="font-bold text-purple-100 text-2xl">
            Universities<span className="text-pink-100 ">Search</span>
          </span>
        </div>
        <button className=" flex gap-2 justify-center items-center bg-purple-100 text-white px-5 py-2 rounded-full hover:bg-purple-200 transition">
          <img className="h-6 w-6" src={CatGithub} alt="" />
          GitHub
        </button>
      </nav>

      {/* Main Section */}
      <div className="flex flex-col items-center justify-center text-center z-10  p-8 ">
        <h1 className="text-3xl md:text-5xl font-extrabold text-purple-100 mb-4 ">
          Discover <span className="text-pink-100">Universities</span> Around the World
        </h1>
        <p className="text-2xl md:text-4xl font-semibold text-purple-200 mb-6">
          Search by university name or <br></br> explore universities by country
        </p>

        {/* Tags */}
        <div className="flex space-x-4 mb-6">
          <span className=" inline-block rounded-full p-[2px] bg-gradient-to-r from-white to-purple-50">
            <span className="block px-3 py-1 rounded-full bg-white text-purple-100 text-sm">
              Smart Search
            </span>
          </span>

          <span className="inline-block rounded-full p-[2px] bg-gradient-to-r from-white to-purple-50">
            <span className="block px-3 py-1 rounded-full bg-white text-purple-700 text-sm">
              Accurate Data
            </span>
          </span>

          <span className="inline-block rounded-full p-[2px] bg-gradient-to-r from-white to-purple-50">
            <span className="block px-3 py-1 rounded-full bg-white text-purple-700 text-sm">
              University Profiles
            </span>
          </span>
        </div>

        {/* Search Section */}
        <div className="w-[55%] bg-white pl-6 pr-3 py-3  gap-3 rounded-full border-3 border-purple-50 
              text-purple-100 text-opacity-70 font-semibold text-sm  focus-within:border-purple-100 flex md:text-xl">
          <input
            type="text"
            placeholder="Enter university name or country..."
            value={query}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 100)}
            className="bg-white w-full focus:outline-none focus:placeholder-transparent "
          />

          {/* ปุ่ม Clear */}
          {query && (
            <button
              onClick={handleClear}
              className=" text-gray-400 hover:text-gray-600"
            >
              <img src={Cross} alt="" className="h-8 w-8 cursor-pointer" />
            </button>
          )}

          <button
            disabled={query === ""}
            onClick={query ? handleClear : undefined}
            className={`flex items-center px-4 py-2 rounded-full
            ${query !== ""
                ? "bg-purple-100 text-white cursor-pointer"
                : "bg-purple-50 text-white "
              }`}
          >
            {!focused && query === "" ? (
              <Icon icon="heroicons:magnifying-glass-16-solid" className="w-6 h-6" />
            ) : (
              "Search"
            )}
          </button>
        </div>

        {/* Dropdown cut */}
        {focused && suggestions.length > 0 && (
          <div className=" w-[55%] mt-2  relative">
            <ul
              className="absolute w-full max-h-[calc(100vh-4rem)]
                 bg-white rounded-3xl border-3 border-purple-100 shadow-lg z-20
                 "
            >
              {suggestions.slice(0, 4).map((s, idx) => (
                <li
                  key={idx}
                  onClick={() => { setQuery(s); setSuggestions([]); }}
                  className="flex items-center text-purple-100 px-4 py-3 hover:text-pink-100 
                     transition-colors duration-200 cursor-pointer text-left gap-4"
                >
                  <Icon icon="heroicons:magnifying-glass-16-solid"
                    className="w-8 h-8 text-purple-300 flex-shrink-0" />
                  <span className="font-semibold text-normal">{highlightText(s, query)}</span>
                  <img src={GoIcon} alt="" className="h-8 w-8 ml-auto flex-shrink-0" />
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}

