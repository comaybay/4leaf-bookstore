import { Box, Center, Heading, Image, Text, Icon, VStack, HStack, Button, ScrollView } from "native-base";
import React, { useEffect, useState } from "react";
import useQuery from '../utils/useQuery.js';
import { SupabaseClient } from "@supabase/supabase-js";
import useGoogleBooksAPI from "../utils/useGoogleBooksAPI.js";

export default function BookDetails({ navigation, route }) {
  
  /** @param {SupabaseClient} supabase */
  const getBook = supabase => supabase.from("book")
    .select(`
      isbn13, title, num_pages, price,
      author(author_name),
      book_language(language_name)
    `)
    .eq('isbn13', route.params.isbn13)
    .single();

  const [{ isLoading: isBookLoading, result: book }] = useQuery(getBook);
  const [{ isLoading: isInfoLoading, result: apiResult }] = useGoogleBooksAPI(route.params.isbn13);

  const info = apiResult?.items?.[0].volumeInfo;
  
  const [bookInfoItems, setBookInfoItems] = useState([])

  useEffect(() => {
    if (!isBookLoading) {
      setBookInfoItems(b => [
        ...b,
        { name: "Author", value: book.author.map(a => a.author_name).join(', ') },
        { name: "Number of pages", value: book.num_pages },
        { name: "Language", value: book.book_language.language_name },
        { name: "ISBN", value: book.isbn13 },
      ]);
    } 
  }, [isBookLoading])

  useEffect(() => {
    if (!isInfoLoading) {
      setBookInfoItems(b => [
        ...b,
        { name: "Publisher", value: info.publisher },
        { name: "Published date", value: info.publishedDate },
        { name: "Categories", value: info.categories.join(', ') },
      ])
    }
  }, [isInfoLoading])

  return (
    <ScrollView>
      {!isBookLoading && (
        <Box pb="8">
          <Image backgroundColor="blueGray.600" width="100%" height="300" resizeMode="contain" alt="books" source={`https://covers.openlibrary.org/b/isbn/${book.isbn13}-L.jpg`} />
          <VStack width="100%" mt="4" px="4">
            <Heading mt="4" semibold>{book.title}</Heading>
            <HStack mt="1" justifyContent="space-between">
              <Text fontSize="xl" bold color="primary.800">${book.price}</Text>
              <HStack space="2">
                <Button variant="outline">Add to cart</Button>
                <Button>Buy now</Button>
              </HStack>

            </HStack>
            <Heading mt="4" mb="2" color="primary.800">Book Information</Heading>
            {
              bookInfoItems.map((p, i) => (
                i % 2 == 0 ? (
                <Box px="4" py="2" bgColor="gray.100">
                    <Text isTruncated><Text bold>{p.name}:</Text> {p.value}</Text>
                </Box>) : (
                <Box px="4" py="2">
                      <Text isTruncated><Text bold>{p.name}:</Text> {p.value}</Text>
                </Box>
                )
              ))
            }
            {
              info && (<Text mt="4" semibold italic>{info.description}</Text>)
            }

          </VStack>
        </Box>
      )}
    </ScrollView>
  );
}