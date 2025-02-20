import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
// import Breadcrumb from "../components/Breadcrumb";
// 
import DistributorPageLayer from "../components/DistributorPage";


const DistributorPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        {/* <Breadcrumb title="Users Grid" /> */}

        {/* UsersListLayer */}
        <DistributorPageLayer />

      </MasterLayout>

    </>
  );
};

export default DistributorPage; 
