// frontend/src/App.jsx
import { useState } from "react";
import BusesPage from "./pages/buses/BusesPage";
import LineasPage from "./pages/lineas/LineasPage";
import EstacionesPage from "./pages/estaciones/EstacionesPage";

function App() {
  const [currentPage, setCurrentPage] = useState("buses");

  return (
    <div className="App">
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex space-x-4">
          <button
            onClick={() => setCurrentPage("buses")}
            className={`px-4 py-2 rounded transition ${
              currentPage === "buses"
                ? "bg-white text-blue-600 font-semibold"
                : "hover:bg-blue-700"
            }`}
          >
            Buses
          </button>
          <button
            onClick={() => setCurrentPage("lineas")}
            className={`px-4 py-2 rounded transition ${
              currentPage === "lineas"
                ? "bg-white text-blue-600 font-semibold"
                : "hover:bg-blue-700"
            }`}
          >
            Lineas
          </button>
          <button
            onClick={() => setCurrentPage("estaciones")}
            className={`px-4 py-2 rounded transition ${
              currentPage === "estaciones"
                ? "bg-white text-blue-600 font-semibold"
                : "hover:bg-blue-700"
            }`}
          >
            Estaciones
          </button>
        </div>
      </nav>

      {currentPage === "buses" && <BusesPage />}
      {currentPage === "lineas" && <LineasPage />}
      {currentPage === "estaciones" && <EstacionesPage />}
    </div>
  );
}

export default App;
