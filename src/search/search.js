import { Box, Center, Heading, Image, Text, Icon, Input, Column, Row } from "native-base";
import React, { useEffect, useState } from "react";
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import useQuery from '../utils/useQuery.js';
import Book from "../components/book.js";
import { FlatList } from "react-native";

export default function Search({ navigation }) {
  const getBooks = (query, pageNum) => supabase => {
    return supabase.rpc("book_search", { query, page_num: pageNum}).select(`
      book_id, isbn13, title, num_pages, price,
      author(author_name),
      book_language(language_name)
      `);
  }

  const resultHandler = result => {
    if (result.data.length > 0) {
      setBooks(books => [...books, ...result.data]);
    }
    else {
      setOutOfPage(true);
    }
  } 
  const [pageNum, setPageNum] = useState(0);
  const [outOfPage, setOutOfPage] = useState(false);
  const [{ isLoading }, setQuery] = useQuery(null);
  const [books, setBooks] = useState([]);
  const [input, setInput] = useState("");

  const loadMoreBooks = () => {
    if (!isLoading && !outOfPage) {
      setPageNum(c => {
        setQuery(getBooks(input, c + 1), resultHandler);
        return c + 1
      });
    }
  }

  const handleSubmit = ({ nativeEvent }) => {
    setBooks([]);
    setPageNum(0);
    const text = nativeEvent.text.trim();
    if (text !== "") {
      setQuery(getBooks(nativeEvent.text.trim(), 0), resultHandler);
    }
  }

  return (
    <Box mb="20">
       <Box key="1">
            <Box px="4" width="100%">
              <Input my="4" width="100%"
                value={input} onChangeText={text => setInput(text)} onSubmitEditing={handleSubmit}
                placeholder="Search books"
                InputLeftElement={<Icon as={Feather} name="search" size={5} ml="2"></Icon>} />
            </Box>
          </Box>
      <FlatList data={books} renderItem={(({ item }) => (
        <Book key={item.book_id} onPress={() => navigation.navigate('Book Details', { isbn13: item.isbn13 })} book={item} />
      ))}
        keyExtractor={(item) => item.book_id}
        onEndReached={loadMoreBooks}
        onEndReachedThreshold={1}
        ListFooterComponent={isLoading && (
          <Text py="4" color="primary.700" fontSize="2xl" bold textAlign="center">Loading...</Text>
        )}
      />
    </Box>
  );
}