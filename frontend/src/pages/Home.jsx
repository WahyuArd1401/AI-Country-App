import { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CONTINENTS_AND_COUNTRIES } from "../utils/getData";
import ContinentDropdown from "../components/Dropdown";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Pagination from "@mui/material/Pagination";

const Home = () => {
  const { loading, error, data } = useQuery(GET_CONTINENTS_AND_COUNTRIES);
  const [selectedContinent, setSelectedContinent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth <= 768 ? 6 : 9);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth <= 768 ? 6 : 9);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const continents = data.continents;
  const allCountries = continents.flatMap((continent) =>
    continent.countries.map((country) => ({ ...country, continentName: continent.name }))
  );
  const filteredCountries = selectedContinent
    ? continents.find((continent) => continent.code === selectedContinent)?.countries.map((country) => ({ ...country, continentName: continents.find((c) => c.code === selectedContinent)?.name })) || []
    : allCountries;

  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  const displayedCountries = filteredCountries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      return alert("Please enter a question.");
    }

    setLoadingAI(true);
    setChatHistory((prev) => [...prev, { question, response: "Menunggu hasil..." }]);
    setQuestion("");

    try {
      const prompt = `About ${selectedCountry?.name || "this country"}: ${question}`;
      const res = await axios.post("http://localhost:5000/chat", { message: prompt });
      const aiResponse = res.data.response;
      setChatHistory((prev) => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1].response = aiResponse;
        return updatedHistory;
      });
    } catch (error) {
      console.error("Error fetching response:", error);
      setChatHistory((prev) => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1].response = "Terjadi kesalahan. Coba lagi.";
        return updatedHistory;
      });
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-2">
        <h1 className="text-3xl font-bold text-center mb-6">🌍 Select a Continent</h1>

        <div className="mb-6 flex justify-center w-1/3 mx-auto">
          <ContinentDropdown selectedContinent={selectedContinent} setSelectedContinent={setSelectedContinent} />
        </div>

        <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4">
          {selectedContinent 
            ? `Countries in ${continents.find((c) => c.code === selectedContinent)?.name}`
            : "All Countries"}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayedCountries.map((country) => (
            <div
              key={country.code}
              onClick={() => handleCountryClick(country)}
              className="border p-4 rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
            >
              <h1 className="text-4xl text-center font-bold">{country.emoji}</h1>
              <h1 className="text-lg text-center">{country.name}</h1>
              <p><strong>Currency:</strong> {country.currency || "N/A"}</p>
              <p><strong>Languages:</strong> {country.languages.length > 0 
                ? country.languages.length > 2 ? `${country.languages.slice(0, 2).map(lang => lang.name).join(", ")}...` : country.languages.map(lang => lang.name).join(", ") 
                : "N/A"}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      </div>

      <div className="p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-bold mb-4">Country Details</h2>
        {selectedCountry ? (
          <>
            <h1 className="text-4xl mb-2">{selectedCountry.emoji}</h1>
            <p><strong>Name:     </strong> {selectedCountry.name}</p>
            <p><strong>Capital:  </strong> {selectedCountry.capital || "N/A"}</p>
            <p><strong>Currency: </strong> {selectedCountry.currency || "N/A"}</p>
            <p><strong>Native Name:</strong> {selectedCountry.native || "N/A"}</p>
            <p><strong>Languages:   </strong> {selectedCountry.languages.length > 0 
              ? selectedCountry.languages.length > 2
                ? `${selectedCountry.languages.slice(0, 2).map(lang => lang.name).join(", ")}...`
                : selectedCountry.languages.map(lang => lang.name).join(", ")
              : "N/A"}
            </p>
            <p><strong>Continent:</strong> {selectedCountry.continentName || "N/A"}</p>

            <div className="mt-8">
              <form onSubmit={handleAskAI} className="flex flex-col items-center">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="border p-2 w-full max-w-lg mb-2"
                  placeholder="Ask something about this country..."
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={loadingAI}
                >
                  {loadingAI ? "Sending..." : "Send"}
                </button>
              </form>
              <div
                ref={chatContainerRef}
                className="mt-4 bg-gray-100 p-3 rounded h-64 overflow-y-auto"
              >
                {chatHistory.map((chat, index) => (
                  <div key={index} className="mb-4">
                    <p><strong>You:</strong> {chat.question}</p>
                    <ReactMarkdown className="bg-white p-2 rounded shadow-sm mt-1">{chat.response}</ReactMarkdown>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p>Select a country to view details.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
