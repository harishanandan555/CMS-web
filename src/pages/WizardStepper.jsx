import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Stepper, Step, StepLabel, Button, Box, Container, Snackbar, Alert } from "@mui/material";

const steps = ["Mobile Number", "OTP", "Email", "Email OTP", "PAN", "BANK", "CHEQUE", "PERSONAL"];
const stepRoutes = ["/wizardstepper/add-user", "/wizardstepper/otp", "/wizardstepper/email", "/wizardstepper/email-otp", "/wizardstepper/pan","/wizardstepper/bank", "/wizardstepper/cheque","/wizardstepper/personal"];

const WizardStepper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [apiSuccess, setApiSuccess] = useState(false); // Track API success state

  const currentStep = stepRoutes.indexOf(location.pathname);

  const handleNext = () => {
    if (currentStep < stepRoutes.length - 1) {
      navigate(stepRoutes[currentStep + 1]);
    } else {
      setOpenSnackbar(true);
      setTimeout(() => navigate('/completion'), 3000);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      navigate(stepRoutes[currentStep - 1]);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Box sx={{ width: "100%", my: 4 }}>
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Pass setApiSuccess to child routes */}
      <Outlet context={{ setApiSuccess }} />

      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" disabled={currentStep === 0} onClick={handleBack}>
          Previous
        </Button>
        <Button 
          variant="contained"
          onClick={handleNext}
          disabled={currentStep === steps.length - 1 && !apiSuccess} // Disable "Finish" until API is successful
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          🎉 Congratulations! You've completed the steps! 🎉
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WizardStepper;
