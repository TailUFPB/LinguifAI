import { Icon } from "@iconify/react";
import { ChangeEvent, useState } from "react";
import Papa from "papaparse";
import CsvTable from "../csvTable/csvTable";
import { Button } from "@mui/material";

interface props {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  setData: (data: any[][]) => void;
  data: any[][];
  header: string[];
  setHeader: (header: string[]) => void;
}

const ITEMS_PER_PAGE = 6;

export default function SelectFileCard({
  selectedFile,
  setSelectedFile,
  setData,
  data,
  header,
  setHeader,
}: props) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file);

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete(results) {
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
          setCurrentPage(0); // Reset to first page
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const displayedData = data.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const renderPageNumbers = (): JSX.Element[] => {
    const pageNumbers: JSX.Element[] = [];

    if (totalPages <= 1) return pageNumbers;

    pageNumbers.push(
      <button
        key={0}
        onClick={() => handlePageChange(0)}
        className={`mx-1 px-2 py-1 border rounded ${currentPage === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
      >
        1
      </button>
    );

    if (currentPage > 3) {
      pageNumbers.push(<span key="start-ellipsis" className="mx-1">...</span>);
    }

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages - 2, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`mx-1 px-2 py-1 border rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        >
          {i + 1}
        </button>
      );
    }

    if (currentPage < totalPages - 4) {
      pageNumbers.push(<span key="end-ellipsis" className="mx-1">...</span>);
    }

    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages - 1}
          onClick={() => handlePageChange(totalPages - 1)}
          className={`mx-1 px-2 py-1 border rounded ${currentPage === totalPages - 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return !selectedFile ? (
    <div
      className={`${data.length > 0 ? `w-4/5` : `w-2/5`
        } min-h-[170px] relative mx-auto mt-24 bg-gray-100 border-dashed border-2 border-gray-700 text-gray-600 px-4 placeholder-gray-300 rounded-md flex flex-col items-center justify-center gap-4 ${isDragging ? "blur-sm" : ""
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
      <h2 className="mb-0">
        Arraste e solte ou{" "}
        <a
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
        />
      </h2>
      <p className="text-sm text-gray-600">Por favor, selecione um arquivo no formato .csv</p>
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
        <>
          <CsvTable data={displayedData} head={header} />
          <div className="flex justify-between mt-4">
            <Button
              variant="contained"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Anterior
            </Button>
            <div className="flex items-center">
              {renderPageNumbers()}
            </div>
            <Button
              variant="contained"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={(currentPage + 1) * ITEMS_PER_PAGE >= data.length}
            >
              Próximo
            </Button>
          </div>
        </>
      )}
    </div>
  );
}