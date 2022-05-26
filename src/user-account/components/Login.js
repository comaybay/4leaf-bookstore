import { Box, Button, Center, Heading, HStack, Icon, Image, Input, Pressable, Text, VStack } from "native-base";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../utils/supabaseClient";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const signIn = async () => {
    if (!(email && password)) {
      setErrorMsg(`You have not entered your ${email ? "" : ", email"}${password ? "" : ", password"}`.replace(", ", ""))
      return;
    }

    setLoading(true);

    let { error } = await supabase.auth.signIn({
      email,
      password
    });

    if (error) {
      setErrorMsg(error.message)
    }
    else {
      navigation.navigate("Home");
    }

    setLoading(false);
  }

  return (
    <Center>
      <Text fontSize="xs" color="blueGray.600">You are not logged in</Text>
      <Heading color="primary.600" fontSize="4xl">
        Sign in
      </Heading>
      <VStack mt="4" space="4">
        <Input value={email} onChangeText={text => setEmail(text)} placeholder="Username" InputLeftElement={
          <Icon as={<MaterialIcons name="person" />} ml="2"></Icon>
        } />
        <Input type={showPassword ? "text" : "password"} value={password} onChangeText={text => setPassword(text)} placeholder="Password" InputLeftElement={
          <Icon as={<FontAwesome name="lock" />} ml="2"></Icon>
        } InputRightElement={
          <Pressable onPress={() => setShowPassword(s => !s)}>
            <Icon as={<MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} mr="2"></Icon>
          </Pressable>
        } />
        <Text color="red.600" fontSize="xs">{errorMsg}</Text>
        <Button onPress={signIn} isLoading={loading}>Login</Button>
        <Button variant="link" onPress={() => navigation.navigate("Sign Up")}>Don't have an account? sign up!</Button>
        <HStack alignItems="center">
          <Image width="32" height="32" src={require(`../../../assets/login.png`)} />
          <VStack flexShrink="1">
            <Text color="green.600" fontSize="xl">4Leaf Bookstore</Text>
            <Text color="blueGray.600" fontSize="xl">Everything Bookworms Need!</Text>
          </VStack>
        </HStack>
      </VStack>
    </Center>
  )
}