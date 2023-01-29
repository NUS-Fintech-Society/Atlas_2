import React from 'react'
import { trpc } from '../utils/trpc'
import {
  ExcoMembersInfo,
  TopThreeInfo,
} from '../components/users/Constants'

import {
  Container,
  Input,
  Heading,
  Text,
  Grid,
  GridItem,
  Avatar,
} from '@chakra-ui/react'

const Member = () => {
  return (
    <Container centerContent padding="20px">
      <Avatar height="100px" width="100px" src="link" />
      <Container centerContent paddingTop="20px">
        <Text fontSize="20px" color="#FFFFFF">
          Name
        </Text>
        <Text fontSize="20px" color="#FFFFFF">
          Batch
        </Text>
      </Container>
    </Container>
  )
}

const ExcoBoard = () => {
  return (
    <div>
      <Container centerContent paddingTop="20px">
        <Text fontSize="40px" color="#FF9900">
          EXCO
        </Text>
      </Container>

      <Grid
        height="600px"
        templateRows="repeat(2,1fr)"
        templateColumns="repeat(7,1fr)"
        gap="9"
        paddingTop="30px"
        paddingStart="150px"
        paddingEnd="150px"
      >
        {TopThreeInfo.map((p, i) => {
          return (
            <GridItem colStart={2 * i + 2} colEnd={2 * i + 3} key={i}>
              <Container centerContent padding="20px">
                <Avatar height="100px" width="100px" src={p.image} />
                <Container centerContent paddingTop="20px">
                  <Text fontSize="25px" color="#FFFFFF">
                    {' '}
                    {p.role}{' '}
                  </Text>
                  <Text fontSize="20px" color="#FFFFFF">
                    {' '}
                    {p.name}
                  </Text>
                  <Text fontSize="20px" color="#FFFFFF">
                    {' '}
                    {p.batch}
                  </Text>
                </Container>
              </Container>
            </GridItem>
          )
        })}

        {ExcoMembersInfo.map((p, i) => {
          return (
            <GridItem rowStart={2} rowSpan={1} colSpan={1} key={i}>
              <Container centerContent padding="20px">
                <Avatar height="100px" width="100px" src={p.image} />
                <Container centerContent paddingTop="20px">
                  <Text fontSize="25px" color="#FFFFFF">
                    {' '}
                    {p.role}{' '}
                  </Text>
                  <Text fontSize="20px" color="#FFFFFF">
                    {' '}
                    {p.name}
                  </Text>
                  <Text fontSize="20px" color="#FFFFFF">
                    {' '}
                    {p.batch}
                  </Text>
                </Container>
              </Container>
            </GridItem>
          )
        })}
      </Grid>
    </div>
  )
}

const MemberBoard = () => {
  const { data: roles } = trpc.member.getRoles.useQuery()
  return (
    <div>
      <Container centerContent paddingTop="20px" bg="black">
        <Text fontSize="40px" color="#FF9900">
          Software Development
        </Text>
      </Container>
      <Grid
        height="600px"
        templateColumns="repeat(7,1fr)"
        gap="9"
        paddingTop="30px"
        paddingStart="150px"
        paddingEnd="150px"
      >
        {roles?.map((p, i) => {
          return (
            <GridItem colSpan={2} rowStart={i + 1} key={i}>
              <Container centerContent paddingTop="50px">
                <Text fontSize="30px" color="#FFFFFF">
                  {p.roles}
                </Text>
              </Container>
            </GridItem>
          )
        })}

        {roles?.map((p, i) => {
          return (
            <GridItem colSpan={5} rowStart={i + 1} key={i}>
            </GridItem>
          )
        })}
      </Grid>
    </div>
  )
}

export default function dashboard() {
  return (
    <div>
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

      <ExcoBoard />
      <MemberBoard />
    </div>
  )
}
