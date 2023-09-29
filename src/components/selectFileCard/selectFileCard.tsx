import { Icon } from "@iconify/react";
import { ChangeEvent, useState } from "react";

interface props {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

export function SelectFileCard({ selectedFile, setSelectedFile }: props) {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Selecionar arquivo
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file);
      console.log(file);
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
      className={`w-2/5 relative mx-auto mt-24 bg-main-dark border-2 border-main-lighter text-white pt-4 px-4 placeholder-gray-300 rounded-3xl h-48 flex flex-col items-center justify-between ${
        isDragging ? "border-4" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Icon icon="ic:outline-upload-file" className=" text-white" width="50" />

      {selectedFile ? ( // se tiver arquivo selecionado, seu nome é exibido
        <p>{selectedFile.name}</p>
      ) : (
        <>
          <h2 className="mb-0">Arrastar e soltar</h2>
          <h2 className="mt-0">Ou</h2>
        </>
      )}

      <button
        className="border-2 border-main-lighter border-b-0 bottom-0 rounded-3xl rounded-b-none py-2 w-3/5 bg-main-medium hover:bg-main-darker"
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
    </div>
  );
}
