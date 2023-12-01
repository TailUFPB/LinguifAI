import { Navigate, useRoutes } from "react-router-dom";
import { Home, Train } from "./elements";

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/train",
      element: <Train />,
    },
    { path: "*", element: <Navigate to="/404" replace /> },
    { path: "/404", element: <>404</> },
  ]);
}
