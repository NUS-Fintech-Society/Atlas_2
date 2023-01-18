import Buttons from '~/components/admin/Buttons'
import Layout from '~/components/common/Layout'
import { useSession } from 'next-auth/react'
import LoadingScreen from '~/components/common/LoadingScreen'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { trpc } from '~/utils/trpc'
import { type User, TableBody, TableHeader } from '~/components/users/Table'
import {
  // type Column,
  // type Table as ReactTable,
  // PaginationState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  // OnChangeFn,
  // flexRender,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'

const SEO = () => {
  return (
    <Head>
      <title>Atlas | Users</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content="The login page for Atlas" />
    </Head>
  )
}

const DataTable = () => {
  const [users, setUsers] = useState<User[]>([])

  const { isLoading } = trpc.user.getAllUsers.useQuery(undefined, {
    onSuccess(data) {
      setUsers(data)
    },
  })

  // Return The React Table If The Table Is Rendered
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: 'Users',
        columns: [
          {
            accessorKey: 'id',
            cell: (info) => info.getValue(),
            header: 'No.',
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'name',
            cell: (info) => info.getValue(),
            header: 'Name',
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'email',
            cell: (info) => info.getValue(),
            header: 'Email',
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'department',
            cell: (info) => info.getValue(),
            header: 'Department',
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'roles',
            cell: (info) => info.getValue(),
            header: 'Role',
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
    []
  )

  // Return Loading Screen If The Data Is Still Loading
  if (isLoading) {
    return <LoadingScreen />
  }
  return (
    <>
      <Table data={users} columns={columns} />
    </>
  )
}

const Table = ({
  data,
  columns,
}: {
  data: User[]
  columns: ColumnDef<User>[]
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <>
      <table>
        <TableHeader table={table} />
        <TableBody table={table} />
      </table>
    </>
  )
}

export default function AdminUserPage() {
  const { data: session, status } = useSession({ required: true })
  const router = useRouter()

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (session.level !== 'super') {
    router.push('/users')
  }

  return (
    <>
      <SEO />
      <Layout>
        <div className="flex flex-col">
          <DataTable />
          <Buttons />
        </div>
      </Layout>
    </>
  )
}
