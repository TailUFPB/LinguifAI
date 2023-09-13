import { ElementType, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "../pages/loadingScreen";

const Loadable = (Component: ElementType) => (props: any) => {
  // Adiciona carregamento
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export const Home = Loadable(lazy(() => import("../pages/home")));
