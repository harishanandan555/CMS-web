import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";
// 
import AdvisorLayer from "../components/AdvisorLayer";

const AdvisorPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        {/* <Breadcrumb title="Users Grid" /> */}

        {/* UsersListLayer */}
        <AdvisorLayer />

      </MasterLayout>

    </>
  );
};

export default AdvisorPage; 
