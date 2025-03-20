import React from "react";

import MasterLayout1 from "../../masterLayout/MasterLayout1";

import AdvisorEvent from "./Event";

const AdvisorEventLayout = () => {
  return (
    <>
    {/* <div style={{ height: '300vh', width: '100%', backgroundColor: 'black' }}> */}
      {/* MasterLayout */}
      <MasterLayout1>
        {/* Breadcrumb */}
        {/* <Breadcrumb title="AI" /> */}


        {/* DashBoardLayerOne */}
        <AdvisorEvent />

      </MasterLayout1>
      {/* </div> */}
    </>
  );
};

export default AdvisorEventLayout;