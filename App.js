import { extendTheme, theme, NativeBaseProvider, Box, VStack, Icon } from "native-base";
import Home from "./src/home";
import 'react-native-url-polyfill/auto';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookDetails from "./src/book-details/book-detail";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import UserAccount from "./src/user-account/user-account";

const Stack = createNativeStackNavigator(); 
const Tab = createBottomTabNavigator();
const navContainerTheme = { colors: { background: '#fff', border: "#0000" } };
const headerTheme = {
  headerStyle: { backgroundColor: theme.colors.primary[600] },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

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

export default function App() {
  const [selected, setSelected] = useState(1);
  return (
    <NativeBaseProvider theme={customTheme}>
      <Box flexGrow="1" flexShrink="0" height="100vh" overflow="hidden">
        <NavigationContainer theme={navContainerTheme}>
          <FooterNav/>
        </NavigationContainer>
      </Box>
    </NativeBaseProvider>
  );
}

function FooterNav() {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {

            if (route.name === 'Home') {
              return <Icon as={<Ionicons name={focused ? "book" : "book-outline"} />} color="white" size="sm" opacity={focused ? 1 : 0.5} />;
            }
            else if (route.name === 'Search') {
              return <Icon as={<MaterialIcons name="search" />} color="white" size="sm" opacity={focused ? 1 : 0.5} />
            }
            else if (route.name === 'Cart') {
              return <Icon as={<MaterialCommunityIcons name={focused ? "cart" : "cart-outline"} />} color="white" size="sm" opacity={focused ? 1 : 0.5} />
            }
            else if (route.name === 'User Account') {
              return <Icon as={<MaterialCommunityIcons name={focused ? "account" : "account-outline"} />} color="white" size="sm" opacity={focused ? 1 : 0.5} />
            }
          },
          ...headerTheme,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.primary[600]
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#fff8',
        })}
      >
        <Tab.Screen name="Home" component={HomeNav} />
        <Tab.Screen name="Search" component={Home} />
        <Tab.Screen name="Cart" component={Home} />
        <Tab.Screen name="User Account" component={UserAccountNav} />
      </Tab.Navigator>
  )
}

function HomeNav() {
  return (
    <Stack.Navigator screenOptions={headerTheme}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Book Details" component={BookDetails} />
    </Stack.Navigator>
  )
}

function UserAccountNav() {
  return (
    <Stack.Navigator screenOptions={headerTheme}>
      <Stack.Screen name="User Account" component={UserAccount} />
    </Stack.Navigator>
  )
}