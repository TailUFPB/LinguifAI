import { render } from "@testing-library/react";
import App from "../App";

test("✅ renderiza o componente App sem erros", () => {
  const { getByText } = render(<App />);

  const linkElement = getByText(/App/i);
  expect(linkElement).toBeInTheDocument();
});