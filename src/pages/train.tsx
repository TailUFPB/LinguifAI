import { useEffect, useState, useRef } from "react";
import SelectFileCard from "../components/selectFileCard/selectFileCard";
import axios from "axios";
import ResultTable from "../components/resultTable/resultTable";
import { Menu } from "../components/menu/menu";
import ReactApexChart from "react-apexcharts";
import { ReactApexChartsDefaultOptions } from "../Shared/apexChartsOptions";
import Layout from "./layout/layout";
import TrainView from "./views/trainView";

export default function Train() {

  return (
    <Layout><TrainView /></Layout>
  );
}