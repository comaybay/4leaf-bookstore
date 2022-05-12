import { Box, Button, Center, extendTheme, Heading, Image, NativeBaseProvider, Text, theme, Icon, Input, VStack, Column, Row, ScrollView, Container } from "native-base";
import React from "react";
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 

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

  const fakeBook = {
    name: "The Master Identity Thief",
    image_url: "https://covers.openlibrary.org/b/id/11669351-L.jpg",
    description: "Testimony and Solutions of an Expert WitnessTestimony and Solutions of an Expert WitnessTestimony and Solutions of an Expert WitnessTestimony and Solutions of an Expert Witness",
    rating: 4.5,
    price: 15
  }

  return (
    <NativeBaseProvider theme={customTheme}>
      <ScrollView>
        <Center>
          <Image source={require('./assets/home/bg.png')} alt="main background"
            width="100%" height="32"
          />
          <Box px="4" width="100%">
            <Input my="4" width="100%"
              placeholder="Search books"
              InputLeftElement={<Icon as={Feather} name="search" size={5} ml="2"></Icon>}/>
            <Column>
              <Row space="3" mb="3" justifyContent="space-between">
                {
                  ["best", "action", "horror", "art", "classic"].map(n => (
                    <Box key={n} py="2" flexGrow="1" w="60" alignItems="center" justifyContent="center" shadow="4">
                      <Image resizeMode="contain" size="60" source={require(`./assets/home/${n}.png`)} alt={n} />
                    </Box>
                  ))
                }
              </Row>
              <Row space="3" mb="3" justifyContent="space-between">
                {
                  ["drama", "folklore", "detective", "journal", "mystery"].map(n => (
                    <Box key={n} py="2" flexGrow="1" w="60" alignItems="center" justifyContent="center" shadow="4">
                      <Image resizeMode="contain" size="60" source={require(`./assets/home/${n}.png`)} alt={n} />
                    </Box>
                  ))
                }
              </Row>
            </Column>
            <Image source={require('./assets/home/bg2.png')} alt="books"
              width="100%" height="32" mb="3"
            />
            <Heading color="primary.600" mb="3">Recommended for you</Heading>
            <Column space="3">
              {
                [fakeBook, fakeBook, fakeBook].map(b => (
                  <Row>
                    <Image size="lg" mr="2" source={{ uri: b.image_url}}/>
                    <Column flexShrink="1" width="100%" justifyContent="space-between">
                      <Box>
                        <Text bold>{b.name}</Text>
                        <Text isTruncated noOfLines="2">{b.description}</Text>
                      </Box>

                      <Row mb="1" space="2" alignItems="center">
                        <Text fontSize="lg" mr="2" color="primary.800">${b.price}</Text>
                        <Icon as={<AntDesign name="star" size="32 " />} color="yellow.300"/>
                        <Text>{b.rating} / 5.0</Text>
                      </Row>
                    </Column>
                  </Row>
                ))
              }
            </Column>
          </Box>
        </Center>
      </ScrollView>
    </NativeBaseProvider>
  );
}