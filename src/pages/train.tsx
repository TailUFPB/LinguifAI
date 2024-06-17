import { useEffect, useState, useRef } from "react";
import SelectFileCard from "../components/selectFileCard/selectFileCard";
import axios from "axios";
import ResultTable from "../components/resultTable/resultTable";
import { Menu } from "../components/menu/menu";
import { ReactApexChartsDefaultOptions } from "../Shared/apexChartsOptions";
import Layout from "./layout/layout";
import TrainView from "./views/trainView";
import Breadcrumb from "../components/breadcumbs/breadcumbs";

export default function Train() {

  return (
    <Layout>
      <Breadcrumb crumbs={[{ label: "Treinar" }]} />
      <TrainView />
    </Layout>
  );
}
