import { Icon } from "@iconify/react";
import { ChangeEvent, useState } from "react";
import Papa from "papaparse";
import CsvTable from "../csvTable/csvTable";

interface props {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  setData: (data: any[][]) => void;
  data: any[][];
  header: string[];
  setHeader: (header: string[]) => void;
}

export default function SelectFileCard({
  selectedFile,
  setSelectedFile,
  setData,
  data,
  header,
  setHeader,
}: props) {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Selecionar arquivo
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file);

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete(results, file) {
          let chaves = Object.keys(results.data[0] || []);

          let data: any[][] = results.data.map((row: any) => {
            let newRow: any[] = [];
            chaves.forEach((chave) => {
              newRow.push(row[chave]);
            });
            return newRow;
          });

          setData(data);
          setHeader(chaves);
        },
      });
    } else {
      setSelectedFile(null);
    }
  };

  // Arrastar e soltar
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true); // Quando o usuário arrasta algo para cima
    event.preventDefault();
  };

  const handleDragLeave = () => {
    setIsDragging(false); // Quando o usuário cancela o arrasto
  };

  return (
    <div
      className={`${
        data.length > 0 ? `w-4/5` : `w-2/5`
      } relative mx-auto mt-24 bg-main-dark border-2 border-main-lighter text-white pt-4 px-4 placeholder-gray-300 rounded-3xl min-h-min flex flex-col items-center justify-between ${
        isDragging ? "blur-sm" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {isDragging ? (
        <h2 className="mb-0">Arrastar e soltar</h2>
      ) : (
        <>
          <Icon
            icon="ic:outline-upload-file"
            className=" text-white"
            width="50"
          />

          {selectedFile ? ( // se tiver arquivo selecionado, seu nome é exibido
            <p className="blur-none">{selectedFile.name}</p>
          ) : (
            <>
              <h2 className="mb-0">Arrastar e soltar</h2>
              <h2 className="mt-0">Ou</h2>
            </>
          )}

          {data.length > 0 && (
            <CsvTable data={data.slice(0, 4)} head={header} />
          )}

          <button
            className="border-2 border-main-lighter border-b-0 bottom-0 rounded-3xl rounded-b-none mt-5 py-2 w-3/5 bg-main-medium hover:bg-main-darker"
            onClick={() => {
              const fileInput = document.getElementById("fileInput");
              if (fileInput) {
                fileInput.click();
              }
            }}
          >
            Selecionar do Computador
          </button>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            accept=".csv"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
}
