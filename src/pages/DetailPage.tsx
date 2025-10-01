import BackWorld from "../assets/background-home.svg";
import { Icon } from "@iconify/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

type UniversityDetailType = {
  name: string;
  abbreviation: string;
  location: string;
  president: string;
  established: string;
  website: string;
  campus: string[];
  faculties: string[];
  logo_url?: string;
};

export default function DetailPage() {
  const navigate = useNavigate();
  // /detail/[university]
  const { university } = useParams<{ university: string }>();
  const [universityDetail, setUniversityDetail] = useState<UniversityDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUniversityDetail = async () => {
      try {
        setLoading(true);

        // ดึงข้อมูลมหาวิทยาลัยจาก backend
        const res = await axios.post(
          "http://0.0.0.0:8000/crawl/university", //เเก้ domain
          null,
          {
            params: {
              path: `https://en.wikipedia.org/wiki/${university}`,
            },
          }
        );

        const data = res.data;

        // ดึงโลโก้จาก backend
        const logoRes = await axios.get("http://0.0.0.0:8000/logo", { //เเก้ domain
          params: { name: university },
        });

        // set ค่าให้ state
        setUniversityDetail({
          name: university ?? "Unknown University",
          abbreviation: data.abbr,
          location: "N/A",
          president: "N/A",
          established: data.estab,
          website: data.website,
          campus: data.campuses,
          faculties: data.faculties.filter((f: string) => f.trim() !== ""),
          logo_url: "http://0.0.0.0:8000" + logoRes.data.logo_url, //เเก้ domain
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (university) {
      fetchUniversityDetail();
    }
  }, [university]);

  return (
    <div className="h-screen bg-gradient-to-b from-white to-pink-50 flex flex-col overflow-y-auto scrollbar-custom pt-20 relative">
      <img src={BackWorld} alt="background" className="absolute bottom-0 object-cover z-0" />

      {/* Main Section */}
      <div className="flex flex-col items-center justify-center text-center z-10 px-20 p-4">
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex gap-3 items-center">
            <button
              className="p-2 rounded-full bg-pink-50 transition cursor-pointer"
              onClick={() => navigate("/home")}
            >
              <Icon icon="mdi:arrow-left" className="text-purple-100" width={24} />
            </button>
            <span className="text-3xl text-purple-100">
              <h1 className="font-bold">{universityDetail?.name ?? "Unknown University"}</h1>
            </span>
          </div>
          <button className="flex items-center gap-2 px-5 py-2 border-2 border-purple-100 rounded-full text-purple-100 hover:shadow-[0_0_10px_#a855f7] transition cursor-pointer">
            <Icon icon="mdi:file-download-outline" width={20} />
            Get CSV
          </button>
        </div>

        {/* ถ้า loading แสดง spinner */}
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
            {/* detail */}
            <div className="w-full flex flex-col md:flex-row gap-6 items-center md:items-start mb-4">
              <div className="flex-shrink-0">
                <img
                  src={universityDetail?.logo_url}
                  alt={`${universityDetail?.name} logo`}
                  className="w-[250px] h-[250px] object-contain rounded-3xl border-2 border-pink-50 bg-white p-2"
                />
              </div>

              {/* Info */}
              <div className="w-full flex flex-col justify-between text-left rounded-3xl border-2 border-pink-50 bg-white p-5 space-y-2">
                <p className="text-purple-100 text-xl">
                  <span className="text-black me-4">Name :</span> {universityDetail?.name}
                </p>
                <p className="text-purple-100 text-xl">
                  <span className="text-black me-4">Abbreviation :</span> {universityDetail?.abbreviation}
                </p>
                <p className="text-purple-100 text-xl">
                  <span className="text-black me-4">Location :</span> {universityDetail?.location}
                </p>
                <p className="text-purple-100 text-xl">
                  <span className="text-black me-4">President :</span> {universityDetail?.president}
                </p>
                <p className="text-purple-100 text-xl">
                  <span className="text-black me-4">Established :</span> {universityDetail?.established}
                </p>
                <p className="text-purple-100 text-xl">
                  <span className="text-black me-4">Website :</span>{" "}
                  <a href={universityDetail?.website} target="_blank" className="hover:text-purple-100">
                    {universityDetail?.website} ↗
                  </a>
                </p>
              </div>
            </div>

            {/* Campuses Table */}
            <div className="w-full rounded-3xl overflow-hidden border-2 border-pink-50 mb-4">
              <table className="w-full text-left">
                <thead className="bg-pink-50">
                  <tr>
                    <th className="px-6 py-4 ">Campuses</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {universityDetail?.campus.map((campus, idx) => (
                    <tr key={idx} className="border-t-1 border-pink-50">
                      <td className="px-6 py-4 ">{campus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Faculties Table */}
            <div className="w-full rounded-3xl overflow-hidden border-2 border-pink-50 mb-4">
              <table className="w-full text-left">
                <thead className="bg-pink-50">
                  <tr>
                    <th className="px-6 py-4 ">Faculties</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {universityDetail?.faculties.map((faculty, idx) => (
                    <tr key={idx} className="border-t-1 border-pink-50">
                      <td className="px-6 py-4 ">{faculty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
