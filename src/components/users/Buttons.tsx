import Button from '~/components/utilities/Button'
import Link from 'next/link'

const Buttons = () => {
  return (
    <div className="mt-5 flex justify-between">
      <Button>
        <Link href="/admin/users/create-multiple">Upload Multiple Users</Link>
      </Button>

      <Button>
        <Link href="/admin/users/upload-single-user">Create a user</Link>
      </Button>
    </div>
  )
}

export default Buttons
