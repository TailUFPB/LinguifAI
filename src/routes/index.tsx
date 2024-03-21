import { Route, Navigate } from "react-router-dom";
import { Home, Train } from "./elements";

export default function Router() {
  return (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/train" element={<Train />} />
      <Route path="/404" element={<Navigate to="/404" replace />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </>
  );
}
