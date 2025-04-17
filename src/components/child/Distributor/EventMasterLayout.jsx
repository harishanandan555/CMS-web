import React from "react";

import MasterLayout3 from "../../../masterLayout/MasterLayout3";
import NewEventMaster from "../../../pages/Advisor/NewEventMaster";
import { useNavigate } from "react-router-dom";
import EventDetailsPage from "./EventDetails";
const EventMasterLayout = () => {
  return (
    <>
    {/* <div style={{ height: '300vh', width: '100%', backgroundColor: 'black' }}> */}
      {/* MasterLayout */}
      <MasterLayout3>
        {/* Breadcrumb */}
        {/* <Breadcrumb title="AI" /> */}


        {/* DashBoardLayerOne */}
        <EventDetailsPage/>

      </MasterLayout3>
      {/* </div> */}
    </>
  );
};

export default EventMasterLayout;