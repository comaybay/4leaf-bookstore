import { Box, Button, Center, Divider, Heading, HStack, Icon, Image, Input, Pressable, ScrollView, Text, VStack } from "native-base";
import { supabase } from "../utils/supabaseClient";
import { MaterialIcons, MaterialCommunityIcons, FontAwesome, Ionicons} from '@expo/vector-icons';
import { useState } from "react";
import Login from "./components/Login";
import useUserProfile from "../utils/useUserProfile"

export default function UserAccount({ navigation }) {
  const { user, isProfileLoading, profile } = useUserProfile();

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error.message);
    }
  }

  return (
    <ScrollView py="8" px="8" bgColor="gray.100">
      {!isProfileLoading &&
        (!profile ? (
          <Login onSuccess={() => {
            navigation.navigate("Home");
           }}
          />) 
          : (
          <Box border="1" borderRadius="md">
            <VStack space="2" alignItems="center">
              <Box px="10" py="2" rounded="lg" shadow="4" bgColor="white">
                <Heading textAlign="center" bold color="primary.700" fontSize="xl" px="4" pt="4">
                  {profile.name}
                </Heading>
                <Text mt="1" bold color="primary.900" textAlign="center">Diamond Membership</Text>
              </Box>
              <HStack mt="3" width="100%" alignItems="center" justifyContent="center" px="4" py="2" space="2" rounded="lg" bgColor="white" shadow="1">
                <Icon as={<MaterialIcons name="email" />} size="6" color="primary.700"></Icon>
                <Text bold>Email:</Text>
                <Text>{user.email}</Text>
              </HStack>
              <HStack width="100%" alignItems="center" justifyContent="center" px="4" py="2" space="2" rounded="lg" bgColor="white" shadow="1">
                <Icon as={<Ionicons name="md-location-sharp" />} size="6" color="primary.700"></Icon>
                <Text bold>Address:</Text>
                <Text>{profile.address}</Text>
              </HStack>
              <HStack width="100%" alignItems="center" justifyContent="center" px="4" py="2" space="2" rounded="lg" bgColor="white" shadow="1">
                <Icon as={<MaterialIcons name="phone" />} size="6" color="primary.700"></Icon>
                <Text bold>Phone number:</Text>
                <Text>{profile.phone || "None"}</Text>
              </HStack>
              <Button mt="3" width="100%" leftIcon={<Icon as={<MaterialCommunityIcons name="clipboard-list-outline" />} size="6" color="white"></Icon>}>
                <Text bold color="white">My order</Text>
              </Button>
              <Button width="100%" leftIcon={<Icon as={<MaterialIcons name="logout" />} size="6" color="white"></Icon>} colorScheme="red"
                onPress={logOut}>
                <Text bold color="white">Log out</Text>
              </Button>
            </VStack>
          </Box>
        ))
      }
    </ScrollView>
  )
}