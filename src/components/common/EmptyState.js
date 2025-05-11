import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";

/**
 * Reusable empty state component for when there's no data to display
 */
const EmptyState = ({
  title = "No items found",
  description = "There are no items to display.",
  icon: Icon,
  actionText,
  onAction,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "background.default",
        borderRadius: 2,
      }}
    >
      {Icon && (
        <Box sx={{ mb: 2, color: "text.secondary" }}>
          <Icon sx={{ fontSize: 60, opacity: 0.6 }} />
        </Box>
      )}

      <Typography variant="h6" color="textPrimary" gutterBottom>
        {title}
      </Typography>

      <Typography variant="body2" color="textSecondary" paragraph>
        {description}
      </Typography>

      {actionText && onAction && (
        <Button
          variant="contained"
          color="primary"
          onClick={onAction}
          sx={{ mt: 2 }}
        >
          {actionText}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;
