import UsersList from '@/components/admin/UsersList'
import PreLoader from '@/components/common/PreLoader'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense>
    <UsersList/>
    </Suspense>
  )
}

export default page