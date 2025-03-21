import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import API_BASE_URL from "../constants/constants";
const BankVerification = () => {
  const [selectedBank, setSelectedBank] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [bankList, setBankList] = useState([]);

  const accountTypes = ["Saving", "Current", "NRE Account", "NRO Account"];

  const getBankValueFromIFSC = (ifsc) => {
    return ifsc?.slice(-5);
  };

  const handleVerify = async () => {
    if (!selectedBank || !accountType || !accountNumber || !confirmAccountNumber || !ifscCode) {
      setMessage({ text: "⚠️ Please fill in all fields.", type: "error" });
      setSnackbarOpen(true);
      return;
    }
    if (accountNumber !== confirmAccountNumber) {
      setMessage({ text: "❌ Account numbers do not match.", type: "error" });
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    const requestBody = {
      client_bank_account_number_1: accountNumber,
      client_ifsc_code_1: ifscCode,
      client_bank_account_type_1: accountType,
      client_bank: {
        value: getBankValueFromIFSC(ifscCode),
        label: selectedBank,
      },
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/v1/cmsvalidation/cms/bankaccount/add`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "bb-access-token": localStorage.getItem("Emailtoken2") || "",
          },
        }
      );

      localStorage.setItem("accountNumber", accountNumber);
      localStorage.setItem("bankName", selectedBank);
      localStorage.setItem("ifscCode", ifscCode);
console.log("response", response);
      if (response.status === 200) {
        setMessage({ text: "✅ Bank account verified successfully! Click on Next", type: "success" });
      } else {
        setMessage({ text: "❌ Verification failed, please try again.", type: "error" });
      }
    } catch (error) {
      console.error("⚠️ Error verifying bank account:", error);
      setMessage({ text: "⚠️ Error verifying bank account. Please try again later.", type: "error" });
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/v1/master/bankaccountlist`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              "bb-access-token": localStorage.getItem("Emailtoken2") || "",
            },
          }
        );

        if (response.data?.master_list?.bank_list) {
          setBankList(response.data.master_list.bank_list);
        } else {
          console.error("Bank list not found in response.");
        }
      } catch (error) {
        console.error("Error fetching bank accounts:", error);
      }
    };
    fetchBankAccounts();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm" style={styles.container}>
      <Typography variant="h5" style={styles.header}>
        Verify Bank Account
      </Typography>

      <FormControl fullWidth style={styles.formControl}>
        <InputLabel>Select Bank</InputLabel>
        <Select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
          {bankList.map((bank) => (
            <MenuItem key={bank.value} value={bank.value}>
              {bank.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth style={styles.formControl}>
        <InputLabel>Choose Account Type</InputLabel>
        <Select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
          {accountTypes.map((type, index) => (
            <MenuItem key={index} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Enter Account Number"
        variant="outlined"
        fullWidth
        type="number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        style={styles.input}
      />

      <TextField
        label="Confirm Account Number"
        variant="outlined"
        fullWidth
        type="number"
        value={confirmAccountNumber}
        onChange={(e) => setConfirmAccountNumber(e.target.value)}
        style={styles.input}
      />

      <TextField
        label="IFSC Code"
        variant="outlined"
        fullWidth
        value={ifscCode}
        onChange={(e) => setIfscCode(e.target.value)}
        style={styles.input}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleVerify}
        style={styles.button}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Verify"}
      </Button>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <MuiAlert elevation={6} variant="filled" severity={message.type} onClose={handleSnackbarClose}>
          {message.text}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

const styles = {
  container: {
    marginTop: 30,
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  formControl: {
    marginBottom: 15,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
};

export default BankVerification;
