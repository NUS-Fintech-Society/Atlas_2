import { Navbar, Dropdown, Avatar } from 'flowbite-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useCallback } from 'react'

interface TopNavbarProps {
  isAdmin: boolean
  image: string
}

const TopNavbar: React.FC<TopNavbarProps> = ({ isAdmin, image }) => {
  const logout = useCallback(async () => {
    await signOut()
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
          <Link href="/" className="md:hidden">
            <Dropdown.Item>Home</Dropdown.Item>
          </Link>
          {isAdmin && (
            <Link href="/users" className="md:hidden">
              <Dropdown.Item>User</Dropdown.Item>
            </Link>
          )}
          {isAdmin && (<Link href="/events" className="md:hidden">
            <Dropdown.Item>Events</Dropdown.Item>
          </Link>)
          }
         <Link href="/profile">
            <Dropdown.Item>Profile</Dropdown.Item>
          </Link>
        
          {isAdmin && <Link href="/calendar">
            <Dropdown.Item>Calendar</Dropdown.Item>
          </Link>
          }
          <Dropdown.Item>
            <div onClick={logout}>Sign Out</div>
          </Dropdown.Item>
        </Dropdown>
      </div>

      <Navbar.Collapse className="mr-auto">
        <Navbar.Link href="/" className="ml-4 text-white">
          Home
        </Navbar.Link>
        {isAdmin && (
          <Navbar.Link href="/users" className="ml-4 text-white">
            Users
          </Navbar.Link>
        )}
        {isAdmin && (<Navbar.Link href="/events" className="ml-4 text-white">
          Events
        </Navbar.Link>)
        }
        {isAdmin && (<Navbar.Link href="/calendar" className="ml-4 text-white">
        </Navbar.Link>)}
        <Navbar.Link href="/recruitment" className="ml-4 text-white">
          Recruitment
        </Navbar.Link>
        
        {!isAdmin && <Navbar.Link href="/application_status" className="ml-4 text-white">
          Status
        </Navbar.Link>
        }

        {!isAdmin && <Navbar.Link href="/tasks" className="ml-4 text-white">
          Tasks
        </Navbar.Link>
        }
        {!isAdmin && <Navbar.Link  className="ml-4 text-white">
          Update Information
        </Navbar.Link>
        }
      </Navbar.Collapse>
    </Navbar>
  )
}

export default TopNavbar
