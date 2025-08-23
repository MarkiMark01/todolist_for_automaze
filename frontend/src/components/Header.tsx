"use client";
import { Box, Flex, Heading } from "@chakra-ui/react";

export const Header = () => {
  return (
    <Box bg="gray.500" color="white" py={4} shadow="md">
      <Flex maxW="6xl" mx="auto" px={4} align="center" justify="space-between">
        <Heading size="md">TODO App for Automaze</Heading>
      </Flex>
    </Box>
  );
};
