import { useEffect, useState } from "react";
import SelectFileCard from "../components/selectFileCard/selectFileCard";
import axios from "axios";
import ResultTable from "../components/resultTable/resultTable";
import { Menu } from "../components/menu/menu";

export default function Train() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [data, setData] = useState<any[][]>([]);
  const [header, setHeader] = useState<string[]>([]);

  const [selectedColumn, setSelectedColumn] = useState<number>(0);
  const [selectedLabel, setSelectedLabel] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);

  const handleChangeSelectedColumn = (event: any) => {
    setSelectedColumn(event.target.value);
  };

  const handleChangeSelectedLabel = (event: any) => {
    setSelectedLabel(event.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    let selectedData = data.map((row) => ({
      value: row[selectedColumn],
      label: row[selectedLabel],
    }));

    let selectedLabels = data.map((row) => row[selectedLabel]);
    let selectedValues = data.map((row) => row[selectedColumn]);

    const sendData = {
      data: selectedValues,
      label: selectedLabels,
      batch_size: batchSize || 16,
      epochs: epochs || 50,
      learning_rate: learningRate || 0.001,
      name: modelName || "trained-model",
    };

    console.log(sendData);

    const response = await axios
      .post("http://localhost:5000/neural-network", sendData)
      .catch((error) => {
        console.error(error.response.data);
      });

    if (response && response.data) {
      console.log(response.data);
    }
    setIsLoading(false);
  };

  const [batchSize, setBatchSize] = useState<number>(16);
  const [epochs, setEpochs] = useState<number>(50);
  const [learningRate, setLearningRate] = useState<number>(0.001);
  const [modelName, setModelName] = useState<string>("");

  const handleBatchSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value);
    setBatchSize(value);
  };

  const handleEpochsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setEpochs(value);
  };

  const handleLearningRateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value);
    setLearningRate(value);
  };

  const handleModelNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setModelName(value);
  };

  const [advancedOptionsVisible, setAdvancedOptionsVisible] = useState(false);

  const toggleAdvancedOptions = () => {
    setAdvancedOptionsVisible(!advancedOptionsVisible);
  };

  // carregamento

  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/training-status"
        );
        const { training_progress, training_in_progress } = response.data;
        setLoadingProgress(training_in_progress ? training_progress : 1);
      } catch (error) {
        console.error("Erro ao buscar progresso:", error);
      }
    };

    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

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
            <div className="xl:w-1/2 sm:w-10/12 relative mx-auto mt-24">
              <label
                htmlFor="modelName"
                className="block text-white mb-2 left-0"
              >
                Nome do modelo
              </label>
              <input
                id="modelName"
                placeholder="Insira o nome do modelo..."
                type="text"
                className="w-full bg-main-dark border-2 border-main-lighter rounded-3xl py-2 px-4 hover:bg-main-darker text-white focus:outline-none h-14"
                onChange={handleModelNameChange}
              />
            </div>

            <div className="xl:w-1/2 sm:w-10/12 relative mx-auto mt-10">
              <label
                htmlFor="selectedColumn"
                className="block text-white mb-2 left-0"
              >
                Coluna de entrada
              </label>
              <select
                id="selectedColumn"
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

            <div className="xl:w-1/2 sm:w-10/12 relative mx-auto mt-10">
              <label
                htmlFor="selectedLabel"
                className="block text-white mb-2 left-0"
              >
                Coluna de label
              </label>
              <select
                id="selectedLabel"
                className="w-full bg-main-dark border-2 border-main-lighter rounded-3xl py-2 px-4 hover:bg-main-darker text-white focus:outline-none h-14"
                onChange={handleChangeSelectedLabel}
              >
                <option
                  value=""
                  disabled
                  selected
                  className="placeholder-gray-300"
                >
                  Selecione a coluna de label
                </option>
                {header.length > 0 &&
                  header.map((column: string, index: number) => {
                    return <option value={index}>{column}</option>;
                  })}
              </select>
            </div>

            <button
              className="mt-10 bg-main-bold hover:bg-main-light text-white font-bold py-2 px-4 rounded-lg"
              onClick={toggleAdvancedOptions}
              style={{ cursor: "pointer" }}
            >
              {advancedOptionsVisible
                ? "Esconder Parâmetros Avançados"
                : "Exibir Parâmetros Avançados"}
            </button>

            {advancedOptionsVisible && (
              <div className="xl:w-1/2 sm:w-10/12 input-group flex justify-between m-auto mt-10 mb-20">
                <div>
                  <label
                    htmlFor="batchSize"
                    className="block text-white mb-2 left-0"
                  >
                    Batch Size
                  </label>
                  <input
                    type="number"
                    id="batchSize"
                    className="w-full bg-main-dark border-2 border-main-lighter rounded-3xl py-2 px-4 hover:bg-main-darker text-white focus:outline-none h-14"
                    placeholder="Enter Batch Size..."
                    value={batchSize}
                    onChange={handleBatchSizeChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="epochs"
                    className="block text-white mb-2 left-0"
                  >
                    Epochs
                  </label>
                  <input
                    type="number"
                    className="w-full bg-main-dark border-2 border-main-lighter rounded-3xl py-2 px-4 hover:bg-main-darker text-white focus:outline-none h-14"
                    placeholder="Enter Epochs..."
                    value={epochs}
                    onChange={handleEpochsChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="learningRate"
                    className="block text-white mb-2 left-0"
                  >
                    Learning Rate
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full bg-main-dark border-2 border-main-lighter rounded-3xl py-2 px-4 hover:bg-main-darker text-white focus:outline-none h-14"
                    placeholder="Enter Learning Rate..."
                    value={learningRate}
                    onChange={handleLearningRateChange}
                  />
                </div>
              </div>
            )}

            <div className="xl:w-1/2 sm:w-10/12  relative mx-auto mt-10">
              <div className="relative w-full">
                {isLoading && (
                  <div className="relative w-full">
                    <div className="bg-main-bold flex rounded-lg h-10 absolute top-0 left-0 w-full text-white">
                      {`Treinamento em ${loadingProgress}%`}
                    </div>
                    <div
                      className="bg-blue-500 h-10 rounded-lg absolute top-0 left-0 w-full"
                      style={{ width: `${loadingProgress}%` }}
                    ></div>
                    <div className="flex items-center justify-center h-10 absolute top-0 left-0 w-full text-white">
                      {`Treinamento em ${loadingProgress}%`}
                    </div>
                  </div>
                )}

                <button
                  className={`w-full bg-main-dark text-white py-2 px-4 hover:bg-main-darker focus:outline-none border-2 border-main-lighter rounded-3xl h-14 ${
                    isLoading ? "opacity-0 pointer-events-none" : ""
                  }`}
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Carregando..." : "Treinar"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
