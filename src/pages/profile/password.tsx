import {
  Box,
  Heading,
  Flex,
  InputGroup,
  Input,
  FormControl,
  FormLabel,
  Button,
  Spacer,
} from '@chakra-ui/react'

import Head from 'next/head'
import { useSession } from 'next-auth/react'

const ChangePasswordPage = () => {
  useSession({ required: true })

  return (
    <>
      <Head>
        <title>Change Password</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div>
          <Box
            p={8}
            w="100%"
            maxWidth="768px"
            borderWidth={1}
            borderRadius={16}
            boxShadow="lg"
            _hover={{ boxShadow: '2xl' }}
            transition="all 1s"
          >
            <Flex flexDirection="column" alignItems="start">
              <Flex
                mb={8}
                w="100%"
                alignItems="center"
                justifyContent="space-between"
              >
                <Heading as="h1" size="2xl" textAlign="center">
                  Change Password
                </Heading>
                <Spacer></Spacer>
              </Flex>
              <FormControl mt={4}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type="password" />
                </InputGroup>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input type="password" />
                </InputGroup>
              </FormControl>
              <Button
                mt={10}
                size="lg"
                isLoading={false}
                type="submit"
                alignSelf="stretch"
              >
                Confirm Change
              </Button>
            </Flex>
          </Box>
        </div>
      </div>
    </>
  )
}

export default ChangePasswordPage
