import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";
import axios from "axios";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
} from "@mui/material";
import {
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  People as PeopleIcon,
  LocalOffer as TagIcon,
} from "@mui/icons-material";
import Layout from "../components/Layout";
import { format } from "date-fns";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    messageCount: 0,
    contactCount: 0,
    reminderCount: 0,
    upcomingReminders: [],
  });
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, we would fetch this data from the API
        // For now, we'll simulate this with mock data

        setStats({
          messageCount: 152,
          contactCount: 23,
          reminderCount: 5,
          upcomingReminders: [
            {
              id: 1,
              title: "Follow up with John",
              reminderDate: new Date(Date.now() + 86400000),
              contact: { name: "John Smith" },
            },
            {
              id: 2,
              title: "Send project proposal",
              reminderDate: new Date(Date.now() + 172800000),
              contact: { name: "Sarah Johnson" },
            },
            {
              id: 3,
              title: "Meeting preparation",
              reminderDate: new Date(Date.now() + 259200000),
              contact: { name: "Team Meeting" },
            },
          ],
        });

        setRecentMessages([
          {
            id: 1,
            content: "Ill send you the invoice tomorrow.",
            contact: { name: "Alice Cooper" },
            important: true,
            createdAt: new Date(Date.now() - 3600000),
          },
          {
            id: 2,
            content: "Dont forget we need to meet on Thursday at 2pm.",
            contact: { name: "Bob Smith" },
            important: true,
            createdAt: new Date(Date.now() - 7200000),
          },
          {
            id: 3,
            content: "Thanks for your help yesterday!",
            contact: { name: "Carol White" },
            important: false,
            createdAt: new Date(Date.now() - 86400000),
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
          Welcome, {currentUser?.name}!
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Saved Messages
                </Typography>
                <Typography variant="h3">{stats.messageCount}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  component={Link}
                  to="/messages"
                >
                  View All
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Contacts
                </Typography>
                <Typography variant="h3">{stats.contactCount}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  component={Link}
                  to="/contacts"
                >
                  View All
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Reminders
                </Typography>
                <Typography variant="h3">{stats.reminderCount}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  component={Link}
                  to="/reminders"
                >
                  View All
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Content Sections */}
        <Grid container spacing={4}>
          {/* Recent Important Messages */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Important Messages
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {recentMessages.length > 0 ? (
                <List>
                  {recentMessages.map((message) => (
                    <ListItem key={message.id}>
                      <ListItemIcon>
                        <MessageIcon
                          color={message.important ? "primary" : "action"}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            noWrap
                            sx={{ maxWidth: "300px" }}
                          >
                            {message.content}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="textPrimary"
                            >
                              {message.contact.name}
                            </Typography>
                            {" - "}
                            {format(
                              new Date(message.createdAt),
                              "MMM d, h:mm a"
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No important messages yet.
                </Typography>
              )}

              <Box mt={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/messages"
                >
                  See All Messages
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Upcoming Reminders */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Reminders
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {stats.upcomingReminders.length > 0 ? (
                <List>
                  {stats.upcomingReminders.map((reminder) => (
                    <ListItem key={reminder.id}>
                      <ListItemIcon>
                        <NotificationsIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={reminder.title}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="textPrimary"
                            >
                              {reminder.contact.name}
                            </Typography>
                            {" - "}
                            {format(
                              new Date(reminder.reminderDate),
                              "MMM d, yyyy"
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No upcoming reminders.
                </Typography>
              )}

              <Box mt={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/reminders"
                >
                  Manage Reminders
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Storage Usage Section */}
        <Grid container sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Storage Usage
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box display="flex" alignItems="center">
                <Box width="100%" mr={1}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (currentUser?.storageUsed / currentUser?.storageLimit) *
                      100
                    }
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box minWidth={35}>
                  <Typography variant="body2" color="textSecondary">
                    {Math.round(
                      (currentUser?.storageUsed / currentUser?.storageLimit) *
                        100
                    )}
                    %
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ mt: 1 }}>
                {currentUser?.storageUsed} / {currentUser?.storageLimit}{" "}
                messages saved
              </Typography>

              {currentUser?.subscription === "free" && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  component={Link}
                  to="/settings"
                >
                  Upgrade to Premium
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

// This is a placeholder - we'd define this component properly in the real app
const LinearProgress = ({ value, sx }) => {
  return (
    <Box
      sx={{
        ...sx,
        bgcolor: "#e0e0e0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: `${value}%`,
          bgcolor: "#4caf50",
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
        }}
      />
    </Box>
  );
};

export default Dashboard;
