import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import MasterLayout1 from "../masterLayout/MasterLayout1";
import Breadcrumb from "../components/Breadcrumb";
import ViewProfileLayer from "../components/ViewProfileLayer";


const ViewProfilePage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout1>

        {/* Breadcrumb */}
        <Breadcrumb title="View Profile" />

        {/* ViewProfileLayer */}
        <ViewProfileLayer />

      </MasterLayout1>

    </>
  );
};

export default ViewProfilePage; 
