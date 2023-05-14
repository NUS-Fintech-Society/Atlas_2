import { Spinner } from '@chakra-ui/react'

const LoadingScreen = () => {
  return (
    <div className="bg-primary flex h-full items-center justify-center p-[23px] text-center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" size="xl" />
    </div>
  )
}

export default LoadingScreen
