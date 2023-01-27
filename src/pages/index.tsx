import React from 'react'
import { trpc } from '../utils/trpc'
import {
  ExcoMembersInfo,
  TopThreeInfo,
  MembersInfo,
} from './memberDashboard/constants'

import {
  Container,
  Input,
  Heading,
  Text,
  Grid,
  GridItem,
  Avatar,
  Box,
} from '@chakra-ui/react'

// const{data: roles} = trpc.useQuery(["memberdash.getRoles"]) -> this will give you an array of object, each object has only 1
// attribute called roles
//     console.log(roles)
//     {roles?.map((role,index) => {
//         const{data: memberinfo} = trpc.useQuery(["memberdash.getAll",{roles: role.roles}]) -> this is to use each role from the prev query
// to call the second query -> get all members info for this role, the output is also an array of object, each object has the person's info
//         console.log(memberinfo)
//     })}
const Member = () => {
  return (
    <Container centerContent padding="20px">
      {/* Link : https://bit.ly/dan-abramov */}
      <Avatar height="100px" width="100px" src="link" />
      <Container centerContent paddingTop="20px">
        <Text fontSize="20px" color="#FFFFFF">
          {' '}
          Name{' '}
        </Text>
        <Text fontSize="20px" color="#FFFFFF">
          {' '}
          Batch{' '}
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
              {/* <Members roles = {p.roles}/> */}
              {/* <Grid templateColumns='repeat(5,1fr)' gap='9'>
                {p.members.map((m, j) => {
                    return (
                        <GridItem colSpan={1} key={j}>
                          <Container centerContent padding='20px'>
                              <Avatar height='100px' width='100px'  src={m.image}/>
                              <Container centerContent paddingTop='20px'>
                              <Text fontSize='20px' color='#FFFFFF'>{m.name}</Text>
                              <Text fontSize='20px' color='#FFFFFF'>{m.batch}</Text>
                              </Container>
                      </Container>
                        </GridItem>
                    );
                  })}
                  </Grid> */}
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
      {/* <div className = "h-48 grid grid-cols-7 grid-rows-1 gap-4">
            <div className = " col-span-2 flex justify-center items-center">
                <p className = "text-3xl">Co-Directors</p></div>
            <div className = "flex flex-col justify-center items-center">
            <Avatar name='Dan Abrahmov' size='xl' src='https://bit.ly/dan-abramov' />
            <p className= 'text-xl'>name</p>
            <p>batch</p>
            </div>
        </div> */}
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
