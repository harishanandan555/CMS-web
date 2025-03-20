import React from "react";

import MasterLayout1 from "../../masterLayout/MasterLayout1";


import AdvisorCustomer from "./Customerlist";

const AdvisorLayout = () => {
  return (
    <>
    {/* <div style={{ height: '300vh', width: '100%', backgroundColor: 'black' }}> */}
      {/* MasterLayout */}
      <MasterLayout1>
        {/* Breadcrumb */}
        {/* <Breadcrumb title="AI" /> */}


        {/* DashBoardLayerOne */}
        <AdvisorCustomer />

      </MasterLayout1>
      {/* </div> */}
    </>
  );
};

export default AdvisorLayout;