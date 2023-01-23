import { Square, Text, VStack } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import Head from 'next/head'
import React from 'react'

const RestrictedPage = () => {
  return (
    <>
      <Head>
        <title> Atlas | Restricted </title>
      </Head>
      <Square marginTop="10vh">
        <VStack spacing={4}>
          <WarningIcon w={12} h={12} color="red.500" />
          <Text fontSize="2xl">Restricted Access</Text>
        </VStack>
      </Square>
    </>
  )
}

export default RestrictedPage
