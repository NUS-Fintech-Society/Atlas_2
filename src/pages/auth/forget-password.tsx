import {
  Heading,
  Flex,
  Icon,
  InputGroup,
  Input,
  InputRightAddon,
  FormControl,
  FormLabel,
  Button,
  Spacer,
} from '@chakra-ui/react'
import { BsArrowLeftShort } from 'react-icons/bs'
import Container from '~/components/auth/Container'
import Head from 'next/head'
import Link from 'next/link'

const ForgotPasswordPage = () => {
  return (
    <>
      <Head>
        <title>Forgot Password</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Flex flexDirection="column" alignItems="start">
          <Flex mb={8} w="100%" alignItems="center" justifyContent="center">
            <Link href="/auth/login">
              <Icon as={BsArrowLeftShort} boxSize={12} />
            </Link>
            <Heading as="h1" size="2xl" textAlign="center">
              Forgot Password
            </Heading>
            <Spacer></Spacer>
          </Flex>
          <FormControl>
            <FormLabel>NUS Email</FormLabel>
            <InputGroup>
              <Input type="email" />
              <InputRightAddon>@u.nus.edu</InputRightAddon>
            </InputGroup>
          </FormControl>
          <Button
            mt={10}
            size="lg"
            isLoading={false}
            type="submit"
            alignSelf="stretch"
          >
            Send Reset Link
          </Button>
        </Flex>
      </Container>
    </>
  )
}

export default ForgotPasswordPage
