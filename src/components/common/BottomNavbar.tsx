import Image from 'next/image'
import Link from 'next/link'

const BottomNavBar = () => {
  return (
    <section
      id="bottom-navigation"
      className="fixed inset-x-0 bottom-0 z-10 block bg-white shadow md:invisible"
    >
      <div id="tabs" className="flex justify-between">
        {TabConfig.map(({ href, src, title }, index) => (
          <TabButton key={index} href={href} src={src} title={title} />
        ))}
      </div>
    </section>
  )
}

export default BottomNavBar

const TabButton = ({ href, src, title }: TabButtonProps) => {
  return (
    <div className="inline-block w-full justify-center pt-2 pb-1 text-center hover:text-teal-500 focus:text-teal-500">
      <Link href={href}>
        <div>
          <Image
            alt="Home"
            className="mb-1 inline-block"
            height={25}
            src={src}
            width={25}
          />
          <span className="block text-xs">{title}</span>
        </div>
      </Link>
    </div>
  )
}

type TabButtonProps = {
  href: string
  src: string
  title: string
}

const TabConfig: TabButtonProps[] = [
  {
    href: '/',
    src: '/mobile/home.svg',
    title: 'Home',
  },
  {
    href: '/event',
    src: '/mobile/event.svg',
    title: 'Event',
  },
  {
    href: '/profile',
    src: '/mobile/profile.svg',
    title: 'Profile',
  },
]
