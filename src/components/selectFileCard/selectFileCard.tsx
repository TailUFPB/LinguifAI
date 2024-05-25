import { Icon } from "@iconify/react";
import { ChangeEvent, useState } from "react";
import Papa from "papaparse";
import CsvTable from "../csvTable/csvTable";
import { Link } from "@mui/material";

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
    setIsDragging(true);
    event.preventDefault();
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return !selectedFile ? (
    <div
      className={`${data.length > 0 ? `w-4/5` : `w-2/5`
        } min-h-[170px] relative mx-auto mt-24 bg-gray-100 border-dashed border-2 border-gray-700 text-gray-600 px-4 placeholder-gray-300 rounded-md flex flex-col items-center justify-center gap-4 text-lg ${isDragging ? "blur-sm" : ""
        }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >

      <Icon
        icon="ic:outline-upload-file"
        className="text-gray"
        width="50"
      />


      <h2 className="mb-0">Arraste e solte ou <a
        className="underline cursor-pointer"
        onClick={() => {
          const fileInput = document.getElementById("fileInput");
          if (fileInput) {
            fileInput.click();
          }
        }}
      >
        selecione do Computador
      </a>
        <input
          type="file"
          id="fileInput"
          data-testid="fileInput"
          style={{ display: "none" }}
          accept=".csv"
          onChange={handleFileChange}
        /></h2>
    </div>
  ) : (

    <div
      className={`${data.length > 0 ? `w-4/5` : `w-2/5`
        } min-h-[170px] relative mx-auto flex flex-col items-center justify-center ${isDragging ? "blur-sm" : ""
        }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >


      {data.length > 0 && (
        <CsvTable data={data.slice(0, 4)} head={header} />
      )}
    </div>
  )
}
