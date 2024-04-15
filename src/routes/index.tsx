import { Navigate, useRoutes } from "react-router-dom";
import { Home, Train, About } from "./elements";

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
    {
      path: "/about",
      element: <About />,
    },
    { path: "*", element: <Navigate to="/404" replace /> },
    { path: "/404", element: <>404</> },
  ]);
}
