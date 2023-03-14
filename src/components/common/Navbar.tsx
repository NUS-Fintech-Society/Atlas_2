import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'


export default function Navbar() {
    return (
      <div  className="sticky top-0 z-10 w-full bg-[#01003D]">
            <div className="flex h-20 items-center justify-between px-2">
              <div className='m-4'>
              <Image
                src="/fintech_logo.png"
                alt="fintech-logo"
                width={100}
                height={100}
              />
              </div>
                {TabConfig.map((item) => (
                    <Tab name = {item.name} href = {item.href} >
                    </Tab>
              ))}

            </div>
            </div>
    )
}

const handleSignout = async() => {
  signOut()
}

const Tab = ({ name, href }: TabProps) => {
    if (name != 'Sign Out') {
     return (
      <div className='text-center text-white'>
        <Link href={href}>
          <div>
            <span className="block text-large">{name}</span>
          </div>
        </Link>
      </div>)
    } else {
      return (
        <div className= "text-center text-white m-4">
            <button onClick = {handleSignout}>
                    <div>
                        <span className="block text-large">{name}</span>
                    </div>
                </button>
            </div>)

    }
    
}

type TabProps = {
    name: string
    href: string
}

const TabConfig: TabProps[] = [
    { name: 'Home', href: '/'}, 
    { name: 'User', href: '/users'},
    { name: 'Events', href: '/events/create' },
    { name: 'Sign Out', href: '/api/auth/signout' } 
]