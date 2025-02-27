import { useState } from "react";
import * as XLSX from "xlsx";
import { PhotoIcon } from "@heroicons/react/24/outline";

export default function UploadExcel({
  onData,
}: {
  onData: (data: any[]) => void;
}) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      onData(jsonData); // Enviar los datos al padre
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col items-center">
      <label className="block text-sm font-medium text-gray-900">
        Subir lista de vehículos
      </label>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          <PhotoIcon
            aria-hidden="true"
            className="mx-auto size-12 text-gray-300"
          />
          <div className="mt-4 flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 hover:text-indigo-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".xlsx"
                className="sr-only"
                onChange={handleFileUpload}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          {fileName && <p className="mt-2 text-sm text-gray-500">{fileName}</p>}
        </div>
      </div>
    </div>
  );
}
