import { extendTheme, theme, NativeBaseProvider, Box } from "native-base";
import Home from "./src/home";
import 'react-native-url-polyfill/auto';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookDetails from "./src/book-details/book-detail";

const Stack = createNativeStackNavigator(); 
export default function App() {
  const customTheme = extendTheme({
    colors: {
      // primary: theme.colors.blue
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
    <NavigationContainer theme={{colors: {background: '#fff'}}}>
      <NativeBaseProvider theme={customTheme}>
         <Box height="100vh">
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#3c96cf',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Book Details" component={BookDetails} />
            </Stack.Navigator>
          </Box>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}