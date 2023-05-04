import { Navbar, Dropdown, Avatar } from 'flowbite-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useCallback } from 'react'

interface TopNavbarProps {
  isAdmin: boolean
}

const TopNavbar: React.FC<TopNavbarProps> = ({ isAdmin }) => {
  const logout = useCallback(async () => {
    await signOut()
  }, [])

  return (
    <Navbar fluid={true} rounded={true} className="!bg-[#01003D]">
      <Navbar.Brand href="/">
        <img alt="Fintech-Logo" className="mx-3 h-9" src="/fintech_logo.png" />
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Navbar.Toggle className="mr-2" />
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={<Avatar alt="User-settings" rounded={true} />}
        >
          <Link href="/profile">
            <Dropdown.Item>Profile</Dropdown.Item>
          </Link>
          <Dropdown.Item>
            <div onClick={logout}>Sign Out</div>
          </Dropdown.Item>
        </Dropdown>
      </div>

      <Navbar.Collapse>
        <Navbar.Link href="/" className="text-white">
          Home
        </Navbar.Link>
        {isAdmin && (
          <Navbar.Link href="/users" className="text-white">
            Users
          </Navbar.Link>
        )}
        <Navbar.Link href="/events" className="text-white">
          Events
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default TopNavbar
