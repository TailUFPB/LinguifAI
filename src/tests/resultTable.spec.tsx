import { render } from "@testing-library/react";
import ResultTable from "../components/resultTable/resultTable";

describe("ResultTable", () => {
    it("✅ deve renderizar a tabela corretamente", () => {
      const data: { [key: string]: any } = {
        item1: "output1",
        item2: "output2",
        item3: "output3",
      };
      const classifierName = "Classifier 1";
  
      const { getByText } = render(
        <ResultTable data={data} classifierName={classifierName} />
      );
  
      expect(getByText(classifierName)).toBeInTheDocument();
  
      Object.keys(data).forEach((item) => {
        expect(getByText(item)).toBeInTheDocument();
        expect(getByText(data[item])).toBeInTheDocument();
      });
    });
  
    it("✅ deve aplicar cores alternadas nas linhas da tabela", () => {
      const data: { [key: string]: any } = {
        item1: "output1",
        item2: "output2",
        item3: "output3",
      };
      const classifierName = "Classifier 1";
  
      const { container } = render(
        <ResultTable data={data} classifierName={classifierName} />
      );
  
      const tableRows = container.querySelectorAll("tbody tr");
  
      tableRows.forEach((row, index) => {
        if (index % 2 === 0) {
          expect(row).toHaveClass("bg-main-medium");
        } else {
          expect(row).toHaveClass("bg-main-bold");
        }
      });
    });
  });