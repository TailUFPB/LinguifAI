import { useState } from "react";
import { SelectFileCard } from "../components/selectFileCard/selectFileCard";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [data, setData] = useState<any[][]>([]);
  const [header, setHeader] = useState<string[]>([]);

  const [selectedColumn, setSelectedColumn] = useState<number>(0);
  const [selectedClassifier, setSelectedClassifier] = useState<string>("");

  const handleChangeSelectedColumn = (event: any) => {
    setSelectedColumn(event.target.value);
  };

  const handleChangeSelectedClassifier = (event: any) => {
    setSelectedClassifier(event.target.value);
  };

  const handleSubmit = async () => {
    let selectedData = data.map((row) => row[selectedColumn]);

    console.log(selectedData);
  };

  return (
    <div className="bg-main-darker text-white min-h-screen flex flex-col">
      <div className="p-8 text-center font-roboto">
        <h1 className="text-3xl font-bold mb-6 mt-6">
          Linguif<span className="text-main-light">AI</span>
        </h1>

        {
          <SelectFileCard
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setData={setData}
            data={data}
            setHeader={setHeader}
            header={header}
          />
        }

        <div className="w-1/3 relative mx-auto mt-24">
          <select
            className="w-full bg-main-dark border-2 border-main-lighter rounded-3xl py-2 px-4 hover:bg-main-darker text-white focus:outline-none h-14"
            onChange={handleChangeSelectedColumn}
          >
            <option value="" disabled selected className="placeholder-gray-300">
              Selecione a coluna de entrada
            </option>
            {header.length > 0 &&
              header.map((column: string, index: number) => {
                return <option value={index}>{column}</option>;
              })}
          </select>
        </div>

        <div className="w-1/3 relative mx-auto mt-10">
          <select
            className="w-full bg-main-dark border-2 border-main-lighter rounded-3xl py-2 px-4 hover:bg-main-darker text-white focus:outline-none h-14"
            onChange={handleChangeSelectedClassifier}
          >
            <option value="" disabled selected className="placeholder-gray-300">
              Selecione um classificador
            </option>
            <option value="a">Classificador a</option>
            <option value="b">Classificador B</option>
          </select>
        </div>

        <div className="w-1/4 relative mx-auto mt-10">
          <button className="w-full bg-main-dark text-white py-2 px-4 hover:bg-main-darker focus:outline-none border-2 border-main-lighter rounded-3xl h-14">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
