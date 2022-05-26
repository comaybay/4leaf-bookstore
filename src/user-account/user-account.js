import { Box, Button, Center, Divider, Heading, HStack, Icon, Image, Input, Pressable, ScrollView, Text, VStack } from "native-base";
import { supabase } from "../utils/supabaseClient";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useState } from "react";
import Login from "./components/Login";

export default function UserAccount({ navigation }) {
  const user = supabase.auth.user();

  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <ScrollView py="8" px="8">
      {
        !user ? (<Login/>) 
          : (
            <Box border="1" borderRadius="md">
              <VStack space="4" divider={<Divider />}>
                <Box px="4" pt="4">
                  NativeBase
                </Box>
                <Box px="4">
                  NativeBase is a free and open source framework that enable developers
                  to build high-quality mobile apps using React Native iOS and Android
                  apps with a fusion of ES6.
                </Box>
                <Box px="4" pb="4">
                  GeekyAnts
                </Box>
              </VStack>
            </Box>
        )
      }
    </ScrollView>
  )
}