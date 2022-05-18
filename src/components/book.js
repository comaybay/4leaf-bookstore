import { Box, Column, Row, Text, Image } from "native-base";

export default function Book({ book: { title, isbn13, num_pages, price, author: authors, book_language: {language_name}}}) {
  const imageUrl = `https://covers.openlibrary.org/b/isbn/${isbn13}-M.jpg`
  return (
    <Row>
      <Image size="lg" mr="2" source={{ uri: imageUrl }} alt={title}/>
      <Column flexShrink="1" width="100%" justifyContent="space-between">
        <Box>
          <Text isTruncated bold>{title}</Text>
          {/* <Text {b.description}</Text> */}
          <Row>
            <Text fontSize="sm" isTruncated noOfLines="2" italic>{authors.map(a => a.author_name).join(", ")}</Text>
          </Row>

          <Row>
            <Text fontSize="xs" isTruncated mr="4">{num_pages} pages</Text>
            <Text fontSize="xs" isTruncated >Language: {language_name}</Text>
          </Row>
        </Box>

        <Row mb="1" space="2" alignItems="center">
          <Text fontSize="lg" mr="2" color="primary.800">${price}</Text>
          {/* <Icon as={<AntDesign name="star" size="32 " />} color="yellow.300" /> */}
          {/* <Text>{b.rating} / 5.0</Text> */}
        </Row>
      </Column>
    </Row>
  )
}