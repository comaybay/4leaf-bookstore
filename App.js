import { extendTheme, theme, NativeBaseProvider } from "native-base";
import Home from "./src/home";

export default function App() {
  const customTheme = extendTheme({
    colors: {
      // Add new color
      primary: theme.colors.blue
    },
    components: {
      Heading: {
        baseStyle: ({ colorMode }) => {
          return {
            color: colorMode === "dark" ? "emerald.300" : "emerald.600",
            fontWeight: "semibold",
          };
        },
      }
    }
  });

  return (
    <NativeBaseProvider theme={customTheme}>
      <Home/>
    </NativeBaseProvider>
  );
}