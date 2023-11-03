import React from "react";

interface Props {
  head: any[];
  data: any[][];
}

export default function CsvTable({ data, head }: Props) {
  return (
    <div className="mt-5 w-11/12 mx-3 overflow-hidden rounded-3xl border-2 border-grey">
      <table className="w-full">
        <thead>
          <tr className="rounded-3xl bg-main-darker">
            {head.map((headTitle, index) => {
              return (
                <th key={index} className={`border-grey ${index === 0 ? `` : `border-l-2`}`}>
                  {headTitle}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            return (
              <tr
                key={index}
                className={`${
                  index % 2 ? `bg-main-bold` : `bg-main-medium`
                } border-t-2`}
              >
                {row.map((cell, cellIndex) => {
                  return (
                    <td
                      key={cellIndex}
                      className={`px-5 py-1 border-grey ${
                        cellIndex === 0 ? `` : `border-l-2`
                      }`}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
