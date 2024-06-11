import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectFileCard from "../../components/selectFileCard/selectFileCard";
import ResultTable from "../../components/resultTable/resultTable";

export default function HomeView() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [data, setData] = useState<any[][]>([]);
    const [header, setHeader] = useState<string[]>([]);
    const [selectedColumn, setSelectedColumn] = useState<number>(0);
    const [selectedClassifier, setSelectedClassifier] = useState<string>("");
    const [classifiers, setClassifiers] = useState<{ [key: string]: string }>({});
    const [result, setResult] = useState<{ [key: string]: any }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isBackendAvailable, setIsBackendAvailable] = useState(false);

    useEffect(() => {
        const fetchClassifiers = async () => {
            while (true) {
                try {
                    const response = await axios.get("http://localhost:5000/get-classifiers");
                    console.log(response);
                    setClassifiers(response.data);
                    setIsBackendAvailable(true);
                    break;
                } catch (error) {
                    console.error("Error fetching classifiers, retrying...", error);
                    await new Promise((resolve) => setTimeout(resolve, 3000));
                }
            }
        };

        fetchClassifiers();
    }, []);

    useEffect(() => {
        const sendSelectedFileToBackend = async () => {
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);

                try {
                    await axios.post("http://localhost:5000/receive", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
                } catch (error) {
                    console.error("Error uploading file", error);
                }
            }
        };

        sendSelectedFileToBackend();
    }, [selectedFile]);
    
    const handleChangeSelectedColumn = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedColumn(Number(event.target.value));
    };

    const handleChangeSelectedClassifier = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedClassifier(event.target.value);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        let selectedData = data.map((row) => row[selectedColumn]);
        const response = await axios.post("http://localhost:5000/classify", {
            data: selectedData,
            classifier: selectedClassifier,
        }).catch((error) => {
            console.error(error.response.data);
        });

        if (response && response.data) {
            const parsedData = JSON.parse(response.data.result);
            const input: any[] = Object.values(parsedData.input_column);
            const output: any[] = Object.values(parsedData.output_column).flat(1);

            if (input.length === output.length) {
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

    const handleDownloadOutputCSV = async () => {
        const finalHeader = header.concat(`${selectedClassifier}_output`);
        const finalData = data.map((row) => row.concat(result[row[selectedColumn]]));

        const csv = finalHeader.join(",").concat("\n").concat(finalData.map((row) => row.join(",")).join("\n"));

        const csvFile = new Blob([csv], { type: "text/csv" });
        const csvURL = window.URL.createObjectURL(csvFile);
        const tempLink = document.createElement("a");
        tempLink.href = csvURL;
        tempLink.setAttribute("download", "output.csv");
        tempLink.click();
    };

    if (!isBackendAvailable) {
        return <div className="p-8 text-center text-black text-2xl font-bold">Carregando backend...</div>;
    }

    return (
        <div className="p-8 text-center text-black">
            <SelectFileCard
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                setData={setData}
                data={data}
                setHeader={setHeader}
                header={header}
            />

            {selectedFile && (
                <>
                    <div className="w-1/3 relative mx-auto mt-10">
                        <label htmlFor="columnSelect" className="block mb-2 text-center">
                            Coluna de Entrada
                        </label>
                        <select
                            id="columnSelect"
                            className="w-full border-2 border-gray-500 rounded-xl py-2 px-4 hover:bg-gray-100 focus:outline-none h-14"
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
                        <label htmlFor="classifierSelect" className="block mb-2 text-center">
                            Selecione um Classificador
                        </label>
                        <select
                            id="classifierSelect"
                            className="w-full border-2 border-gray-500 rounded-xl py-2 px-4 hover:bg-gray-100 focus:outline-none h-14"
                            onChange={handleChangeSelectedClassifier}
                        >
                            <option value="" disabled selected className="placeholder-gray-300">
                                Selecione um classificador
                            </option>
                            {Object.entries(classifiers).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-1/4 relative mx-auto mt-10 text-white">
                        <button
                            className="w-full bg-blue-400 py-2 px-4 hover:bg-blue-600 focus:outline-none border-2 border-main-lighter rounded-xl h-14"
                            onClick={handleSubmit}
                        >
                            {isLoading ? "Carregando..." : "Classificar"}
                        </button>
                    </div>
                    {Object.keys(result).length > 0 && (
                        <div
                            className={`w-4/5 relative mx-auto mt-24 border-main-lighter py-4 px-2 placeholder-gray-300 rounded-3xl min-h-min flex flex-col items-center justify-between`}
                        >
                            <ResultTable
                                data={result}
                                classifierName={"classificador tal"}
                            />
                            <div className="w-1/4 relative mx-auto mt-10">
                                <button
                                    className="w-full text-white bg-blue-400 py-2 px-4 hover:bg-blue-600 focus:outline-none border-2 border-main-lighter rounded-xl h-14"
                                    onClick={handleDownloadOutputCSV}
                                >
                                    Baixar CSV
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
