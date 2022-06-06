import { Box, Center, Heading, Image, Text, Icon, VStack, HStack, Button, ScrollView, Input } from "native-base";
import React, { useEffect, useState } from "react";
import useQuery from '../utils/useQuery.js';
import { SupabaseClient } from "@supabase/supabase-js";
import useGoogleBooksAPI from "../utils/useGoogleBooksAPI.js";
import { supabase } from "../utils/supabaseClient.js";
import useUserProfile from "../utils/useUserProfile.js";

export default function BookDetails({ navigation, route }) {
  
  /** @param {SupabaseClient} supabase */
  const getBook = supabase => supabase.from("book")
    .select(`
      book_id, isbn13, title, num_pages, price,
      author(author_name),
      book_language(language_name)
    `)
    .eq('isbn13', route.params.isbn13)
    .single();

  const [{ isLoading: isBookLoading, result: book }] = useQuery(getBook);
  const [{ isLoading: isInfoLoading, result: apiResult }] = useGoogleBooksAPI(route.params.isbn13);

  const info = apiResult?.items?.[0].volumeInfo;
  
  const [bookInfoItems, setBookInfoItems] = useState([]);
  const [handling, setHandling] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
      setBookInfoItems(b => {
        const result = [
          ...b,
          { name: "Publisher", value: info.publisher },
          { name: "Published date", value: info.publishedDate },
        ]

        if (info.categories) {
          result.push({ name: "Categories", value: info.categories.join(', ') })
        }

        return result; 
      })
    }
  }, [isInfoLoading])

  async function handleAddToCart() {
    setHandling(true);
    const user = supabase.auth.user();
    if (!user) {
      navigation.navigate("User Account");
      setHandling(false);
      return;
    }

    const { data } = await supabase.from("cart_item").select("id, quantity").eq("book_id", book.book_id);

    if (data.length > 0) {
      const item = data[0]; 
      await supabase.from("cart_item").update({quantity: quantity + (+item.quantity)}).match({id: item.id});
    }
    else {
      await supabase.from("cart_item").insert([{ user_id: user.id, book_id: book.book_id, quantity }]);
    }
    setHandling(false);
  }

  async function handleBuyNow() {
    await handleAddToCart();
    navigation.navigate("Cart");
  }

  return (
    <ScrollView>
      {!isBookLoading && (
        <Box pb="8">
          <Image backgroundColor="blueGray.600" width="100%" height="300" resizeMode="contain" alt="books" source={`https://covers.openlibrary.org/b/isbn/${book.isbn13}-L.jpg`} />
          <VStack width="100%" mt="4" px="4">
            <Heading mt="4" semibold>{book.title}</Heading>
            <HStack mt="1" justifyContent="space-between">
              <Text fontSize="xl" bold color="primary.800">${book.price}</Text>
              <VStack>
                <HStack justifyContent="end" alignItems="center">
                  <Text fontSize="md">Quantity: </Text>
                  <Button variant="outline" onPress={() => setQuantity(q => Math.max(1, q - 1))}><Text fontWeight="bold">-</Text></Button>
                  <Input width="12" isDisabled fontSize="lg" value={quantity}/>
                  <Button variant="outline" onPress={() => setQuantity(q => Math.min(99, q + 1))}><Text fontWeight="bold">+</Text></Button>
                </HStack>
                <HStack mt="2" space="2">
                  <Button isDisabled={handling} onPress={handleAddToCart} variant="outline">Add to cart</Button>
                  <Button isDisabled={handling} onPress={handleBuyNow}>Buy now</Button>
                </HStack>
              </VStack>

            </HStack>
            <Heading mt="4" mb="2" color="primary.800">Book Information</Heading>
            {
              bookInfoItems.map((p, i) => (
                i % 2 == 0 ? (
                <Box key={p.name} px="4" py="2" bgColor="gray.100">
                    <Text isTruncated><Text bold>{p.name}:</Text> {p.value}</Text>
                </Box>) : (
                <Box key={p.name} px="4" py="2">
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