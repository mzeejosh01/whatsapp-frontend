import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  ListItemIcon,
  IconButton,
  Chip,
  TextField,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Grid,
  Divider,
  Menu,
  MenuItem,
  Alert,
} from "@mui/material";
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Delete as DeleteIcon,
  Label as LabelIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from "@mui/icons-material";
import { format } from "date-fns";

const Messages = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  const [filters, setFilters] = useState({
    onlyImportant: false,
    selectedTag: null,
  });
  const [sortOrder, setSortOrder] = useState("newest");

  const navigate = useNavigate();

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/messages");
        setMessages(res.data);
        setError("");
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("/api/tags");
        setTags(res.data);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };

    fetchTags();
  }, []);

  // Toggle message importance
  const handleToggleImportant = async (message) => {
    try {
      const res = await axios.put(`/api/messages/${message._id}/important`, {
        important: !message.important,
      });

      // Update the message in state
      setMessages(
        messages.map((m) =>
          m._id === message._id ? { ...m, important: !m.important } : m
        )
      );
    } catch (err) {
      console.error("Error toggling importance:", err);
    }
  };

  // Delete a message
  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      await axios.delete(`/api/messages/${id}`);

      // Remove message from state
      setMessages(messages.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  // Open tag dialog
  const handleOpenTagDialog = (message) => {
    setSelectedMessage(message);
    setTagDialogOpen(true);
  };

  // Add tag to message
  const handleAddTag = async (tagId) => {
    if (!selectedMessage) return;

    try {
      const res = await axios.put(`/api/messages/${selectedMessage._id}/tags`, {
        tagId,
        action: "add",
      });

      // Update the message in state
      setMessages(
        messages.map((m) => (m._id === selectedMessage._id ? res.data : m))
      );
    } catch (err) {
      console.error("Error adding tag:", err);
    }
  };

  // Remove tag from message
  const handleRemoveTag = async (messageId, tagId) => {
    try {
      const res = await axios.put(`/api/messages/${messageId}/tags`, {
        tagId,
        action: "remove",
      });

      // Update the message in state
      setMessages(messages.map((m) => (m._id === messageId ? res.data : m)));
    } catch (err) {
      console.error("Error removing tag:", err);
    }
  };

  // Handle search
  const handleSearch = () => {
    // For now, we'll do client-side filtering
    // In a real app with lots of data, you'd want to call the API endpoint
  };

  // Handle filter menu
  const handleFilterOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterMenuAnchor(null);
  };

  // Handle sort menu
  const handleSortOpen = (event) => {
    setSortMenuAnchor(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortMenuAnchor(null);
  };

  // Toggle "important only" filter
  const handleToggleImportantFilter = () => {
    setFilters({
      ...filters,
      onlyImportant: !filters.onlyImportant,
    });
    handleFilterClose();
  };

  // Set sort order
  const handleSetSortOrder = (order) => {
    setSortOrder(order);
    handleSortClose();
  };

  // Filter and sort messages
  const filteredMessages = messages
    .filter((message) => {
      // Text search
      const matchesSearch = searchTerm
        ? message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.contact.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      // Important filter
      const matchesImportant = filters.onlyImportant ? message.important : true;

      // Tag filter
      const matchesTag = filters.selectedTag
        ? message.tags?.some((tag) => tag._id === filters.selectedTag)
        : true;

      return matchesSearch && matchesImportant && matchesTag;
    })
    .sort((a, b) => {
      // Sort by date
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

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
        <Typography variant="h4" gutterBottom>
          Messages
        </Typography>

        {/* Search and filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8} md={9}>
              <TextField
                fullWidth
                label="Search messages"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} sm={2} md={1.5}>
              <Button
                fullWidth
                startIcon={<FilterIcon />}
                variant="outlined"
                onClick={handleFilterOpen}
              >
                Filter
              </Button>
              <Menu
                anchorEl={filterMenuAnchor}
                open={Boolean(filterMenuAnchor)}
                onClose={handleFilterClose}
              >
                <MenuItem onClick={handleToggleImportantFilter}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filters.onlyImportant}
                        onChange={handleToggleImportantFilter}
                      />
                    }
                    label="Important only"
                  />
                </MenuItem>
                <Divider />
                <MenuItem disabled>
                  <Typography variant="body2" color="textSecondary">
                    Filter by tag
                  </Typography>
                </MenuItem>
                {tags.map((tag) => (
                  <MenuItem
                    key={tag._id}
                    onClick={() => {
                      setFilters({ ...filters, selectedTag: tag._id });
                      handleFilterClose();
                    }}
                  >
                    <Chip
                      size="small"
                      label={tag.name}
                      style={{
                        backgroundColor: tag.color,
                        color: "white",
                        marginRight: 8,
                      }}
                    />
                    <Typography variant="body2">{tag.name}</Typography>
                  </MenuItem>
                ))}
                {filters.selectedTag && (
                  <MenuItem
                    onClick={() => {
                      setFilters({ ...filters, selectedTag: null });
                      handleFilterClose();
                    }}
                  >
                    <Typography color="error">Clear tag filter</Typography>
                  </MenuItem>
                )}
              </Menu>
            </Grid>
            <Grid item xs={6} sm={2} md={1.5}>
              <Button
                fullWidth
                startIcon={<SortIcon />}
                variant="outlined"
                onClick={handleSortOpen}
              >
                Sort
              </Button>
              <Menu
                anchorEl={sortMenuAnchor}
                open={Boolean(sortMenuAnchor)}
                onClose={handleSortClose}
              >
                <MenuItem
                  selected={sortOrder === "newest"}
                  onClick={() => handleSetSortOrder("newest")}
                >
                  Newest first
                </MenuItem>
                <MenuItem
                  selected={sortOrder === "oldest"}
                  onClick={() => handleSetSortOrder("oldest")}
                >
                  Oldest first
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Messages list */}
        <Paper elevation={2}>
          {filteredMessages.length > 0 ? (
            <List>
              {filteredMessages.map((message) => (
                <ListItem
                  key={message._id}
                  divider
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="tag"
                        onClick={() => handleOpenTagDialog(message)}
                      >
                        <LabelIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="toggle important"
                        onClick={() => handleToggleImportant(message)}
                      >
                        {message.important ? (
                          <StarIcon color="warning" />
                        ) : (
                          <StarBorderIcon />
                        )}
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteMessage(message._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        style={{ wordBreak: "break-word" }}
                      >
                        {message.content}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          <strong>{message.contact.name}</strong> -{" "}
                          {format(
                            new Date(message.createdAt),
                            "MMM d, yyyy h:mm a"
                          )}
                        </Typography>
                        <Box mt={1}>
                          {message.tags &&
                            message.tags.map((tag) => (
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
                                onDelete={() =>
                                  handleRemoveTag(message._id, tag._id)
                                }
                              />
                            ))}
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box p={3} textAlign="center">
              <Typography variant="body1" color="textSecondary">
                {searchTerm || filters.onlyImportant || filters.selectedTag
                  ? "No messages match your filters. Try adjusting your search or filters."
                  : "No messages saved yet. Start saving important conversations!"}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Tag Dialog */}
        <Dialog open={tagDialogOpen} onClose={() => setTagDialogOpen(false)}>
          <DialogTitle>Add Tags</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Select tags to add to this message:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag._id}
                  label={tag.name}
                  style={{ backgroundColor: tag.color, color: "white" }}
                  onClick={() => handleAddTag(tag._id)}
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTagDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Messages;
