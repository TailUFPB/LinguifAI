import { render } from "@testing-library/react";
import CsvTable from "../components/csvTable/csvTable";

describe("CsvTable", () => {
  it("✅ should render the table headers and data correctly", () => {

    const head = ["Header 1", "Header 2", "Header 3"];
    const data = [
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
    ];

    const { getByText } = render(<CsvTable data={data} head={head} />);

    head.forEach((headerText) => {
      expect(getByText(headerText)).toBeInTheDocument();
    });

    data.flat().forEach((cellText) => {
      expect(getByText(cellText)).toBeInTheDocument();
    });
  });
});
