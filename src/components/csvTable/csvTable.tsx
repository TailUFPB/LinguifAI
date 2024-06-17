import React from "react";

interface Props {
  head: string[];
  data: any[][];
}

export default function CsvTable({ data, head }: Props) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full bg-gray-100 border-collapse">
        <thead className="bg-gray-100 h-[120px]">
          <tr>
            {head.map((headTitle, index) => (
              <th key={index} className="px-4 py-2 text-left border-2 bg-gray-100 border-gray-300 align-top">
                {headTitle}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={"bg-gray-100"}>
              {
                row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-2 text-center border-2 border-gray-300">
                    <div className="line-clamp-3">
                      {cell}
                    </div>
                  </td>
                ))
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
