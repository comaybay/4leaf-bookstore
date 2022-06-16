import { HStack, Input, ScrollView, VStack, Text, Heading, Center, Radio, Image, Button, TextArea, Box } from "native-base";
import useQuery from "../../utils/useQuery";
import useUserProfile from "../../utils/useUserProfile";
import { Pressable } from "react-native";

export default function MyOrder({ navigation }) {
  const { user } = useUserProfile();

  const query = supabase => supabase.from("order").select(`
    id, user_id, timestamp,
    shipping_method(method_name),
    order_item(book(title), quantity)
  `).eq("user_id", user.id);

  const [{ isLoading , result: orders }] = useQuery(query);

  return (
    <ScrollView p="4">
      <Box mb="10">
        {isLoading && (
          <Text color="primary.600" my="4" fontSize="lg">Loading...</Text>
        )}
        {!isLoading && orders.length == 0 && (
          <Center mt="40">
            <Pressable onPress={() => navigation.navigate("User Account")}>
              <Heading fontSize="xl" borderWidth="2" borderColor="primary.700" rounded="lg" py="2" px="8" color="primary.700">No order found.</Heading>
            </Pressable>
          </Center>
        )} 
        <VStack space="10">
          {!isLoading && orders.length > 0 && orders.map(o => 
          (
            <Box>
              <Text fontSize="md" color="primary.600">Timestamp: {o.timestamp}</Text>
              <Text mt="1" mb="2" fontSize="md">Shipping method: {o.shipping_method.method_name}</Text>
              <VStack width="100%" space="2" borderWidth="1" borderColor="gray.300">
                {o.order_item.map((oi, index) => (
                  <HStack px="2" py="1" alignItems="center" space="2" justifyContent="space-between" backgroundColor={index % 2 === 1 ? "gray.50" : "white"}>
                    <Text flexShrink="1" isTruncated fontWeight="semibold">{oi.book.title}</Text>
                    <Text flexShrink="0" color="primary.800">X {oi.quantity}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          )) }
        </VStack>
      </Box>
    </ScrollView>
  )
}