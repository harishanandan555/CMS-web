import React from "react";

import MasterLayout1 from "../../masterLayout/MasterLayout1";
import EventRegistrationForm from "./NewEvent";
import { useNavigate } from "react-router-dom";

const NewEventMaster = () => {
  return (
    <>
    {/* <div style={{ height: '300vh', width: '100%', backgroundColor: 'black' }}> */}
      {/* MasterLayout */}
      <MasterLayout1>
        {/* Breadcrumb */}
        {/* <Breadcrumb title="AI" /> */}


        {/* DashBoardLayerOne */}
        <EventRegistrationForm />

      </MasterLayout1>
      {/* </div> */}
    </>
  );
};

export default NewEventMaster;