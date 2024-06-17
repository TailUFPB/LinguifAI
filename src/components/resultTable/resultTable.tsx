import React from "react";
import CsvTable from "../csvTable/csvTable";

interface TableData {
  Coluna: string;
  Valor: any;
}

interface Props {
  data: { [key: string]: any };
  classifierName: string;
}

export default function ResultTable({ data, classifierName }: Props) {
  const tableData: TableData[] = Object.entries(data).map(([key, value]) => ({
    Coluna: key,
    Valor: value,
  }));

  const convertedTableData: any[][] = tableData.slice(0, 4).map((item) => [item.Coluna, item.Valor]);

  return <CsvTable data={convertedTableData} head={["Input", "Output"]} />;
}
