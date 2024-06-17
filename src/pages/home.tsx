import Breadcrumb from "../components/breadcumbs/breadcumbs";
import Layout from "./layout/layout";
import HomeView from "./views/homeView";


export default function Home() {
  return <Layout>
    <Breadcrumb crumbs={[{ label: "Classificar" }]} />
    <HomeView />
  </Layout>;
}
