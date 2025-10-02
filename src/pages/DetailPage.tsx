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
  const { university } = useParams<{ university: string }>();
  const [universityDetail, setUniversityDetail] = useState<UniversityDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); 
  let logoUrl: string | undefined;

  useEffect(() => {
    const fetchUniversityDetail = async () => {
      try {
        setLoading(true);
        setError(null); 

        // ดึงข้อมูลมหาวิทยาลัยจาก backend
        const res = await axios.post(
          "https://uni-regex.nmasang.member.ce-nacl.com/crawl/university",
          null,
          {
            params: {
              path: `https://en.wikipedia.org/wiki/${university}`,
            },
          }
        );

        const data = res.data;

        // ดึงโลโก้จาก backend
        try {
          const logoRes = await axios.get("https://uni-regex.nmasang.member.ce-nacl.com/logo", {
            params: { name: university },
          });
          logoUrl = "https://uni-regex.nmasang.member.ce-nacl.com" + logoRes.data.logo_url;
        } catch (logoErr) {
          console.warn("ไม่พบโลโก้สำหรับ:", university);
          logoUrl = undefined;
        }

        setUniversityDetail({
          name: (university ?? "Unknown University").replace(/_/g, " "),
          abbreviation: data.abbr ?? "N/A",
          location: data.location ?? "N/A",
          president: data.president ?? "N/A",
          established: data.estab ?? "N/A",
          website: data.website ?? "N/A",
          campus: data.campuses ?? [],
          faculties: data.faculties?.filter((f: string) => f.trim() !== "") ?? [],
          logo_url: logoUrl,
        });
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถดึงข้อมูลได้"); 
      } finally {
        setLoading(false);
      }
    };

    if (university) {
      fetchUniversityDetail();
    }
  }, [university]);

  console.log(universityDetail)

  return (
    <div className="h-screen bg-gradient-to-b from-white to-pink-50 flex flex-col overflow-y-auto scrollbar-custom pt-20 relative">
      <img src={BackWorld} alt="background" className="absolute bottom-0 object-cover z-0" />

      <div className="flex flex-col items-center justify-center text-center z-10 px-20 p-4">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex gap-3 items-center">
            <button
              className="p-2 rounded-full bg-pink-50 transition cursor-pointer"
              onClick={() => navigate("/home")}
            >
              <Icon icon="mdi:arrow-left" className="text-purple-100" width={24} />
            </button>
            <span className="text-3xl text-purple-100">
              <h1 className="font-bold">{university?.replace(/_/g, " ")}</h1>
            </span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Icon icon="mdi:loading" className="animate-spin text-purple-100" width={40} />
            <span className="ml-3 text-purple-100">Loading...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center justify-center py-8 text-purple-100 text-lg">
            {error}
          </div>
        )}

        {!loading && !error && universityDetail && (
          <>
            {/* detail */}
            <div className="w-full flex flex-col md:flex-row gap-6 items-center md:items-stretch mb-4">
              
              {/* {universityDetail?.logo_url &&( */}
                <div className="flex-shrink-0 h-full">
                  {universityDetail?.logo_url ? (
                    <img
                      src={universityDetail.logo_url}
                      alt={`${universityDetail?.name} logo`}
                      className="w-[250px] h-[250px] object-contain rounded-3xl border-2 border-pink-50 bg-white p-2"
                    />
                  ) : (
                    <div className="w-[250px] h-[250px] flex items-center justify-center rounded-3xl border-2 border-pink-50 bg-white">
                      No Logo
                    </div>
                  )}
                </div>
              {/* )} */}

              <div className="w-full flex flex-col justify-between text-left rounded-3xl border-2 border-pink-50 bg-white p-5 space-y-2 h-full">
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
            {universityDetail?.campus.length != 0 && (
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
            )}
            

            {/* Faculties Table */}
            {universityDetail?.faculties.length != 0 && (
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
            )}

          </>
        )}
      </div>
    </div>
  );
}
