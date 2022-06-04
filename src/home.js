import { Box, Center, Heading, Image, Text, Icon, Input, Column, Row} from "native-base";
import React, { useEffect, useState } from "react";
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import useQuery from './utils/useQuery.js';
import Book from "./components/book.js";
import { FlatList, Pressable } from "react-native";

export default function Home({ navigation }) {
  const getBooks = (from, to) => supabase => {
    return supabase.from("random_book").select(`
      book_id, isbn13, title, num_pages, price,
      author(author_name),
      book_language(language_name)
      `).range(from, to);
  }
  const [current, setCurrent] = useState(12);
  const [{ isLoading, result }, setQuery] = useQuery(getBooks(0, current));
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!isLoading) {
      setBooks(books => [...books, ...result]);
    }
  }, [isLoading])

  const loadMoreBooks = () => {
    if (!isLoading) {
      console.log("loading more books...")
      setQuery(getBooks(current + 1, current + 12));
      setCurrent(c => c + 12)
    }
  }

  const images = [
    require(`../assets/home/best.png`),
    require(`../assets/home/action.png`),
    require(`../assets/home/horror.png`),
    require(`../assets/home/art.png`),
    require(`../assets/home/classic.png`),
    require(`../assets/home/drama.png`),
    require(`../assets/home/folklore.png`),
    require(`../assets/home/detective.png`),
    require(`../assets/home/journal.png`),
    require(`../assets/home/mystery.png`),
  ]

  return (
          <FlatList data={books} renderItem={(({ item }) => (
            <Book key={item.book_id} onPress={() => navigation.navigate('Book Details', { isbn13: item.isbn13 })} book={item} />
          ))}
            keyExtractor={(item) => item.book_id}
            onEndReached={loadMoreBooks}
            onEndReachedThreshold={1}
            ListHeaderComponent={
              (
                <Box key="1">
                  <Image source={require('../assets/home/bg.png')} alt="main background"
                    width="100%" height="32"
                  />
                  <Box px="4" width="100%">
                    <Pressable onPress={() => navigation.navigate("Search")}>
                      <Input my="4" width="100%" 
                        placeholder="Search books"
                        InputLeftElement={<Icon as={Feather} name="search" size={5} ml="2"></Icon>} />
                    </Pressable>
                    <Column>
                      <Row key="1" space="3" mb="3" justifyContent="space-between">
                        {
                          ["best", "action", "horror", "art", "classic"].map((n, i) => (
                            <Box key={n} py="2" flexGrow="1" w="60" alignItems="center" justifyContent="center" shadow="4">
                              <Image resizeMode="contain" size="60" source={images[i]} alt={n} />
                            </Box>
                          ))
                        }
                      </Row>
                      <Row key="2" space="3" mb="3" justifyContent="space-between">
                        {
                          ["drama", "folklore", "detective", "journal", "mystery"].map((n, i) => (
                            <Box key={n} py="2" flexGrow="1" w="60" alignItems="center" justifyContent="center" shadow="4">
                              <Image resizeMode="contain" size="60" source={images[i + 5]} alt={n} />
                            </Box>
                          ))
                        }
                      </Row>
                    </Column>
                    <Image source={require('../assets/home/bg2.png')} alt="books"
                      width="100%" height="32" mb="3"
                    />
                    <Heading color="primary.600" mb="3">Recommended for you</Heading>
                  </Box>
                </Box>
              )
            }
          ListFooterComponent={isLoading && (
            <Text py="4" color="primary.700" fontSize="2xl" bold textAlign="center">Loading...</Text>
          )}
          />
  );
}