import { Box, Center, Heading, Image, NativeBaseProvider, Text, Icon, Input, Column, Row, ScrollView} from "native-base";
import React, { useEffect, useState } from "react";
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import useQuery from './utils/useQuery.js';
import Book from "./components/book.js";

export default function Home() {
  const query = supabase => {
    return supabase.from("random_book").select(`
      isbn13, title, num_pages, price,
      author(author_name),
      book_language(language_name)
      `).limit(6);
  }
  const [{ isLoading, result }, setQuery] = useQuery(query);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (result) {
      setBooks(books => [...books, ...result]);
      console.log([...books, ...result])
    }
  }, [result])

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  return (
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            setQuery(query);
          }
        }}
        scrollEventThrottle={400}
      >
        <Center>
          <Image source={require('../assets/home/bg.png')} alt="main background"
            width="100%" height="32"
          />
          <Box px="4" width="100%">
            <Input my="4" width="100%"
              placeholder="Search books"
              InputLeftElement={<Icon as={Feather} name="search" size={5} ml="2"></Icon>} />
            <Column>
              <Row space="3" mb="3" justifyContent="space-between">
                {
                  ["best", "action", "horror", "art", "classic"].map(n => (
                    <Box key={n} py="2" flexGrow="1" w="60" alignItems="center" justifyContent="center" shadow="4">
                      <Image resizeMode="contain" size="60" source={require(`../assets/home/${n}.png`)} alt={n} />
                    </Box>
                  ))
                }
              </Row>
              <Row space="3" mb="3" justifyContent="space-between">
                {
                  ["drama", "folklore", "detective", "journal", "mystery"].map(n => (
                    <Box key={n} py="2" flexGrow="1" w="60" alignItems="center" justifyContent="center" shadow="4">
                      <Image resizeMode="contain" size="60" source={require(`../assets/home/${n}.png`)} alt={n} />
                    </Box>
                  ))
                }
              </Row>
            </Column>
            <Image source={require('../assets/home/bg2.png')} alt="books"
              width="100%" height="32" mb="3"
            />
            <Heading color="primary.600" mb="3">Recommended for you</Heading>
            <Column space="3">
            {books.map(b => <Book key={b.isbn13} book={b}/>) }
            </Column>
          </Box>
        </Center>
      </ScrollView>
  );
}