import React, { useState } from 'react'
import { trpc } from '../utils/trpc'
import ProfileInfoModal from '../components/users/ProfileModal'
import type { Session } from 'next-auth'
import Head from 'next/head'
import HamburgerNavbar from '~/components/common/HamburgerNavbar'

import {
  Container,
  Input,
  Heading,
  Text,
  Grid,
  GridItem,
  Avatar,
  useDisclosure,
} from '@chakra-ui/react'

const Member = ({ session, id }: { session: Session; id: string }) => {
  const [selected, setSelected] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data } = trpc.member.getMemberProfile.useQuery(id)
  return (
    <Container centerContent>
      <ProfileInfoModal
        session={session}
        isOpen={isOpen}
        onClose={onClose}
        studentId={selected}
      />
      <Avatar
        height="100px"
        width="100px"
        src={data?.user.image == null ? undefined : data?.user.image}
        onClick={(e) => {
          e.preventDefault()
          setSelected(id)
          onOpen()
        }}
      />
      <Container centerContent>
        <Text fontSize="25px" color="#FFFFFF">
          {data?.user.roles}
        </Text>
        <Text fontSize="20px" color="#FFFFFF">
          {data?.user.name}
        </Text>
        <Text fontSize="20px" color="#FFFFFF">
          {data?.user.batch}
        </Text>
      </Container>
    </Container>
  )
}

const MemberBoard = ({ session, department }: { session: Session, department: string }) => {
  const { data } = trpc.member.getUsersfromDepartment.useQuery({department: department})
  return (
    <div>
      <Container centerContent paddingTop="20px" bg="black">
        <Text fontSize="40px" color="#FF9900">
          {department}
        </Text>
      </Container>
      <Grid
        height="300px"
        templateColumns="repeat(7,1fr)"
        gap="9"
        paddingTop="30px"
        paddingStart="150px"
        paddingEnd="150px"
      >
        {data?.map((p, i) => {
          return (
            <GridItem colStart={2*i+2} colEnd={2*i+3} key={i}>
              <Member session={session} id={p.id.toString()} />
            </GridItem>
          )
        })}
      </Grid>
    </div>
  )
}

export default function dashboard({ session }: { session: Session }) {
  return (
    <div>
      <Head>
        <title>Atlas</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The home page for Atlas" />
      </Head>
      <HamburgerNavbar />
      <Grid templateColumns="repeat(6,1fr)">
        <GridItem colStart={3} colEnd={5}>
          <Container centerContent>
            <Heading fontSize="56px"> Our Members </Heading>
          </Container>
        </GridItem>
        <GridItem colSpan={2}>
          <Container centerContent paddingTop="20px">
            <Input
              borderRadius="10px"
              placeholder="Search"
              borderColor="#FF9900"
              size="sm"
              htmlSize={35}
              width="auto"
            />
          </Container>
        </GridItem>
      </Grid>

      <MemberBoard session={session} department="EXCO"/>
      <MemberBoard session={session} department="Software Development"/>
    </div>
  )
}
