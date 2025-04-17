import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SuperAdminDashboard from "../components/SuperAdminDashboard";
import UnitCountThree from "../components/child/UnitCountthree";

const HomePageTwo = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('user_role');
    if (userRole !== 'superadmin') {
      navigate('/sign-in');
    }
  }, [navigate]);

  return (
    <>
      <MasterLayout>
        <Breadcrumb title="Super Admin Dashboard" />
        <UnitCountThree />
      </MasterLayout>
    </>
  );
};

export default HomePageTwo;
