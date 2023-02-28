import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'

const navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'User', href: '/users', current: false },
  { name: 'Events', href: '/events/create', current: false },
  { name: 'Sign Out', href: '/api/auth/signout', current: false },
]

export default function HamburgerNavbar() {
  const router = useRouter()
  return (
    <Disclosure as="nav" className="sticky top-0 z-10 w-full bg-[#01003D]">
      {({ open }) => (
        <>
          <div className="flex h-16 items-center justify-between px-2">
            <Image
              src="/fintech_logo.png"
              alt="fintech-logo"
              width={100}
              height={100}
            />
            <div className="inset-y-0 flex items-center">
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
