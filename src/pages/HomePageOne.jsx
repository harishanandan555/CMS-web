import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import MasterLayout1 from "../masterLayout/MasterLayout1";
// import Breadcrumb from "../components/Breadcrumb";
import DashBoardLayerOne from "../components/DashBoardLayerOne";

const HomePageOne = () => {
  return (
    <>
    {/* <div style={{ height: '300vh', width: '100%', backgroundColor: 'black' }}> */}
      {/* MasterLayout */}
      <MasterLayout1>
        {/* Breadcrumb */}
        {/* <Breadcrumb title="AI" /> */}


        {/* DashBoardLayerOne */}
        <DashBoardLayerOne />

      </MasterLayout1>
      {/* </div> */}
    </>
  );
};

export default HomePageOne;
