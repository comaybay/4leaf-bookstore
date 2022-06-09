import { HStack, Input, ScrollView, VStack, Text, Heading, Center, Radio, Image, Button, TextArea } from "native-base";
import { useEffect, useState } from "react";
import useQuery from "../utils/useQuery";
import useUserProfile from "../utils/useUserProfile";
import { useIsFocused } from '@react-navigation/native'
import { supabase } from "../utils/supabaseClient";
import { Pressable } from "react-native";

export default function Checkout({navigation}) {
  const { isProfileLoading, profile, user } = useUserProfile();

  const query = supabase => supabase.from("cart_item").select(`
    id, quantity,
    book(book_id, isbn13, title, price, author(author_name))
  `);

  const [{ isLoading: isCartLoading, result: cart }, setQuery] = useQuery(null);
  const [{ isLoading: isShippingMethodsLoading, result: shippingMethods }] = useQuery(
    supabase => supabase.from("shipping_method").select("*")
  );

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused && profile) {
      setQuery(query);
    }
  }, [isFocused, profile]);

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(1);
  const [processing, setProcessing] = useState(false);

  const missingInfo = (username.trim() === "" || address.trim() === "" || email === "" || phone === "")
  
  useEffect(() => {
    if (profile) {
      setUsername(profile.name);
      setPhone(profile.phone);  
      setEmail(user.email);
      setAddress(profile.address);
    }
  },
    [isProfileLoading]);

  
  async function handleConfirmOrder() {
    setProcessing(true);
    const { data } = await supabase.from("order").insert([{
      user_id: user.id,
      timestamp: new Date().toISOString().toLocaleString(),
      shipping_method_id: selectedShippingMethod,
      receiver_name: username,
      receiver_phone: phone,
      receiver_email: email,
      receiver_address: email
    }]);

    await supabase.from("order_item").insert(cart.map(item => ({
      book_id: item.book.book_id,
      quantity: item.quantity,
      order_id: data[0].id
    })));

    await supabase.from("cart_item").delete().match({user_id: user.id});

    navigation.navigate("Home", { screen: 'Home ' });
    setProcessing(false);
  }

  return (
    <ScrollView p="4" bgColor={profile ? "white" : "gray.100"}>
      {!profile || !cart && (
        <Text color="primary.600" my="4" fontSize="lg">Loading...</Text>
      )}
      {!isProfileLoading && !profile ? (
        <Center mt="40">
          <Pressable onPress={() => navigation.navigate("User Account")}>
            <Heading fontSize="xl" borderWidth="2" borderColor="primary.700" rounded="lg" py="2" px="8" color="primary.700">Sign in to use this feature</Heading>
          </Pressable>
        </Center>
      ) : (
          <>
            <Heading my="4" fontSize="lg">SHIPPING ADDRESS:</Heading>
            <VStack width="100%" space="2" alignItems="space-between">
              <HStack alignItems="center" space="2" justifyContent="space-between">
                <Text  width="100" fontWeight="semibold">Name:</Text>
                <Input flexGrow="1" value={username} onChangeText={text => setUsername(text)} />
              </HStack>
              <HStack alignItems="center" space="2" justifyContent="space-between">
                <Text width="100" fontWeight="semibold">Phone number:</Text>
                <Input flexGrow="1" value={phone} onChangeText={text => setPhone(text.trim())} />
              </HStack>
              <HStack alignItems="center" space="2" justifyContent="space-between">
                <Text width="100" fontWeight="semibold">Email:</Text>
                <Input flexGrow="1" value={email} onChangeText={text => setEmail(text.trim())} />
              </HStack>
              <HStack alignItems="start" space="2" justifyContent="space-between">
                <Text width="100" mt="1" fontWeight="semibold">Address:</Text>
                <TextArea flexGrow="1" value={address} onChangeText={text => setAddress(text)} />
              </HStack>
            {
              missingInfo && (
                <Text color="red.500">*Điền đầy đủ thông tin để tiếp tục</Text>
              )  
            }
          </VStack>
          <Heading mt="4" fontSize="lg">SHIPPING METHOD:</Heading>
          <Radio.Group 
            name="shippinngMethod"
            value={selectedShippingMethod}
            onChange={(option) => {
              setSelectedShippingMethod(option);
            }}
          >
            {!isShippingMethodsLoading &&
              shippingMethods.map(sm =>(
                <Radio key={sm.method_id} value={sm.method_id} my="1">
                  {`${sm.method_name}: $${sm.cost}`}
                </Radio>
              ))
            }
          </Radio.Group>
          <Heading my="4" fontSize="lg" bgColor="primary.600">CHECK ORDER:</Heading>
            {!isCartLoading && cart &&
            <>
              {
                cart.map(item => (
                  <HStack key={item.id} mb="4" width="100%">
                    <Image size="lg" mr="2" source={{ uri: `https://covers.openlibrary.org/b/isbn/${item.book.isbn13}-M.jpg` }} alt={item.book.title} />
                    <VStack flexGrow="1" flexShrink="1">
                      <Text isTruncated grow="0" width="100%" numberOfLines="2" bold>{item.book.title}</Text>
                      <Text isTruncated mr="2">{item.book.author.map(a => a.author_name).join(", ")}</Text>
                      <HStack alignItems="center" justifyContent="space-between">
                        <Text fontSize="lg" mr="2" color="primary.800">${item.book.price}</Text>
                        <Text mr="2" color="primary.800">Quantity: {item.quantity}</Text>
                      </HStack>
                    </VStack>
                  </HStack>
                ))
              }
              <Heading my="4" fontSize="lg" color="red.600">TOTAL PRICE:
                ${cart.map(item => (+item.book.price) * item.quantity).reduce((sum, curr) => sum + curr, 0).toFixed(2)}
              </Heading>
            </>
            }
          <Button isDisabled={isCartLoading || isProfileLoading || missingInfo || processing}
              onPress={handleConfirmOrder}
            >Confirm Order</Button>
          </>
        )}
    </ScrollView>
  )
}