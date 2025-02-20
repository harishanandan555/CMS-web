import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import WizardStepper from "./WizardStepper";

const WizardUser = () => {
  return (

    <div style={{ backgroundColor: "#fff" }}>
    <MasterLayout>
     
        <Breadcrumb title="Add-User" />
        <WizardStepper />
    </MasterLayout>
    </div>

  );
};

export default WizardUser;
