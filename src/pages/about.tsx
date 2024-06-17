import Breadcrumb from "../components/breadcumbs/breadcumbs";
import Layout from "./layout/layout";
import AboutView from "./views/aboutView";

export default function About() {

  return (
    <Layout>
      <Breadcrumb crumbs={[{ label: "Sobre" }]} />
      <AboutView />
    </Layout>
  )

}
