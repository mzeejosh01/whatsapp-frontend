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
  ListItemIcon,
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
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Label as LabelIcon,
  Tag as TagIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  MonetizationOn as MoneyIcon,
  Flag as FlagIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material";
import { SketchPicker } from "react-color";

// Mock for SketchPicker since we don't have the actual package
const MockColorPicker = ({ color, onChange }) => (
  <Box>
    <Box
      sx={{
        width: "36px",
        height: "36px",
        borderRadius: "4px",
        backgroundColor: color,
        cursor: "pointer",
        border: "1px solid #ccc",
      }}
      onClick={() => onChange({ hex: getRandomColor() })}
    />
    <Typography variant="caption" display="block" mt={1}>
      (Click to randomize color)
    </Typography>
  </Box>
);

// Generate random color for the mock
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Tags = () => {
  const { currentUser } = useAuth();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [messageCountsByTag, setMessageCountsByTag] = useState({});

  // Form data for new/edit tag
  const [formData, setFormData] = useState({
    name: "",
    color: "#3498db",
    category: "custom",
  });

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        // In a real app, this would be a call to your API
        // For now, we'll simulate this with mock data

        // Mock tags
        const mockTags = [
          {
            _id: "1",
            name: "Follow Up",
            color: "#e74c3c",
            category: "follow-up",
          },
          {
            _id: "2",
            name: "Important",
            color: "#f39c12",
            category: "important",
          },
          {
            _id: "3",
            name: "Personal",
            color: "#3498db",
            category: "personal",
          },
          { _id: "4", name: "Work", color: "#2ecc71", category: "work" },
          {
            _id: "5",
            name: "Money Owed",
            color: "#9b59b6",
            category: "financial",
          },
        ];

        // Mock message counts
        const mockCounts = {
          1: 12,
          2: 8,
          3: 5,
          4: 15,
          5: 3,
        };

        setTags(mockTags);
        setMessageCountsByTag(mockCounts);
        setError("");
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError("Failed to load tags");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  // Handle new tag dialog
  const handleNewTagClick = () => {
    setCurrentTag(null);
    setFormData({
      name: "",
      color: "#3498db",
      category: "custom",
    });
    setDialogOpen(true);
  };

  // Handle edit tag dialog
  const handleEditClick = (tag) => {
    setCurrentTag(tag);
    setFormData({
      name: tag.name,
      color: tag.color,
      category: tag.category,
    });
    setDialogOpen(true);
  };

  // Handle tag deletion
  const handleDeleteClick = async (id) => {
    // Check if tag is in use
    if (messageCountsByTag[id] && messageCountsByTag[id] > 0) {
      const confirmDelete = window.confirm(
        `This tag is used in ${messageCountsByTag[id]} messages. Deleting it will remove it from all messages. Continue?`
      );

      if (!confirmDelete) {
        return;
      }
    } else if (!window.confirm("Are you sure you want to delete this tag?")) {
      return;
    }

    try {
      // In a real app, this would be a call to your API
      // await axios.delete(`/api/tags/${id}`);

      // Update local state
      setTags(tags.filter((tag) => tag._id !== id));
    } catch (err) {
      console.error("Error deleting tag:", err);
      setError("Failed to delete tag");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle color change
  const handleColorChange = (color) => {
    setFormData({ ...formData, color: color.hex });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentTag) {
        // Edit existing tag
        // In a real app, this would be a call to your API
        // const res = await axios.put(`/api/tags/${currentTag._id}`, formData);

        // Update local state
        const updatedTag = { ...currentTag, ...formData };
        setTags(tags.map((t) => (t._id === currentTag._id ? updatedTag : t)));
      } else {
        // Add new tag
        // In a real app, this would be a call to your API
        // const res = await axios.post('/api/tags', formData);

        // Mock ID and create new tag
        const newTag = {
          _id: String(Date.now()),
          ...formData,
        };

        // Update local state
        setTags([...tags, newTag]);
      }

      // Close dialog
      setDialogOpen(false);
    } catch (err) {
      console.error("Error saving tag:", err);
      setError("Failed to save tag");
    }
  };

  // Create default tags
  const handleCreateDefaultTags = async () => {
    try {
      // In a real app, this would be a call to your API
      // const res = await axios.post('/api/tags/create-defaults');

      // Add default tags if they don't exist
      const defaultTags = [
        { name: "Follow Up", color: "#e74c3c", category: "follow-up" },
        { name: "Important", color: "#f39c12", category: "important" },
        { name: "Personal", color: "#3498db", category: "personal" },
        { name: "Work", color: "#2ecc71", category: "work" },
        { name: "Money Owed", color: "#9b59b6", category: "financial" },
      ];

      // Check for existing tags with the same name
      const newTags = defaultTags
        .filter(
          (defaultTag) =>
            !tags.some(
              (tag) => tag.name.toLowerCase() === defaultTag.name.toLowerCase()
            )
        )
        .map((tag, index) => ({
          _id: `default-${index + 1 + tags.length}`,
          ...tag,
        }));

      if (newTags.length === 0) {
        alert("All default tags already exist.");
        return;
      }

      // Update local state
      setTags([...tags, ...newTags]);
    } catch (err) {
      console.error("Error creating default tags:", err);
      setError("Failed to create default tags");
    }
  };

  // Get icon based on category
  const getCategoryIcon = (category) => {
    switch (category) {
      case "follow-up":
        return <FlagIcon />;
      case "important":
        return <LabelIcon />;
      case "personal":
        return <PersonIcon />;
      case "work":
        return <BusinessIcon />;
      case "financial":
        return <MoneyIcon />;
      default:
        return <TagIcon />;
    }
  };

  // Get category name
  const getCategoryName = (category) => {
    switch (category) {
      case "follow-up":
        return "Follow-up";
      case "important":
        return "Important";
      case "personal":
        return "Personal";
      case "work":
        return "Work";
      case "financial":
        return "Financial";
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
          <Typography variant="h4">Tags</Typography>
          <Box>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCreateDefaultTags}
              sx={{ mr: 2 }}
            >
              Add Default Tags
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleNewTagClick}
            >
              Add Tag
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tags Grid */}
        <Grid container spacing={3}>
          {tags.length > 0 ? (
            tags.map((tag) => (
              <Grid item xs={12} sm={6} md={4} key={tag._id}>
                <Card elevation={2}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        sx={{
                          bgcolor: tag.color,
                          width: 36,
                          height: 36,
                          mr: 2,
                        }}
                      >
                        {getCategoryIcon(tag.category)}
                      </Avatar>
                      <Typography variant="h6">{tag.name}</Typography>
                    </Box>

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Chip
                        label={getCategoryName(tag.category)}
                        size="small"
                        variant="outlined"
                      />
                      <Typography variant="body2" color="textSecondary">
                        {messageCountsByTag[tag._id] || 0} messages
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end" }}>
                    <IconButton onClick={() => handleEditClick(tag)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(tag._id)}>
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
                  No tags yet. Create your first tag or add default tags!
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Add/Edit Tag Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{currentTag ? "Edit Tag" : "Add New Tag"}</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Tag Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  <MenuItem value="custom">Custom</MenuItem>
                  <MenuItem value="follow-up">Follow-up</MenuItem>
                  <MenuItem value="important">Important</MenuItem>
                  <MenuItem value="personal">Personal</MenuItem>
                  <MenuItem value="work">Work</MenuItem>
                  <MenuItem value="financial">Financial</MenuItem>
                </Select>
              </FormControl>

              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Tag Color
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => setColorPickerOpen(!colorPickerOpen)}
                >
                  <Box
                    sx={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "4px",
                      backgroundColor: formData.color,
                      mr: 2,
                      border: "1px solid #ccc",
                    }}
                  />
                  <Typography variant="body2">{formData.color}</Typography>
                </Box>

                {colorPickerOpen && (
                  <Box mt={2}>
                    <MockColorPicker
                      color={formData.color}
                      onChange={handleColorChange}
                    />
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      mt={1}
                      display="block"
                    >
                      Note: In a real app, you'd have a proper color picker
                      here.
                    </Typography>
                  </Box>
                )}
              </Box>
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

export default Tags;
