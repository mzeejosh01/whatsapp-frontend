import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/Authcontext";
import Layout from "../components/Layout";
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
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert,
  ListItemIcon,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { format, differenceInDays } from "date-fns";

const Contacts = () => {
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [viewMode, setViewMode] = useState(0); // 0 = list, 1 = grid
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactDetailOpen, setContactDetailOpen] = useState(false);

  // Form data for new/edit contact
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    notes: "",
    dates: [],
  });

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        // In a real app, this would be a call to your API
        // For now, we'll simulate this with mock data
        // const res = await axios.get('/api/contacts');
        // setContacts(res.data);

        // Mock data
        const mockContacts = [
          {
            _id: "1",
            name: "John Smith",
            phoneNumber: "+12345678901",
            email: "john@example.com",
            notes: "Work colleague",
            dates: [
              {
                occasion: "birthday",
                date: new Date("1990-05-15"),
                reminder: true,
              },
            ],
            relationship: {
              lastInteraction: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              interactionFrequency: 7,
            },
            tags: [{ _id: "1", name: "Work", color: "#2ecc71" }],
          },
          {
            _id: "2",
            name: "Sarah Johnson",
            phoneNumber: "+12345678902",
            email: "sarah@example.com",
            notes: "Client from XYZ project",
            dates: [],
            relationship: {
              lastInteraction: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
              interactionFrequency: 14,
            },
            tags: [{ _id: "2", name: "Client", color: "#3498db" }],
          },
          {
            _id: "3",
            name: "Mike Wilson",
            phoneNumber: "+12345678903",
            email: "mike@example.com",
            notes: "Friend from college",
            dates: [
              {
                occasion: "birthday",
                date: new Date("1992-10-21"),
                reminder: true,
              },
            ],
            relationship: {
              lastInteraction: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              interactionFrequency: 5,
            },
            tags: [{ _id: "3", name: "Personal", color: "#9b59b6" }],
          },
        ];

        setContacts(mockContacts);
        setError("");
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setError("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Handle dialog open for new contact
  const handleNewContactClick = () => {
    setCurrentContact(null);
    setFormData({
      name: "",
      phoneNumber: "",
      email: "",
      notes: "",
      dates: [],
    });
    setDialogOpen(true);
  };

  // Handle dialog open for edit contact
  const handleEditClick = (contact) => {
    setCurrentContact(contact);
    setFormData({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      email: contact.email || "",
      notes: contact.notes || "",
      dates: contact.dates || [],
    });
    setDialogOpen(true);
  };

  // Handle contact deletion
  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      // In a real app, this would be a call to your API
      // await axios.delete(`/api/contacts/${id}`);

      // Update local state
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (err) {
      console.error("Error deleting contact:", err);
      setError("Failed to delete contact");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentContact) {
        // Edit existing contact
        // In a real app, this would be a call to your API
        // const res = await axios.put(`/api/contacts/${currentContact._id}`, formData);

        // Update local state
        const updatedContact = { ...currentContact, ...formData };
        setContacts(
          contacts.map((c) =>
            c._id === currentContact._id ? updatedContact : c
          )
        );
      } else {
        // Add new contact
        // In a real app, this would be a call to your API
        // const res = await axios.post('/api/contacts', formData);

        // Mock ID and create new contact
        const newContact = {
          _id: String(Date.now()),
          ...formData,
          relationship: {
            lastInteraction: new Date(),
            interactionFrequency: 7,
          },
          tags: [],
        };

        // Update local state
        setContacts([...contacts, newContact]);
      }

      // Close dialog
      setDialogOpen(false);
    } catch (err) {
      console.error("Error saving contact:", err);
      setError("Failed to save contact");
    }
  };

  // Handle contact detail view
  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setContactDetailOpen(true);
  };

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phoneNumber.includes(searchTerm) ||
      (contact.email &&
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate days since last interaction
  const getDaysSinceLastInteraction = (lastInteraction) => {
    return differenceInDays(new Date(), new Date(lastInteraction));
  };

  // Determine if we should suggest a follow-up
  const shouldSuggestFollowUp = (contact) => {
    const daysSinceLastInteraction = getDaysSinceLastInteraction(
      contact.relationship.lastInteraction
    );
    return daysSinceLastInteraction > contact.relationship.interactionFrequency;
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
          <Typography variant="h4">Contacts</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNewContactClick}
          >
            Add Contact
          </Button>
        </Box>

        {/* Search and view toggle */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Search contacts"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Tabs
                value={viewMode}
                onChange={(e, newValue) => setViewMode(newValue)}
                variant="fullWidth"
              >
                <Tab label="List" />
                <Tab label="Grid" />
              </Tabs>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Contacts List View */}
        {viewMode === 0 && (
          <Paper elevation={2}>
            {filteredContacts.length > 0 ? (
              <List>
                {filteredContacts.map((contact) => (
                  <ListItem
                    key={contact._id}
                    divider
                    button
                    onClick={() => handleContactClick(contact)}
                  >
                    <ListItemAvatar>
                      <Avatar>{contact.name.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <Typography variant="body1">
                            {contact.name}
                          </Typography>
                          {shouldSuggestFollowUp(contact) && (
                            <Chip
                              size="small"
                              color="secondary"
                              label="Follow up"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {contact.phoneNumber}
                          </Typography>
                          <Box mt={0.5}>
                            {contact.tags.map((tag) => (
                              <Chip
                                key={tag._id}
                                label={tag.name}
                                size="small"
                                style={{
                                  backgroundColor: tag.color,
                                  color: "white",
                                  marginRight: 5,
                                }}
                              />
                            ))}
                          </Box>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(contact);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(contact._id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box p={3} textAlign="center">
                <Typography variant="body1" color="textSecondary">
                  {searchTerm
                    ? "No contacts match your search."
                    : "No contacts yet. Add your first contact!"}
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        {/* Contacts Grid View */}
        {viewMode === 1 && (
          <Grid container spacing={3}>
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <Grid item xs={12} sm={6} md={4} key={contact._id}>
                  <Card
                    elevation={2}
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleContactClick(contact)}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ mr: 2 }}>{contact.name.charAt(0)}</Avatar>
                        <Typography variant="h6">{contact.name}</Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <PhoneIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {contact.phoneNumber}
                        </Typography>
                      </Box>

                      {contact.email && (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          mb={1}
                        >
                          {contact.email}
                        </Typography>
                      )}

                      <Box mt={2}>
                        {contact.tags.map((tag) => (
                          <Chip
                            key={tag._id}
                            label={tag.name}
                            size="small"
                            style={{
                              backgroundColor: tag.color,
                              color: "white",
                              marginRight: 5,
                              marginBottom: 5,
                            }}
                          />
                        ))}
                      </Box>

                      <Box mt={2} display="flex" justifyContent="flex-end">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(contact);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(contact._id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box p={3} textAlign="center">
                  <Typography variant="body1" color="textSecondary">
                    {searchTerm
                      ? "No contacts match your search."
                      : "No contacts yet. Add your first contact!"}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}

        {/* Add/Edit Contact Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {currentContact ? "Edit Contact" : "Add New Contact"}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <TextField
                fullWidth
                margin="normal"
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                helperText="Include country code (e.g., +1234567890)"
              />

              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Notes"
                name="notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
              />

              {/* TODO: Add UI for managing dates like birthdays */}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Contact Detail Dialog */}
        <Dialog
          open={contactDetailOpen}
          onClose={() => setContactDetailOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          {selectedContact && (
            <>
              <DialogTitle>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                    {selectedContact.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6">{selectedContact.name}</Typography>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <PhoneIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "text.secondary" }}
                      />
                      <Typography variant="body1">
                        {selectedContact.phoneNumber}
                      </Typography>
                    </Box>

                    {selectedContact.email && (
                      <Typography variant="body1" mb={1}>
                        {selectedContact.email}
                      </Typography>
                    )}
                  </Grid>

                  {selectedContact.notes && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Notes</Typography>
                      <Typography variant="body2" paragraph>
                        {selectedContact.notes}
                      </Typography>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Tags</Typography>
                    <Box my={1}>
                      {selectedContact.tags.map((tag) => (
                        <Chip
                          key={tag._id}
                          label={tag.name}
                          style={{
                            backgroundColor: tag.color,
                            color: "white",
                            margin: 3,
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>

                  {selectedContact.dates &&
                    selectedContact.dates.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">
                          Important Dates
                        </Typography>
                        <List dense>
                          {selectedContact.dates.map((date, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <CakeIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  date.occasion.charAt(0).toUpperCase() +
                                  date.occasion.slice(1)
                                }
                                secondary={format(
                                  new Date(date.date),
                                  "MMMM d, yyyy"
                                )}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                    )}

                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Interaction History
                    </Typography>
                    <Box mt={1}>
                      <Typography variant="body2">
                        Last interaction:{" "}
                        {format(
                          new Date(
                            selectedContact.relationship.lastInteraction
                          ),
                          "MMMM d, yyyy"
                        )}
                      </Typography>
                      <Typography variant="body2">
                        {getDaysSinceLastInteraction(
                          selectedContact.relationship.lastInteraction
                        )}{" "}
                        days since last contact
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<MessageIcon />}
                          onClick={() => {
                            // Navigate to messages with this contact
                            setContactDetailOpen(false);
                            // navigate(`/messages?contact=${selectedContact.phoneNumber}`);
                          }}
                        >
                          View Messages
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<NotificationsIcon />}
                          onClick={() => {
                            // Create a reminder for this contact
                            setContactDetailOpen(false);
                            // navigate(`/reminders/new?contact=${selectedContact._id}`);
                          }}
                        >
                          Set Reminder
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleEditClick(selectedContact)}>
                  Edit
                </Button>
                <Button onClick={() => setContactDetailOpen(false)}>
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Contacts;
