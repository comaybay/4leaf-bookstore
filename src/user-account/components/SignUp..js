import { Box, Button, Center, Heading, HStack, Icon, Image, Input, Pressable, ScrollView, Text, VStack } from "native-base";
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../utils/supabaseClient";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const signUp = async () => {
    if (!(email && password && username)) {
      setErrorMsg(`You have not entered your ${email ? "" : ", email"}${password ? "" : ", password"}${username ? "" : ", username"}`.replace(", ", ""));
      return;
    }

    if (confirmPassword !== password) {
      setErrorMsg("Incorrect password confirmation");
      return;
    }

    setLoading(true);

    const { user, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    await supabase.from("profile").insert([{ id: user.id, name: username, address, phone}]);
    setLoading(false);

    //go back to user account.
    navigation.goBack();

    //switch to home stack nav
    navigation.navigate("Home");
  }

  return (
    <ScrollView py="8" px="8">
      <Center>
        <Heading color="primary.600" fontSize="4xl">
          Sign up
        </Heading>
        <VStack mt="4" space="4">
          <Input mx="1" value={email} onChangeText={text => setEmail(text)} placeholder="Email" InputLeftElement={
            <Icon as={<MaterialIcons name="email" />} ml="2"></Icon>
          } /> 
          <Input mx="1" value={username} onChangeText={text => setUsername(text)} placeholder="Username" InputLeftElement={
            <Icon as={<MaterialIcons name="person" />} ml="2"></Icon>
          } />
          <Input mx="1" type="password" value={password} onChangeText={text => setPassword(text)} placeholder="Password" InputLeftElement={
            <Icon as={<FontAwesome name="lock" />} ml="2"></Icon>
          } />
          <Input mx="1" type="password" value={confirmPassword} onChangeText={text => setConfirmPassword(text)} placeholder="Confirm Password" InputLeftElement={
            <Icon as={<FontAwesome name="lock" />} ml="2"></Icon>
          } />
          <Input mx="1" value={phone} onChangeText={text => setPhone(text.trim())} placeholder="Phone number (Not required)" InputLeftElement={
            <Icon as={<MaterialIcons name="phone" />} ml="2"></Icon>
          } />
          <Input mx="1" value={address} onChangeText={text => setAddress(text)} placeholder="Address (Not required)" InputLeftElement={
            <Icon as={<Ionicons name="md-location-sharp" />} ml="2"></Icon>
          } />
          
          <Text color="red.600" fontSize="xs">{errorMsg}</Text>
          <Button mx="1" onPress={signUp} isLoading={loading}>Sign up</Button>
          <HStack alignItems="center">
            <Image width="32" height="32" source={require('../../../assets/login.png')} alt="bg"/>
            <VStack flexShrink="1">
              <Text color="green.600" fontSize="xl">4Leaf Bookstore</Text>
              <Text color="blueGray.600" fontSize="xl">Everything Bookworms</Text>
              <Text color="blueGray.600" fontSize="xl">Need!</Text>
            </VStack>
          </HStack>
        </VStack>
      </Center>
    </ScrollView>
  )
}