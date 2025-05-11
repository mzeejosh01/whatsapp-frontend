import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/Authcontext";
import Layout from "../components/Layout";
import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  TextField,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Tab,
  Tabs,
  Alert,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Notifications as NotificationsIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  format,
  isToday,
  isPast,
  addDays,
  isThisWeek,
  isFuture,
} from "date-fns";

// Mock for LocalizationProvider since we don't have the actual package
const MockDatePicker = ({ label, value, onChange }) => (
  <TextField
    fullWidth
    label={label}
    type="date"
    value={value ? value.toISOString().split("T")[0] : ""}
    onChange={(e) => onChange(new Date(e.target.value))}
    InputLabelProps={{ shrink: true }}
    margin="normal"
  />
);

const Reminders = () => {
  const { currentUser } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);
  const [tabValue, setTabValue] = useState(0); // 0 = all, 1 = today, 2 = upcoming, 3 = completed
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Form data for new/edit reminder
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contactId: "",
    reminderDate: new Date(),
    recurring: {
      isRecurring: false,
      frequency: "monthly",
    },
    status: "pending",
  });

  // Fetch reminders and contacts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, these would be calls to your API
        // For now, we'll simulate this with mock data

        // Mock contacts
        const mockContacts = [
          { _id: "1", name: "John Smith", phoneNumber: "+12345678901" },
          { _id: "2", name: "Sarah Johnson", phoneNumber: "+12345678902" },
          { _id: "3", name: "Mike Wilson", phoneNumber: "+12345678903" },
        ];

        // Mock reminders
        const mockReminders = [
          {
            _id: "1",
            title: "Follow up on project proposal",
            description: "Check if they reviewed the proposal",
            contact: { _id: "2", name: "Sarah Johnson" },
            reminderDate: addDays(new Date(), 1),
            recurring: {
              isRecurring: false,
            },
            status: "pending",
            createdAt: new Date(),
          },
          {
            _id: "2",
            title: "Send invoice",
            description: "Send monthly invoice",
            contact: { _id: "1", name: "John Smith" },
            reminderDate: new Date(),
            recurring: {
              isRecurring: true,
              frequency: "monthly",
            },
            status: "pending",
            createdAt: new Date(),
          },
          {
            _id: "3",
            title: "Birthday",
            description: "Mike's birthday",
            contact: { _id: "3", name: "Mike Wilson" },
            reminderDate: addDays(new Date(), -2),
            recurring: {
              isRecurring: true,
              frequency: "yearly",
            },
            status: "completed",
            createdAt: new Date(),
          },
        ];

        setContacts(mockContacts);
        setReminders(mockReminders);
        setError("");
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load reminders");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle new reminder dialog
  const handleNewReminderClick = () => {
    setCurrentReminder(null);
    setFormData({
      title: "",
      description: "",
      contactId: "",
      reminderDate: new Date(),
      recurring: {
        isRecurring: false,
        frequency: "monthly",
      },
      status: "pending",
    });
    setDialogOpen(true);
  };

  // Handle edit reminder dialog
  const handleEditClick = (reminder) => {
    setCurrentReminder(reminder);
    setFormData({
      title: reminder.title,
      description: reminder.description || "",
      contactId: reminder.contact._id,
      reminderDate: new Date(reminder.reminderDate),
      recurring: reminder.recurring || {
        isRecurring: false,
        frequency: "monthly",
      },
      status: reminder.status,
    });
    setDialogOpen(true);
  };

  // Handle reminder deletion
  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reminder?")) {
      return;
    }

    try {
      // In a real app, this would be a call to your API
      // await axios.delete(`/api/reminders/${id}`);

      // Update local state
      setReminders(reminders.filter((reminder) => reminder._id !== id));
    } catch (err) {
      console.error("Error deleting reminder:", err);
      setError("Failed to delete reminder");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle recurring toggle
  const handleRecurringToggle = (e) => {
    setFormData({
      ...formData,
      recurring: {
        ...formData.recurring,
        isRecurring: e.target.checked,
      },
    });
  };

  // Handle recurring frequency change
  const handleFrequencyChange = (e) => {
    setFormData({
      ...formData,
      recurring: {
        ...formData.recurring,
        frequency: e.target.value,
      },
    });
  };

  // Handle reminder date change
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      reminderDate: date,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentReminder) {
        // Edit existing reminder
        // In a real app, this would be a call to your API
        // const res = await axios.put(`/api/reminders/${currentReminder._id}`, formData);

        // Find the contact for display
        const contact = contacts.find((c) => c._id === formData.contactId);

        // Update local state
        const updatedReminder = {
          ...currentReminder,
          ...formData,
          contact: contact,
        };

        setReminders(
          reminders.map((r) =>
            r._id === currentReminder._id ? updatedReminder : r
          )
        );
      } else {
        // Add new reminder
        // In a real app, this would be a call to your API
        // const res = await axios.post('/api/reminders', formData);

        // Find the contact for display
        const contact = contacts.find((c) => c._id === formData.contactId);

        // Mock ID and create new reminder
        const newReminder = {
          _id: String(Date.now()),
          ...formData,
          contact: contact,
          createdAt: new Date(),
        };

        // Update local state
        setReminders([...reminders, newReminder]);
      }

      // Close dialog
      setDialogOpen(false);
    } catch (err) {
      console.error("Error saving reminder:", err);
      setError("Failed to save reminder");
    }
  };

  // Handle mark as completed
  const handleMarkCompleted = async (reminder) => {
    try {
      // In a real app, this would be a call to your API
      // const res = await axios.put(`/api/reminders/${reminder._id}/status`, { status: 'completed' });

      // Update local state
      const updatedReminder = { ...reminder, status: "completed" };
      setReminders(
        reminders.map((r) => (r._id === reminder._id ? updatedReminder : r))
      );
    } catch (err) {
      console.error("Error updating reminder status:", err);
      setError("Failed to update reminder status");
    }
  };

  // Handle mark as dismissed
  const handleMarkDismissed = async (reminder) => {
    try {
      // In a real app, this would be a call to your API
      // const res = await axios.put(`/api/reminders/${reminder._id}/status`, { status: 'dismissed' });

      // Update local state
      const updatedReminder = { ...reminder, status: "dismissed" };
      setReminders(
        reminders.map((r) => (r._id === reminder._id ? updatedReminder : r))
      );
    } catch (err) {
      console.error("Error updating reminder status:", err);
      setError("Failed to update reminder status");
    }
  };

  // Filter reminders based on tab
  const filteredReminders = reminders.filter((reminder) => {
    const reminderDate = new Date(reminder.reminderDate);

    switch (tabValue) {
      case 0: // All
        return true;
      case 1: // Today
        return isToday(reminderDate) && reminder.status === "pending";
      case 2: // Upcoming
        return isFuture(reminderDate) && reminder.status === "pending";
      case 3: // Past
        return (
          isPast(reminderDate) &&
          !isToday(reminderDate) &&
          reminder.status === "pending"
        );
      case 4: // Completed
        return reminder.status === "completed";
      default:
        return true;
    }
  });

  // Color based on status
  const getStatusColor = (reminder) => {
    const reminderDate = new Date(reminder.reminderDate);

    if (reminder.status === "completed") {
      return "success.main";
    } else if (reminder.status === "dismissed") {
      return "text.disabled";
    } else if (isPast(reminderDate) && !isToday(reminderDate)) {
      return "error.main";
    } else if (isToday(reminderDate)) {
      return "warning.main";
    } else {
      return "info.main";
    }
  };

  // Get recurring text
  const getRecurringText = (recurring) => {
    if (!recurring || !recurring.isRecurring) {
      return "One-time";
    }

    switch (recurring.frequency) {
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      case "yearly":
        return "Yearly";
      default:
        return "Custom";
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">Reminders</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNewReminderClick}
          >
            Add Reminder
          </Button>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="All" />
            <Tab
              label={
                <Box display="flex" alignItems="center">
                  <span>Today</span>
                  <Chip
                    size="small"
                    label={
                      reminders.filter(
                        (r) =>
                          isToday(new Date(r.reminderDate)) &&
                          r.status === "pending"
                      ).length
                    }
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                </Box>
              }
            />
            <Tab label="Upcoming" />
            <Tab label="Past" />
            <Tab label="Completed" />
          </Tabs>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Reminders List */}
        <Grid container spacing={3}>
          {filteredReminders.length > 0 ? (
            filteredReminders.map((reminder) => (
              <Grid item xs={12} sm={6} md={4} key={reminder._id}>
                <Card elevation={2}>
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="flex-start"
                      justifyContent="space-between"
                    >
                      <Box display="flex" alignItems="center" mb={1}>
                        <Avatar
                          sx={{
                            bgcolor: getStatusColor(reminder),
                            width: 32,
                            height: 32,
                            mr: 1,
                          }}
                        >
                          <NotificationsIcon sx={{ fontSize: 16 }} />
                        </Avatar>
                        <Typography
                          variant="h6"
                          noWrap
                          sx={{ maxWidth: "150px" }}
                          title={reminder.title}
                        >
                          {reminder.title}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={getRecurringText(reminder.recurring)}
                        color={
                          reminder.recurring?.isRecurring
                            ? "secondary"
                            : "default"
                        }
                        variant={
                          reminder.recurring?.isRecurring
                            ? "filled"
                            : "outlined"
                        }
                      />
                    </Box>

                    {reminder.description && (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        paragraph
                      >
                        {reminder.description}
                      </Typography>
                    )}

                    <Box display="flex" alignItems="center" mb={1}>
                      <TodayIcon
                        sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="textSecondary">
                        {format(
                          new Date(reminder.reminderDate),
                          "MMMM d, yyyy"
                        )}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center">
                      <PersonIcon
                        sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="textSecondary">
                        {reminder.contact.name}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end" }}>
                    {reminder.status === "pending" && (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => handleMarkCompleted(reminder)}
                          title="Mark as completed"
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleMarkDismissed(reminder)}
                          title="Dismiss"
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(reminder)}
                      title="Edit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(reminder._id)}
                      title="Delete"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body1" color="textSecondary">
                  {tabValue === 0
                    ? "No reminders yet. Add your first reminder!"
                    : tabValue === 1
                    ? "No reminders for today."
                    : tabValue === 2
                    ? "No upcoming reminders."
                    : tabValue === 3
                    ? "No past reminders."
                    : "No completed reminders."}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Add/Edit Reminder Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {currentReminder ? "Edit Reminder" : "Add New Reminder"}
          </DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />

              <TextField
                fullWidth
                margin="normal"
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Contact</InputLabel>
                <Select
                  name="contactId"
                  value={formData.contactId}
                  onChange={handleInputChange}
                  required
                  label="Contact"
                >
                  <MenuItem value="">Select a contact</MenuItem>
                  {contacts.map((contact) => (
                    <MenuItem key={contact._id} value={contact._id}>
                      {contact.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Using the mock component since we don't have the actual package */}
              <MockDatePicker
                label="Reminder Date"
                value={formData.reminderDate}
                onChange={handleDateChange}
              />

              <Box mt={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.recurring.isRecurring}
                      onChange={handleRecurringToggle}
                    />
                  }
                  label="Recurring Reminder"
                />
              </Box>

              {formData.recurring.isRecurring && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    name="frequency"
                    value={formData.recurring.frequency}
                    onChange={handleFrequencyChange}
                    label="Frequency"
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              )}

              {currentReminder && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="dismissed">Dismissed</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Reminders;
