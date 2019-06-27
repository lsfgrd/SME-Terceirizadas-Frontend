import React from "react";
import OrdersDashboardContainer from "../../components/TourRequest/DRE/OrdersDashboardContainer";
import { Header } from "../../components/Main/Header";
import { Sidebar } from "../../components/Main/Sidebar";

export default props => (
  <div id="wrapper">
    <Header />
    <Sidebar />
    <div id="content-wrapper" className="pt-5">
      <div className="d-flex flex-column p-4 mt-5">
        <OrdersDashboardContainer />
      </div>
    </div>
  </div>
);
