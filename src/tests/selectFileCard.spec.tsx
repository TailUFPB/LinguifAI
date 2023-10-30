import { render, fireEvent, screen } from "@testing-library/react";
import SelectFileCard from "../components/selectFileCard/selectFileCard"; // Certifique-se de ajustar o caminho conforme necessário

describe("SelectFileCard", () => {
  it("✅ deve renderizar corretamente", () => {
    const selectedFile = null;
    const setSelectedFile = jest.fn();
    const setData = jest.fn();
    const setHeader = jest.fn();
    const data: any[][] = [];
    const header: string[] = [];

    render(
      <SelectFileCard
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        setData={setData}
        data={data}
        header={header}
        setHeader={setHeader}
      />
    );

    expect(screen.getByText("Arrastar e soltar")).toBeInTheDocument();
  });

  it("✅ deve chamar a função setSelectedFile ao selecionar um arquivo", () => {
    const selectedFile = null;
    const setSelectedFile = jest.fn();
    const setData = jest.fn();
    const setHeader = jest.fn();
    const data: any[][] = [];
    const header: string[] = [];

    render(
      <SelectFileCard
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        setData={setData}
        data={data}
        header={header}
        setHeader={setHeader}
      />
    );

    const fileInput = screen.getByTestId("fileInput");
    fireEvent.change(fileInput, {
      target: {
        files: [new File([], "test.csv")],
      },
    });

    expect(setSelectedFile).toHaveBeenCalledWith(expect.any(File));
  });
});
