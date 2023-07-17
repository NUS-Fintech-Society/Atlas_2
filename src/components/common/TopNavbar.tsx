import { Navbar, Dropdown, Avatar } from 'flowbite-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useCallback } from 'react'
import { auth } from "~/server/db/firebase"
import { signOut as firebaseSignout } from "firebase/auth"

interface TopNavbarProps {
  isAdmin: boolean
  isApplicant: boolean
  image: string
}

// Admin Users: Users, Events, Calendar, Recruitment
const admin = [
  {
    href: '/users',
    title: 'Users',
  },
  {
    href: '/events',
    title: 'Events',
  },
  {
    href: '/calendar',
    title: 'Calendar',
  },
  {
    href: '/recruitment',
    title: 'Recruitment',
  },
  {
    href: '/tasks',
    title: 'Tasks',
  },
]

const applicants = [
  {
    href: '/status',
    title: 'Status',
  },
  {
    href: '/tasks',
    title: 'Tasks',
  },
]

const members = [
  {
    href: '/calendar',
    title: 'Calendar',
  },
  {
    href: '/tasks',
    title: 'Tasks',
  },
]

const NavbarItems = (
  isAdmin: boolean,
  isApplicant: boolean,
  isNavbarItem: boolean
) => {
  let configuration: { href: string; title: string }[]
  if (isAdmin) {
    configuration = admin
  } else if (isApplicant) {
    configuration = applicants
  } else {
    configuration = members
  }

  return configuration.map((config, index) => {
    if (isNavbarItem) {
      return (
        <Navbar.Link key={index} href={config.href} className="ml-4 text-white">
          {config.title}
        </Navbar.Link>
      )
    }

    return (
      <Link key={index} href={config.href} className="md:hidden">
        <Dropdown.Item>{config.title}</Dropdown.Item>
      </Link>
    )
  })
}

const TopNavbar: React.FC<TopNavbarProps> = ({
  isAdmin,
  isApplicant,
  image,
}) => {
  const logout = useCallback(async () => {
    await signOut()
    await firebaseSignout(auth)
  }, [])

  return (
    <Navbar fluid={true} rounded={true} className="!bg-[#01003D]">
      <Navbar.Brand href="/">
        <img alt="Fintech-Logo" className="mx-3 h-9" src="/fintech_logo.png" />
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={<Avatar alt="User-settings" img={image} rounded={true} />}
        >
          {NavbarItems(isAdmin, isApplicant, false)}
          <Link href="/profile">
            <Dropdown.Item>Profile</Dropdown.Item>
          </Link>
          <Dropdown.Item>
            <div onClick={logout}>Sign Out</div>
          </Dropdown.Item>
        </Dropdown>
      </div>

      <Navbar.Collapse className="mr-auto">
        {NavbarItems(isAdmin, isApplicant, true)}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default TopNavbar
