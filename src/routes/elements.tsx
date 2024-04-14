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
export const Train = Loadable(lazy(() => import("../pages/train")));
export const About = Loadable(lazy(() => import("../pages/about")));
