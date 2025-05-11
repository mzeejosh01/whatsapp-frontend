import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    whatsappNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword, whatsappNumber } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = () => {
    if (activeStep === 0) {
      if (!name) return "Name is required";
      if (!email) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(email)) return "Email is invalid";
      return "";
    } else if (activeStep === 1) {
      if (!password) return "Password is required";
      if (password.length < 6) return "Password must be at least 6 characters";
      if (password !== confirmPassword) return "Passwords do not match";
      return "";
    }
    return "";
  };

  const handleNext = () => {
    const error = validateStep();
    if (error) {
      setError(error);
      return;
    }
    setError("");
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setError("");
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation
    if (!whatsappNumber) {
      setError("WhatsApp number is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await register(name, email, password, whatsappNumber);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Account Information", "Security", "WhatsApp Setup"];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              value={name}
              onChange={handleChange}
              required
            />

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              required
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              required
            />

            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              margin="normal"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleChange}
              required
            />
          </>
        );
      case 2:
        return (
          <>
            <TextField
              label="WhatsApp Number (include country code)"
              variant="outlined"
              fullWidth
              margin="normal"
              name="whatsappNumber"
              placeholder="+1234567890"
              value={whatsappNumber}
              onChange={handleChange}
              required
              helperText="This is the number you'll use with the WhatsApp Memory Bot"
            />

            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              By registering, you agree to receive WhatsApp messages from our
              service.
            </Typography>
          </>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          WhatsApp Memory Bot
        </Typography>
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Create an Account
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={activeStep === steps.length - 1 ? handleSubmit : undefined}
        >
          {getStepContent(activeStep)}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Box>

        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <Grid item>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Typography variant="body2" color="primary">
                Already have an account? Login here
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Register;
