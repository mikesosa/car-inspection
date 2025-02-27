import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs"; // Ensure compatibility with Node.js
import "pdfjs-dist/build/pdf.worker.mjs"; // Ensures the worker is loaded correctly

// Disable worker (it's not needed in a server environment)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placa = searchParams.get("placa");

  if (!placa) {
    return NextResponse.json({ error: "Placa inválida" }, { status: 400 });
  }

  const pdfUrl = `https://www.usadosrentingcolombia.com/file/thirdparty/usados/peritaje/${placa}.pdf`;

  try {
    const response = await axios.get(pdfUrl, { responseType: "arraybuffer" });
    const pdfBuffer = new Uint8Array(response.data);

    // 2. Load the PDF with pdfjs-dist
    const loadingTask = pdfjs.getDocument({ data: pdfBuffer });
    const pdf = await loadingTask.promise;

    let extractedText = "";
    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const textContent = await page.getTextContent();
      extractedText +=
        textContent.items.map((item: any) => item.str).join(" ") + "\n";
    }
    // 3. Extract key information from the text
    const kilometrajeMatch = extractedText.match(/KILOMETRAJE\s*([\d,]+)/);
    const colorMatch = extractedText.match(/COLOR\s*([A-Za-z]+)/);
    const latoneriaMatch = extractedText.match(/LATONERIA\s*#*\s*([\d]+%)/);
    const pinturaMatch = extractedText.match(/PINTURA\s*#*\s*([\d]+%)/);

    const extractedData = {
      placa,
      encontrado: true,
      kilometraje: kilometrajeMatch ? kilometrajeMatch[1] : "No encontrado",
      color: colorMatch ? colorMatch[1] : "No encontrado",
      estado: {
        latoneria: latoneriaMatch ? latoneriaMatch[1] : "No encontrado",
        pintura: pinturaMatch ? pinturaMatch[1] : "No encontrado",
      },
    };

    return NextResponse.json(extractedData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        placa,
        encontrado: false,
        error: "El peritaje no existe para esta placa o no se pudo descargar.",
      },
      { status: 404 }
    );
  }
}

// Function to extract text using pdfjs-dist (Node.js compatible version)
async function extractTextFromPDF(pdfBuffer: Buffer) {
  const loadingTask = pdfjs.getDocument({ data: pdfBuffer });
  console.log("");
  const pdf = await loadingTask.promise;
  let text = "";

  console.log("jereeer");
  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1);
    const textContent = await page.getTextContent();
    text += textContent.items.map((item: any) => item.str).join(" ") + "\n";
  }

  console.log("text", text);
  return text.replace(/\s{2,}/g, " ").trim();
}
