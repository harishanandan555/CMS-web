import React from "react";
import { useFormik } from "formik";
import {
  Container,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import API_BASE_URL from "../constants/constants";
const PersonalVerification = () => {
  const statesOfIndia = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal" 
  ];

  const formik = useFormik({
    initialValues: {
      maritalStatus: "single",
      address: "",
      city: "",
      state: "Karnataka",
      pincode: "",
      sourceOfWealth: "",
      occupation: "",
      annualIncome: "",
      incomeOutsideIndia: "no",
      politicallyExposedIndia: "no",
      politicallyExposedForeign: "no",
    },

    onSubmit: async (values) => {
      const requestBody = {
        address: values.address,
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        marital_status: values.maritalStatus,
        occupation: values.occupation,
        source_of_wealth: values.sourceOfWealth,
        annual_income: values.annualIncome,
        is_income_outside_india: values.incomeOutsideIndia === "yes",
        is_political_india: values.politicallyExposedIndia === "yes",
        is_political_foreign: values.politicallyExposedForeign === "yes",
      };

      const emailToken = localStorage.getItem("Emailtoken2");
      if (!emailToken) {
        alert("Token not found. Please log in again.");
        return;
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/v1/cmsvalidation/cms/personal/update`,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
              "bb-access-token": emailToken,
            },
          }
        );
        console.log("Success personal details:", response.data);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  return (
    <Container maxWidth="sm">
     
      
          <Typography variant="h5" gutterBottom>
          
            Your Detailed Information
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel component="legend">Marital Status*</FormLabel>
              <RadioGroup
                row
                name="maritalStatus"
                value={formik.values.maritalStatus}
                onChange={formik.handleChange}
              >
                <FormControlLabel value="single" control={<Radio />} label="Single" />
                <FormControlLabel value="married" control={<Radio />} label="Married" />
              </RadioGroup>
            </FormControl>

            <TextField fullWidth multiline rows={3} label="Communication Address*" name="address" value={formik.values.address} onChange={formik.handleChange} margin="normal" variant="outlined" />

            <TextField fullWidth label="City*" name="city" value={formik.values.city} onChange={formik.handleChange} margin="normal" variant="outlined" />

            <FormControl fullWidth margin="normal">
              <FormLabel>State*</FormLabel>
              <Select name="state" value={formik.values.state} onChange={formik.handleChange}>
                {statesOfIndia.map((state) => (
                  <MenuItem key={state} value={state}>{state}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField fullWidth label="Pincode*" name="pincode" value={formik.values.pincode} onChange={formik.handleChange} margin="normal" variant="outlined" />

            <FormControl fullWidth margin="normal">
              <FormLabel>Source Of Wealth*</FormLabel>
              <Select name="sourceOfWealth" value={formik.values.sourceOfWealth} onChange={formik.handleChange}>
                <MenuItem value="Salary">Salary</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="Investments">Investments</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Occupation*</FormLabel>
              <Select name="occupation" value={formik.values.occupation} onChange={formik.handleChange}>
                <MenuItem value="Professional">Professional</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="Retired">Retired</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Annual Income Range*</FormLabel>
              <Select name="annualIncome" value={formik.values.annualIncome} onChange={formik.handleChange}>
                <MenuItem value="Below 5 Lakhs">Below 5 Lakhs</MenuItem>
                <MenuItem value="5-10 Lakhs">5-10 Lakhs</MenuItem>
                <MenuItem value="10-20 Lakhs">10-20 Lakhs</MenuItem>
                <MenuItem value="Above 20 Lakhs">Above 20 Lakhs</MenuItem>
              </Select>
            </FormControl>

            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel>Do you have income outside India and paying tax in other countries?*</FormLabel>
              <RadioGroup row name="incomeOutsideIndia" value={formik.values.incomeOutsideIndia} onChange={formik.handleChange}>
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel>Are you related to a politically exposed person in India?*</FormLabel>
              <RadioGroup row name="politicallyExposedIndia" value={formik.values.politicallyExposedIndia} onChange={formik.handleChange}>
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel>Are you related to a politically exposed person in a foreign country?*</FormLabel>
              <RadioGroup row name="politicallyExposedForeign" value={formik.values.politicallyExposedForeign} onChange={formik.handleChange}>
                <FormControlLabel value="no" control={<Radio />} label="No" />
                <FormControlLabel value="notApplicable" control={<Radio />} label="Not Applicable" />
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              </RadioGroup>
            </FormControl>

            <Button type="submit" variant="contained" color="primary" endIcon={<SendIcon />} fullWidth sx={{ mt: 2 }}>
              Submit
            </Button>
          </form>
       
    </Container>
  );
};

export default PersonalVerification;
