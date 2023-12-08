import { HashRouter } from "react-router-dom";
import "./App.css";
import Router from "./routes";

function App() {
  return (
    <HashRouter>
      {/* HashRouter é rota com # ex: google.com#/rota-aqui*/}
      <Router />
    </HashRouter>
  );
}

export default App;
