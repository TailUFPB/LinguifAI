import React, { useState } from "react";
import CsvTable from "../csvTable/csvTable";
import { Button } from "@mui/material";

interface TableData {
  Coluna: string;
  Valor: any;
}

interface Props {
  data: { [key: string]: any };
  classifierName: string;
}

const ITEMS_PER_PAGE = 6;

export default function ResultTable({ data, classifierName }: Props) {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const tableData: TableData[] = Object.entries(data).map(([key, value]) => ({
    Coluna: key,
    Valor: value,
  }));

  const convertedTableData: any[][] = tableData.map((item) => [
    item.Coluna,
    item.Valor,
  ]);

  const displayedData = convertedTableData.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(convertedTableData.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * ITEMS_PER_PAGE < convertedTableData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPageNumbers = (): JSX.Element[] => {
    const pageNumbers: JSX.Element[] = [];

    if (totalPages <= 1) return pageNumbers;

    pageNumbers.push(
      <button
        key={0}
        onClick={() => handlePageChange(0)}
        className={`mx-1 px-2 py-1 border rounded ${
          currentPage === 0 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
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
          className={`mx-1 px-2 py-1 border rounded ${
            currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
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
          className={`mx-1 px-2 py-1 border rounded ${
            currentPage === totalPages - 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="w-full">
      <CsvTable data={displayedData} head={["Input", "Output"]} />
      <div className="flex justify-center mt-4">
        <Button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
        >
          Anterior
        </Button>
        <div className="flex items-center">
          {renderPageNumbers()}
        </div>
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={(currentPage + 1) * ITEMS_PER_PAGE >= convertedTableData.length}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}