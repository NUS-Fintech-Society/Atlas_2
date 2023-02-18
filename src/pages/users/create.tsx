import SingleUserForm from '~/components/users/SingleUserForm'
import Head from 'next/head'

const UserForm = () => {
  return (
    <>
      <Head>
        <title>Atlas | Create Users</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="The create user page for Atlas" />
      </Head>
      <div className="m-auto w-[90%]">
        {/* Heading */}
        <h1 className="font-[Inter] text-4xl font-semibold">
          Create User / Users
        </h1>
        <SingleUserForm />
      </div>
    </>
  )
}

export default UserForm
