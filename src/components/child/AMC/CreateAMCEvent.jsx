import React from "react";

import MasterLayout2 from "../../../masterLayout/MasterLayout2";
import NewEventMaster from "../../../pages/Advisor/NewEventMaster";
import { useNavigate } from "react-router-dom";
import EventRegistrationForm from "../../../pages/Advisor/NewEvent";
const AMCNewEventMaster = () => {
  return (
    <>
    {/* <div style={{ height: '300vh', width: '100%', backgroundColor: 'black' }}> */}
      {/* MasterLayout */}
      <MasterLayout2>
        {/* Breadcrumb */}
        {/* <Breadcrumb title="AI" /> */}


        {/* DashBoardLayerOne */}
        <EventRegistrationForm/>

      </MasterLayout2>
      {/* </div> */}
    </>
  );
};

export default AMCNewEventMaster;