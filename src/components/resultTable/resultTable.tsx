import React from "react";

interface Props {
  data: { [key: string]: any };
  classifierName: string;
}

export default function ResultTable({ data, classifierName }: Props) {
  return (
    <div className="w-11/12 overflow-hidden rounded-3xl border-2 border-grey">
      <table className="w-full">
        <thead>
          <tr className="rounded-3xl bg-main-darker">
            <th>{"Index"}</th>
            <th className={`border-grey border-l-2`}>{"Input"}</th>

            <th className={`border-grey border-l-2`}>{"Output"}</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(data)
            .slice(0, 10)
            .map((row: any, index: number) => {
              return (
                <tr
                key={row}
                className={`${
                    index % 2 ? `bg-main-bold` : `bg-main-medium`
                  } border-t-2`}
                >
                  <td className={`px-5 py-1 border-grey`}>{index}</td>
                  <td className={`px-5 py-1 border-grey border-l-2`}>{row}</td>
                  <td className={`px-5 py-1 border-grey border-l-2`}>
                    {data[row]}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
