import BackWorld from "../assets/background-home.svg";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";


type University = {
  name: string;
  abbreviation: string;
  country: string;
  path?: string;
};

export default function ResultTable() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState<string | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(100);
  const [total, setTotal] = useState<number | null>(null);
  const [cachedPages, setCachedPages] = useState<Record<number, University[]>>({});




  const fetchSuggest = async (query: string) => {
  try {
    setLoading(true);
    const res = await fetch("https://uni-regex.nmasang.member.ce-nacl.com/search/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: query,
        countries: [],
      }),
    });

    const data = await res.json();
    if (data.suggestions) {
      setUniversities(
        data.suggestions.map((s: any) => ({
          name: s.name,
          abbreviation: s.abbreviation || "",
          country: s.country || "",
          path: s.path || "",
        }))
      );
    } else {
      console.warn("No suggestions returned", data);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const fetchUniversitiesByCountry = async (country: string) => {
    try {
      setLoading(true);
      const res = await fetch("https://uni-regex.nmasang.member.ce-nacl.com/crawl/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countries: [country] }),
      });

      const data = await res.json();
      if (data.universities) {
        setUniversities(data.universities);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const handleDownloadCSV = async () => {
  if (!searchInput) return alert("ไม่พบคำค้นหา");

  try {
    setDownloading(true);
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    const country = params.get("country");

    // ✅ กรณี All เหมือนเดิม
    if (search === "All") {
      if (!universities.length) return alert("ไม่มีข้อมูลในหน้านี้");

      const headers = ["Name", "Abbreviation", "Country", "Path"];
      const csvRows = [headers.join(",")];

      universities.forEach((uni) => {
        const row = [
          `"${uni.name || ""}"`,
          `"${uni.abbreviation || ""}"`,
          `"${uni.country || ""}"`,
          `"${uni.path || ""}"`,
        ].join(",");
        csvRows.push(row);
      });

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = `universities_page_${page}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      return;
    }

    // ✅ กรณี search (แก้ใหม่ให้รองรับ StreamingResponse)
    let url = "";
    if (search) {
      url = `https://uni-regex.nmasang.member.ce-nacl.com/export/search?q=${encodeURIComponent(search)}`;
    } else if (country) {
      url = `https://uni-regex.nmasang.member.ce-nacl.com/crawl/universities`;
    }

    // 👇 ใช้ streaming reader อ่าน chunk ทีละส่วน
    const res = await fetch(url);
    if (!res.ok) throw new Error("Download failed");

    const reader = res.body?.getReader();
    if (!reader) throw new Error("Streaming not supported");

    let chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    // รวม chunk ทั้งหมดเป็น blob CSV
    const blob = new Blob(chunks, { type: "text/csv;charset=utf-8;" });
    const href = URL.createObjectURL(blob);

    // ดาวน์โหลดไฟล์
    const link = document.createElement("a");
    link.href = href;
    link.download = `${searchInput}_results.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);

  } catch (err) {
    console.error("Download CSV Error:", err);
    alert("ดาวน์โหลดไฟล์ไม่สำเร็จ");
  } finally {
    setDownloading(false);
  }
};

const fetchAllUniversities = async (page: number) => {
  if (cachedPages[page]) {
    setUniversities(cachedPages[page]);
    return;
  }

  try {
    setLoading(true);
    const res = await fetch(
      `https://uni-regex.nmasang.member.ce-nacl.com/export/all_universities_pagination?page=${page}&page_size=${pageSize}`
    );

    if (!res.ok) throw new Error("Failed to fetch universities");
    const text = await res.text();

    // ✅ ใช้ PapaParse เพื่ออ่าน CSV อย่างถูกต้อง
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });

    // ✅ แปลง key ให้เป็นตัวพิมพ์เล็ก เพื่อให้ตรงกับ type University
    const data = parsed.data.map((row: any) => ({
      name: row["Name"] || row["name"] || "",
      abbreviation: row["Abbreviation"] || row["abbreviation"] || "",
      country: row["Country"] || row["country"] || "",
      path: row["Path"] || row["path"] || "",
    })) as University[];

    console.log("✅ Parsed universities:", data.slice(0, 5)); // ดูตัวอย่าง 5 แถว

    setCachedPages((prev) => ({ ...prev, [page]: data }));
    setUniversities(data);
    setTotal(data.length);
  } catch (err) {
    console.error("❌ Error fetching all universities:", err);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  const params = new URLSearchParams(location.search);
  const search = params.get("search");
  const country = params.get("country");

  // ✅ ถ้ามี country ใน URL → ให้ค้นหาตามประเทศเท่านั้น
  if (country) {
    setSearchInput(country);
    fetchUniversitiesByCountry(country);
    console.log('country')
    return; // จบตรงนี้ ไม่ให้ไปต่อ
  }

  // ✅ ถ้า search = "All"
  if (search === "All") {
    setSearchInput("All Universities");
    fetchAllUniversities(page);
    console.log('All')
    return;
  }

  // ✅ ถ้ามี search ปกติ
  if (search) {
    setSearchInput(search);
    fetchSuggest(search);
    console.log('search ปกติ')
    return;
  }
}, [location.search, page]);


  const params = new URLSearchParams(location.search);
  const country = params.get("country");



  return (
    <div className="h-screen bg-gradient-to-b from-white to-pink-50 flex flex-col overflow-y-auto scrollbar-custom pt-20 relative">
      <img
        src={BackWorld}
        alt="background"
        className="absolute bottom-0 object-cover z-0"
      />

      {/* Main Section */}
      <div className="flex flex-col items-center justify-center text-center z-10 px-20 p-4">
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex gap-3 items-center ">
            <button
              className="p-2 rounded-full bg-pink-50 transition cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Icon icon="mdi:arrow-left" className="text-purple-100" width={24} />
            </button>
            <span className="text-xl text-purple-100">
              Result : <span className="font-bold">{searchInput}</span>
            </span>
          </div>

          {/* ✅ ปุ่มดาวน์โหลด CSV — แสดงเฉพาะตอนที่ไม่มี country */}
          {!country && (
            <button
              onClick={handleDownloadCSV}
              disabled={downloading}
              className={`flex items-center gap-2 px-5 py-2 border-2 border-purple-100 rounded-full text-purple-100 transition cursor-pointer ${
                downloading ? "opacity-60 cursor-not-allowed" : "hover:shadow-[0_0_10px_#a855f7]"
              }`}
            >
              {downloading ? (
                <>
                  <Icon icon="mdi:loading" width={20} className="animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Icon icon="mdi:file-download-outline" width={20} />
                  Get CSV
                </>
              )}
            </button>
          )}
        </div>

        {/* Table */}
        <div className="w-full rounded-3xl overflow-hidden border-2 border-pink-50 flex items-center justify-center">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Icon
                icon="mdi:loading"
                className="animate-spin text-purple-100"
                width={40}
              />
              <span className="ml-3 text-purple-100">Loading...</span>
            </div>
          ) : (
            <>
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
                {universities.length > 0 ? (
                  universities.map((uni, index) => (
                    <tr key={index} className="border-t-1 border-pink-50 ">
                      <td className="px-6 py-2">{uni.name}</td>
                      <td className="px-6 py-2">{uni.abbreviation}</td>
                      <td
                        className="px-6 py-2 cursor-pointer"
                        onClick={() => navigate(`/ResultTable?country=${uni.country}`)}
                      >
                        {uni.country} ↗
                      </td>
                      <td className="px-6 py-2 ">
                        <button
                          onClick={() =>
                            navigate(`/detail/${uni.path?.replace(/^\/wiki\//, "")}`)
                          }
                          className="flex items-center gap-2 px-5 py-2 border-2 border-purple-100 rounded-full text-purple-100 hover:bg-purple-100 hover:text-white transition cursor-pointer"
                        >
                          Detail <Icon icon="mdi:arrow-right" width={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </>
          )}
        </div>
        {searchInput === "All Universities" && (
          <div className="flex justify-center items-center mt-6 gap-3 text-purple-100">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1 || loading}
              className={`px-4 py-2 border-2 border-purple-100 rounded-full ${
                page === 1 || loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-purple-100 hover:text-white"
              }`}
            >
              Prev
            </button>
            <span className="text-lg font-semibold">
              Page {page} {loading && "(Loading...)"}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
              className={`px-4 py-2 border-2 border-purple-100 rounded-full ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-purple-100 hover:text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}