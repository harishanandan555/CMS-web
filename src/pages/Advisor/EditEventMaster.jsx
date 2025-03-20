import React from "react";

import MasterLayout1 from "../../masterLayout/MasterLayout1";
import EditEvent from "./EditEvent";
import { useNavigate } from "react-router-dom";

const EditEventMaster = () => {
  return (
    <>
    {/* <div style={{ height: '300vh', width: '100%', backgroundColor: 'black' }}> */}
      {/* MasterLayout */}
      <MasterLayout1>
        {/* Breadcrumb */}
        {/* <Breadcrumb title="AI" /> */}


        {/* DashBoardLayerOne */}
        <EditEvent/>

      </MasterLayout1>
      {/* </div> */}
    </>
  );
};

export default EditEventMaster;