"use client";

import { useState } from "react";
import UploadExcel from "./UploadExcel";
import axios from "axios";

export default function Home() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [peritajeData, setPeritajeData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleData = (data: any[]) => {
    setVehicles(data);
  };

  const handleSelectVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setPeritajeData(null); // Resetear peritaje
  };

  const fetchPeritaje = async (placa: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api?placa=${placa}`);
      setPeritajeData(response.data);
    } catch (error) {
      setPeritajeData(null);
      console.error("Error obteniendo el peritaje:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100 flex">
      {/* Tabla de Vehículos */}
      <div className="w-2/3">
        <UploadExcel onData={handleData} />
        {vehicles.length > 0 && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Lista de Vehículos
            </h2>
            <div className="overflow-y-auto max-h-[500px] border border-gray-300 rounded-lg shadow">
              <table className="w-full border-collapse">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Placa</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Descripción
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Modelo</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Kilometraje
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Precio</th>
                    <th className="border border-gray-300 px-4 py-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">
                        {vehicle["PLACA"]}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {vehicle["DESCRIPCIÓN"]}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {vehicle["MODELO"]}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {vehicle["KILOMETRAJE"]}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {vehicle["PRECIO VENTA"]}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => handleSelectVehicle(vehicle)}
                          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Ver Peritaje
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar de Vehículo Seleccionado */}
      {selectedVehicle && (
        <div className="w-1/3 fixed right-5 top-10 bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-lg font-semibold text-gray-900">
            Vehículo Seleccionado
          </h2>
          <p>
            <strong>Placa:</strong> {selectedVehicle["PLACA"]}
          </p>
          <p>
            <strong>Descripción:</strong> {selectedVehicle["DESCRIPCIÓN"]}
          </p>
          <p>
            <strong>Modelo:</strong> {selectedVehicle["MODELO"]}
          </p>
          <p>
            <strong>Kilometraje:</strong> {selectedVehicle["KILOMETRAJE"]}
          </p>
          <p>
            <strong>Precio:</strong> {selectedVehicle["PRECIO VENTA"]}
          </p>
          <button
            className="mt-3 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
            onClick={() => fetchPeritaje(selectedVehicle["PLACA"])}
          >
            {loading ? "Cargando..." : "Obtener Peritaje"}
          </button>

          {peritajeData && (
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <h3 className="text-md font-semibold">Peritaje</h3>
              <p>
                <strong>Kilometraje:</strong> {peritajeData.kilometraje}
              </p>
              <p>
                <strong>Color:</strong> {peritajeData.color}
              </p>
              <p>
                <strong>Latonería:</strong> {peritajeData.estado.latoneria}
              </p>
              <p>
                <strong>Pintura:</strong> {peritajeData.estado.pintura}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
