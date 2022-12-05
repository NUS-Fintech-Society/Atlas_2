import Button from '~/components/utilities/Button'
import Link from 'next/link'

const Buttons = () => {
  return (
    <div className="flex mt-5 justify-between">
      <Button>
        <Link href="/admin/users/upload-multiple-users">
          Upload Multiple Users
        </Link>
      </Button>

      <Button>
        <Link href="/admin/users/upload-single-user">Create a user</Link>
      </Button>
    </div>
  )
}

export default Buttons
