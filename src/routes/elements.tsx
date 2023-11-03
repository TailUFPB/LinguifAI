import { ElementType, Suspense, lazy } from "react";
import LoadingScreen from "../pages/loadingScreen";

const Loadable = (Component: ElementType) => (props: any) => {
  // Adiciona carregamento

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export const Home = Loadable(lazy(() => import("../pages/home")));
