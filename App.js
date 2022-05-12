import { Box, Button, Center, Container, extendTheme, Heading, NativeBaseProvider, Text, theme } from "native-base";
import React from "react";

export default function App() {
  const customTheme = extendTheme({
    colors: {
      // Add new color
      primary: theme.colors.green
    },
  });

  return (
    <NativeBaseProvider theme={customTheme}>
       <Center>
        <Container  >
          <Heading>
            A component library for the
            <Text color="emerald.500"> React Ecosystem</Text>
          </Heading>
          <Text mt="3" fontWeight="medium">
            NativeBase is a simple, modular and accessible component library that
            gives you building blocks to build you React applications.
          </Text>
          <Button>Bruh</Button>
        </Container>
      </Center>
    </NativeBaseProvider>
  );
}