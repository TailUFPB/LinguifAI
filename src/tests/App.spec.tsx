import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "../App";

test("✅ renderiza o componente App sem erros", () => {
  render(<App />);
});
