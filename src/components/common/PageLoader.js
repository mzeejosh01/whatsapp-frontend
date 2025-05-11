import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

/**
 * Reusable page loading component
 */
const PageLoader = ({ message = "Loading..." }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <CircularProgress size={50} />
      <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default PageLoader;
