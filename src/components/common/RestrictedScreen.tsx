import { Square, Text, VStack } from '@chakra-ui/react'
import { Button } from '~/components/utilities'
import { WarningIcon } from '@chakra-ui/icons'
import React from 'react'
import { useRouter } from 'next/router'

export default function RestrictedScreen() {
  const router = useRouter()
  const redirectBack = () => {
    router.back()
  }

  return (
    <Square marginTop="10vh">
      <VStack spacing={4}>
        <WarningIcon w={12} h={12} color="red.500" />
        <Text fontSize="2xl">Restricted Access</Text>
        <Button className="mt-2 self-stretch shadow-md" onClick={redirectBack}>
          Go back
        </Button>
      </VStack>
    </Square>
  )
}
