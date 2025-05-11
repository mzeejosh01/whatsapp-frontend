import React, { useState } from "react";
import { useAuth } from "../contexts/Authcontext";
import Layout from "../components/Layout";
import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Box,
  Button,
  Grid,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CardActions,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  VpnKey as VpnKeyIcon,
  Notifications as NotificationsIcon,
  CreditCard as CreditCardIcon,
  Storage as StorageIcon,
  Delete as DeleteIcon,
  VerifiedUser as VerifiedUserIcon,
  Save as SaveIcon,
  Check as CheckIcon,
  ToggleOn as ToggleOnIcon,
} from "@mui/icons-material";

const Settings = () => {
  const { currentUser, updateProfile, upgradeToPremium, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  // Profile form
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    whatsappNumber: currentUser?.whatsappNumber || "",
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    dailyDigest: true,
    reminderNotifications: true,
    followUpSuggestions: true,
    emailNotifications: false,
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError("");
    setSuccess("");
  };

  // Handle profile input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Handle notification toggle changes
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({ ...notificationSettings, [name]: checked });
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // In a real app, this would be a call to your API through the auth context
      // await updateProfile(profileData);

      // For the demo, we'll just simulate it
      setTimeout(() => {
        setSuccess("Profile updated successfully");
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
      setLoading(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // In a real app, this would be a call to your API
      // await axios.put('/api/auth/change-password', passwordData);

      // For the demo, we'll just simulate it
      setTimeout(() => {
        setSuccess("Password updated successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error updating password:", err);
      setError("Failed to update password. Check your current password.");
      setLoading(false);
    }
  };

  // Handle notification settings update
  const handleNotificationUpdate = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // In a real app, this would be a call to your API
      // await axios.put('/api/user/notifications', notificationSettings);

      // For the demo, we'll just simulate it
      setTimeout(() => {
        setSuccess("Notification settings updated");
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error updating notification settings:", err);
      setError("Failed to update notification settings");
      setLoading(false);
    }
  };

  // Handle account upgrade
  const handleUpgradeToPremium = async () => {
    setUpgradeDialogOpen(false);
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // In a real app, this would be a call to your API through the auth context
      // await upgradeToPremium();

      // For the demo, we'll just simulate it
      setTimeout(() => {
        setSuccess("Account upgraded to premium successfully");
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error("Error upgrading account:", err);
      setError("Failed to upgrade account");
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setDeleteDialogOpen(false);
    setLoading(true);

    try {
      // In a real app, this would be a call to your API
      // await axios.delete('/api/auth/me');

      // For the demo, we'll just simulate it and logout
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Profile" icon={<PersonIcon />} iconPosition="start" />
            <Tab label="Security" icon={<VpnKeyIcon />} iconPosition="start" />
            <Tab
              label="Notifications"
              icon={<NotificationsIcon />}
              iconPosition="start"
            />
            <Tab
              label="Subscription"
              icon={<CreditCardIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Profile Tab */}
        {tabValue === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Box component="form" onSubmit={handleProfileUpdate} sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="WhatsApp Number"
                    name="whatsappNumber"
                    value={profileData.whatsappNumber}
                    onChange={handleProfileChange}
                    required
                    helperText="Include country code (e.g., +1234567890)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={
                      loading ? <CircularProgress size={20} /> : <SaveIcon />
                    }
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" gutterBottom>
              Danger Zone
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Account
            </Button>
          </Paper>
        )}

        {/* Security Tab */}
        {tabValue === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Box
              component="form"
              onSubmit={handlePasswordUpdate}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={
                      loading ? <CircularProgress size={20} /> : <VpnKeyIcon />
                    }
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}

        {/* Notifications Tab */}
        {tabValue === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Daily Digest"
                  secondary="Receive a summary of your reminders each morning"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    name="dailyDigest"
                    checked={notificationSettings.dailyDigest}
                    onChange={handleNotificationChange}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Reminder Notifications"
                  secondary="Get notified when it's time for a reminder"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    name="reminderNotifications"
                    checked={notificationSettings.reminderNotifications}
                    onChange={handleNotificationChange}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Follow-up Suggestions"
                  secondary="Get suggestions when you haven't spoken to someone in a while"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    name="followUpSuggestions"
                    checked={notificationSettings.followUpSuggestions}
                    onChange={handleNotificationChange}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive notifications via email (Premium feature)"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    name="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onChange={handleNotificationChange}
                    disabled={currentUser?.subscription !== "premium"}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>

            <Box mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNotificationUpdate}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <SaveIcon />
                }
              >
                {loading ? "Saving..." : "Save Preferences"}
              </Button>
            </Box>
          </Paper>
        )}

        {/* Subscription Tab */}
        {tabValue === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Current Plan
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {currentUser?.subscription === "premium"
                      ? "Premium Plan"
                      : "Free Plan"}
                  </Typography>
                  {currentUser?.subscription === "premium" && (
                    <Chip
                      label="Active"
                      color="success"
                      icon={<CheckIcon />}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
                <Typography variant="body2" paragraph>
                  {currentUser?.subscription === "premium"
                    ? "You are currently on the Premium plan with unlimited storage and access to all features."
                    : `You are currently on the Free plan with a limit of ${currentUser?.storageLimit} saved messages.`}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Storage Usage: {currentUser?.storageUsed} /{" "}
                    {currentUser?.storageLimit === 999999
                      ? "Unlimited"
                      : currentUser?.storageLimit}
                  </Typography>
                  <Box
                    sx={{
                      mt: 1,
                      bgcolor: "#e0e0e0",
                      borderRadius: 1,
                      height: 10,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: `${
                          currentUser?.subscription === "premium"
                            ? Math.min(
                                (currentUser?.storageUsed / 1000) * 100,
                                100
                              )
                            : Math.min(
                                (currentUser?.storageUsed /
                                  currentUser?.storageLimit) *
                                  100,
                                100
                              )
                        }%`,
                        bgcolor:
                          currentUser?.subscription === "premium"
                            ? "#4caf50"
                            : "#2196f3",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Free Plan
                  </Typography>
                  <Typography variant="h4" color="text.primary" sx={{ mb: 2 }}>
                    $0
                    <Typography variant="caption" color="text.secondary">
                      /month
                    </Typography>
                  </Typography>
                  <List dense sx={{ mb: 2 }}>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Limited memory size (50 saved messages)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Basic tagging and reminders" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Simple search functionality" />
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                  {currentUser?.subscription === "free" ? (
                    <Button variant="outlined" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button variant="outlined" color="primary">
                      Downgrade
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                elevation={3}
                sx={{
                  bgcolor: "primary.50",
                  borderColor: "primary.main",
                  borderWidth: 1,
                  borderStyle: "solid",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Premium Plan
                  </Typography>
                  <Typography variant="h4" color="text.primary" sx={{ mb: 2 }}>
                    $4.99
                    <Typography variant="caption" color="text.secondary">
                      /month
                    </Typography>
                  </Typography>
                  <List dense sx={{ mb: 2 }}>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Unlimited memory + priority storage" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Advanced search: semantic, voice-to-text queries" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary="AI-generated summaries of past chats" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Cross-device sync & Google Calendar integration" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary="'Auto-follow-up' generator: reminds and writes messages" />
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                  {currentUser?.subscription === "premium" ? (
                    <Button variant="contained" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ToggleOnIcon />}
                      onClick={() => setUpgradeDialogOpen(true)}
                    >
                      Upgrade Now
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Delete Account Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Account?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This action cannot be undone. All your data, including saved
              messages, contacts, and reminders, will be permanently deleted.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteAccount}
              color="error"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Deleting..." : "Delete My Account"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Upgrade Dialog */}
        <Dialog
          open={upgradeDialogOpen}
          onClose={() => setUpgradeDialogOpen(false)}
        >
          <DialogTitle>Upgrade to Premium</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You're about to upgrade to our Premium plan for $4.99/month.
              You'll get unlimited storage, advanced features, and priority
              support.
            </DialogContentText>
            <Box mt={3}>
              <Typography variant="subtitle2" gutterBottom>
                This is a demo application
              </Typography>
              <Typography variant="body2" color="textSecondary">
                No actual payment will be processed. In a real application, this
                would connect to a payment processor.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpgradeDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleUpgradeToPremium}
              color="primary"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Processing..." : "Confirm Upgrade"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Settings;
