import { useState } from "react";
import SelectFileCard from "../components/selectFileCard/selectFileCard";
import axios from "axios";
import ResultTable from "../components/resultTable/resultTable";
import { Menu } from "../components/menu/menu";

export default function Train() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [data, setData] = useState<any[][]>([]);
  const [header, setHeader] = useState<string[]>([]);

  const [selectedColumn, setSelectedColumn] = useState<number>(0);
  const [selectedLabel, setSelectedLabel] = useState<string>("");

  const [result, setResult] = useState<{ [key: string]: any }>({});

  const [isLoading, setIsLoading] = useState(false);

  const handleChangeSelectedColumn = (event: any) => {
    setSelectedColumn(event.target.value);
  };

  const handleChangeSelectedLabel = (event: any) => {
    setSelectedLabel(event.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let selectedData = data.map((row) => row[selectedColumn]);
    console.log(selectedLabel)
    //let labels = data.map((row) => row[selectedLabel])
    const response = await axios
      .post("http://localhost:5000/neural-network", {
        data: selectedData,
        label: selectedLabel,
        name: "Teste-Front",
        epochs: 5,
        batch_size: 32
      })
      .catch((error) => {
        console.error(error.response.data);
      });

    if (response && response.data) {
      const parsedData = JSON.parse(response.data.result);
      console.log(parsedData);

      const input: any[] = Object.values(parsedData.input_column);
      const output: any[] = Object.values(parsedData.output_column).flat(1);

      if (input.length === output.length) {
        // cria um dicionário com os valores de input e output
        const result = input.reduce((acc, key, index) => {
          acc[key] = output[index];
          return acc;
        }, {} as { [key: string]: any });

        console.log(result);
        setResult(result);
      } else {
        console.error("Os arrays 'input' e 'output' têm tamanhos diferentes.");
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-main-darker text-white min-h-screen flex flex-col">
      <Menu />

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
            onChange={handleChangeSelectedColumn}
          >
            <option value="" disabled selected className="placeholder-gray-300">
              Selecione a coluna de label
            </option>
            {header.length > 0 &&
              header.map((column: string, index: number) => {
                return <option value={index}>{column}</option>;
              })}
          </select>
        </div>

        <div className="w-1/4 relative mx-auto mt-10">
          <button
            className="w-full bg-main-dark text-white py-2 px-4 hover:bg-main-darker focus:outline-none border-2 border-main-lighter rounded-3xl h-14"
            onClick={handleSubmit}
          >
            {isLoading ? "Carregando..." : "Treinar"}
          </button>
        </div>
      </div>
    </div>
  );
}
