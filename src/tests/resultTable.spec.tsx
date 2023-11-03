import { render } from "@testing-library/react";
import ResultTable from "../components/resultTable/resultTable";
import '@testing-library/jest-dom/extend-expect';

describe("ResultTable", () => {
  it("✅ deve renderizar corretamente sem dados", () => {
    const data: { [key: string]: any } = {};

    const { getByText } = render(
      <ResultTable data={data} classifierName={"Classificador a"} />
    );

    expect(document.querySelector("table")).toBeInTheDocument();

    expect(document.querySelectorAll("tbody tr")).toHaveLength(0);
  });

  it("✅ deve renderizar corretamente com dados", () => {
    const data: { [key: string]: any } = {
      item1: "output1",
      item2: "output2",
    };

    const { getByText } = render(
      <ResultTable data={data} classifierName={"Classificador B"} />
    );

    expect(document.querySelector("table")).toBeInTheDocument();

    expect(document.querySelectorAll("tbody tr")).toHaveLength(2);

    expect(getByText("item1")).toBeInTheDocument();
    expect(getByText("output1")).toBeInTheDocument();
    expect(getByText("item2")).toBeInTheDocument();
    expect(getByText("output2")).toBeInTheDocument();
  });
});