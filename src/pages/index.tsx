import Head from 'next/head'
import TopNavbar from '~/components/common/TopNavbar'
import React, { useState } from 'react'
import withAuth, { type BaseProps } from '~/utils/withAuth'
import { Box, Circle, Grid, GridItem, Heading, Input } from '@chakra-ui/react'

const HomePage: React.FC<BaseProps> = ({ session }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const data = [
    {
      id: 1,
      role: 'Pres1',
      name: 'Test1',
      batch: 'AY22/23',
    },
    {
      id: 2,
      role: 'Pres2',
      name: 'Test2',
      batch: 'AY22/23',
    },
    {
      id: 3,
      role: 'Pres3',
      name: 'Test3',
      batch: 'AY22/23',
    },
    {
      id: 4,
      role: 'Pres4',
      name: 'Test4',
      batch: 'AY22/23',
    },
    {
      id: 5,
      role: 'Pres5',
      name: 'Test5',
      batch: 'AY22/23',
    },
    {
      id: 6,
      role: 'Pres6',
      name: 'Test6',
      batch: 'AY22/23',
    },
    {
      id: 7,
      role: 'Pres7',
      name: 'Test7',
      batch: 'AY22/23',
    },
    {
      id: 8,
      role: 'Pres8',
      name: 'Test8',
      batch: 'AY22/23',
    },
    {
      id: 9,
      role: 'Pres9',
      name: 'Test9',
      batch: 'AY22/23',
    },
    {
      id: 10,
      role: 'Pres10',
      name: 'Test10',
      batch: 'AY22/23',
    },
  ]

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Head>
        <title>Atlas</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The home page for Atlas" />
      </Head>
      <TopNavbar
        isAdmin={session.isAdmin}
        image={session.user?.image as string}
      />
      <div className="flex flex-col bg-[#B1A6DB] p-16">
        <h1 className="text-left text-[50px] font-bold leading-none md:text-[88px]">
          Our
        </h1>
        <div className="mb-4"></div>
        <h1 className="text-left text-[50px]  font-bold leading-none md:text-[88px]">
          Members
        </h1>
      </div>
      <Input
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        borderWidth="3px"
        w={{ base: '150px', md: '300px' }}
        border="3px solid #F9813E"
        borderColor="#F9813E"
        borderRadius="10px"
        className="mt-10 ml-8 mb-4"
        _placeholder={{
          pl: { base: '65px', lg: '210px' },
          fontStyle: 'italic',
        }}
      />
      <Heading
        fontWeight="600"
        fontSize={{ base: '36px', md: '44px', lg: '55px' }}
        lineHeight={{ base: '42px', md: '50px', lg: '66px' }}
        textAlign="center"
        color="#002D70"
      >
        EXCO
      </Heading>
      <Box
        overflowY="auto"
        maxHeight="40vh"
        sx={{
          '&::-webkit-scrollbar': {
            width: '30px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: `#004B90`,
            borderRadius: '20px',
            border: '5px solid transparent',
            backgroundClip: 'content-box',
          },
        }}
        className="p-16"
      >
        <Grid
          templateColumns={{
            base: 'repeat(3, 1fr)',
            md: 'repeat(21, 1fr)',
          }}
          gridGap={{ base: '4' }}
          gridRowGap={{ base: '4', md: '12' }}
        >
          {/* Top row */}
          {[...filteredData.slice(0, 3)].map((item) => (
            <GridItem
              key={item.id}
              colSpan={{ md: 7 }}
              className="justify-content-center flex flex-col"
            >
              {
                <div className="flex flex-col items-center">
                  <Circle
                    size={{ base: '75px', md: '100px' }}
                    borderRadius="50%"
                    border="5px solid #97AEFF"
                    bgImage="url('https://via.placeholder.com/150')"
                    bgSize="cover"
                    bgPos="center center"
                  />
                  <h1 className="text-lg font-bold text-[#002D70]">
                    {item.role}
                  </h1>
                  <span className="text-lg text-[#002D70]">{item.name}</span>
                  <span className="text-lg text-[#002D70]">{item.batch}</span>
                </div>
              }
            </GridItem>
          ))}

          {/* Bottom row */}
          {[...filteredData.slice(3)].map((item) => (
            <GridItem
              key={item.id}
              colSpan={{ md: 3 }}
              className="align-items-center flex flex-col"
            >
              {
                <div className="flex flex-col items-center">
                  <Circle
                    size={{ base: '75px', md: '100px' }}
                    borderRadius="50%"
                    border="5px solid #97AEFF"
                    bgImage="url('https://via.placeholder.com/150')"
                    bgSize="cover"
                    bgPos="center center"
                  />
                  <span className="text-lg font-bold text-[#002D70]">
                    {item.role}
                  </span>
                  <span className="text-lg text-[#002D70]">{item.name}</span>
                  <span className="text-lg text-[#002D70]">{item.batch}</span>
                </div>
              }
            </GridItem>
          ))}
        </Grid>
      </Box>
    </>
  )
}

export default withAuth(HomePage)
