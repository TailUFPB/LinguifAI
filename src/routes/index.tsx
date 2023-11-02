import { Navigate, useRoutes } from "react-router-dom";
import { Home } from "./elements";

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    { path: "*", element: <Navigate to="/404" replace /> },
    { path: "/404", element: <>404</> },
  ]);
}
