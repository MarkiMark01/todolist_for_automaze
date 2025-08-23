"use client";
import { Box, Text } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <Box bg="gray.100" py={4} mt={8} borderTop="1px solid #e2e8f0">
      <Text textAlign="center" color="gray.600" fontSize="sm">
  © {new Date().getFullYear()} Markiian Marych. All rights reserved.
</Text>
    </Box>
  );
};
