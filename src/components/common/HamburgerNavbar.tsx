import { Button } from '@chakra-ui/react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { signOut } from 'next-auth/react'
import { Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { trpc } from '../../utils/trpc'

const navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'User', href: '/users', current: false },
  { name: 'Events', href: '/events/create', current: false },
  { name: 'Sign Out', href: '/api/auth/signout', current: false },
]

const ProfileIcon = ({
  image,
  defaultImage,
  onClick,
}: {
  image: string
  defaultImage: string
  onClick: () => void
}) => {
  return (
    <Button
      variant="ghost"
      _hover={{ bg: 'rgb(31 41 55)' }}
      padding="0"
      borderRadius="full"
      onClick={onClick}
    >
      <Image
        alt="profile-pic"
        src={image}
        fallbackSrc={defaultImage}
        objectFit="cover"
        borderRadius="full"
        boxSize="25px"
      />
    </Button>
  )
}

export default function HamburgerNavbar({ studentId }: { studentId: string }) {
  const router = useRouter()
  const defaultImage = '/fintech_logo.png'
  const [profileBtnImage, setProfileBtnImage] = useState(defaultImage)
  const redirectToProfile = () => {
    router.push('/profile')
  }
  const redirectHome = () => {
    router.push('/')
  }

  trpc.member.getMemberImage.useQuery(studentId, {
    refetchOnWindowFocus: false,
    onSuccess(data) {
      if (!data || !data.image) return
      setProfileBtnImage(data.image)
    },
  })

  return (
    <Disclosure as="nav" className="sticky top-0 z-10 w-full bg-[#01003D]">
      {({ open }) => (
        <>
          <div className="flex h-16 items-center justify-between px-2">
            <Button
              variant="ghost"
              _hover={{ bg: 'None' }}
              padding="0"
              onClick={redirectHome}
            >
              <Image
                src="/fintech_logo.png"
                alt="fintech-logo"
                objectFit="contain"
                boxSize="100px"
              />
            </Button>
            <div className="inset-y-0 flex items-center">
              {/* Profile Menu */}
              <ProfileIcon
                image={profileBtnImage}
                defaultImage={defaultImage}
                onClick={redirectToProfile}
              />
              {/* Mobile menu button*/}
              <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-800">
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XMarkIcon
                    stroke="white"
                    className="block h-6 w-6"
                    aria-hidden="true"
                  />
                ) : (
                  <Bars3Icon
                    stroke="white"
                    className="block h-6 w-6"
                    aria-hidden="true"
                  />
                )}
              </Disclosure.Button>
            </div>
          </div>

          <Disclosure.Panel>
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  className="block w-full rounded px-3 py-2 text-left text-white hover:bg-gray-800"
                  aria-current={item.current ? 'page' : undefined}
                  onClick={
                    item.name === 'Sign Out'
                      ? async (e: React.MouseEvent<HTMLButtonElement>) => {
                          e.preventDefault()
                          await signOut()
                        }
                      : () => router.push(item.href)
                  }
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
