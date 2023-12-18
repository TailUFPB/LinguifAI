import { useState, useEffect } from "react";
import SelectFileCard from "../components/selectFileCard/selectFileCard";
import axios from "axios";
import ResultTable from "../components/resultTable/resultTable";
import { Menu } from "../components/menu/menu";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [data, setData] = useState<any[][]>([]);
  const [header, setHeader] = useState<string[]>([]);

  const [selectedColumn, setSelectedColumn] = useState<number>(0);
  const [selectedClassifier, setSelectedClassifier] = useState<string>("");

  const [classifiers, setClassifiers] = useState<{ [key: string]: string }>({});

  const [result, setResult] = useState<{ [key: string]: any }>({});

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClassifiers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/get-classifiers"
        );
        setClassifiers(response.data);
      } catch (error) {
        console.error("Erro ao buscar classificadores:", error);
      }
    };

    fetchClassifiers();
  }, []);

  const handleChangeSelectedColumn = (event: any) => {
    setSelectedColumn(event.target.value);
  };

  const handleChangeSelectedClassifier = (event: any) => {
    setSelectedClassifier(event.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let selectedData = data.map((row) => row[selectedColumn]);
    const response = await axios
      .post("http://localhost:5000/classify", {
        data: selectedData,
        classifier: selectedClassifier,
      })
      .catch((error) => {
        console.error(error.response.data);
      });

    if (response && response.data) {
      const parsedData = JSON.parse(response.data.result);

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
        console.error("Os arrays 'input' e 'output' tem tamanhos diferentes.");
      }
    }

    setIsLoading(false);
  };

  const handleDownloadOutputCSV = async () => {
    // adicionar uma coluna no data

    const finalHeader = header.concat(`${selectedClassifier}_output`);
    const finalData = data.map((row) =>
      row.concat(result[row[selectedColumn]])
    );

    // gera um csv com os dados

    const csv = finalHeader
      .join(",")
      .concat("\n")
      .concat(finalData.map((row) => row.join(",")).join("\n"));

    // cria um link para download do csv

    const csvFile = new Blob([csv], { type: "text/csv" });
    const csvURL = window.URL.createObjectURL(csvFile);
    const tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", "output.csv");
    tempLink.click();
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

        {selectedFile && (
          <>
            (
            <div className="w-1/3 relative mx-auto mt-24">
              <select
                className="w-full bg-main-dark border-2 border-main-lighter rounded-3xl py-2 px-4 hover:bg-main-darker text-white focus:outline-none h-14"
                onChange={handleChangeSelectedColumn}
              >
                <option
                  value=""
                  disabled
                  selected
                  className="placeholder-gray-300"
                >
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
                <option
                  value=""
                  disabled
                  selected
                  className="placeholder-gray-300"
                >
                  Selecione um classificador
                </option>
                {Object.entries(classifiers).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/4 relative mx-auto mt-10">
              <button
                className="w-full bg-main-dark text-white py-2 px-4 hover:bg-main-darker focus:outline-none border-2 border-main-lighter rounded-3xl h-14"
                onClick={handleSubmit}
              >
                {isLoading ? "Carregando..." : "Classificar"}
              </button>
            </div>
            {Object.keys(result).length > 0 && (
              <div
                className={`w-4/5 relative mx-auto mt-24 border-main-lighter text-white py-4 px-2 placeholder-gray-300 rounded-3xl min-h-min flex flex-col items-center justify-between`}
              >
                <ResultTable
                  data={result}
                  classifierName={"classificador tal"}
                />
                <div className="w-1/4 relative mx-auto mt-10">
                  <button
                    className="w-full bg-main-dark text-white py-2 px-4 hover:bg-main-darker focus:outline-none border-2 border-main-lighter rounded-3xl h-14"
                    onClick={handleDownloadOutputCSV}
                  >
                    Baixar CSV
                  </button>
                </div>
              </div>
            )}
            )
          </>
        )}
      </div>
    </div>
  );
}
