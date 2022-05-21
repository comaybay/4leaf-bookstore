import { Box, Center, Heading, Image, Text, Icon, VStack, HStack, Button } from "native-base";
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
  const [{ isLoading: isInfoLoading, result: info }] = useGoogleBooksAPI(route.params.isbn13);

  return (
    <Box>
      {!isBookLoading && (
        <>
          <VStack width="100%" mt="4" px="4">
            <Image width="100%" height="300" resizeMode="contain" alt="books" source={`https://covers.openlibrary.org/b/isbn/${book.isbn13}-L.jpg`} />
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
              [
                { name: "Author", value: book.author.map(a => a.author_name).join(', ') },
                { name: "Number of pages", value: book.num_pages },
                { name: "Language", value: book.book_language.language_name },
                { name: "ISBN", value: book.isbn13 },
              ].map((p, i) => (
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
              !isInfoLoading && info.items.length > 0 && (
                <Text mt="4" semibold italic>{info.items[0].volumeInfo.description}</Text>
              )
            }

          </VStack>
        </>
      )}
    </Box>
  );
}