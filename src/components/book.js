export default function Book() {
  return (
    <Row>
      <Image size="lg" mr="2" source={{ uri: b.image_url }} />
      <Column flexShrink="1" width="100%" justifyContent="space-between">
        <Box>
          <Text bold>{b.name}</Text>
          <Text isTruncated noOfLines="2">{b.description}</Text>
        </Box>

        <Row mb="1" space="2" alignItems="center">
          <Text fontSize="lg" mr="2" color="primary.800">${b.price}</Text>
          <Icon as={<AntDesign name="star" size="32 " />} color="yellow.300" />
          <Text>{b.rating} / 5.0</Text>
        </Row>
      </Column>
    </Row>
  )
}