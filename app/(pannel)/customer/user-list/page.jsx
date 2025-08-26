import UsersList from '@/components/admin/UsersList'
import PreLoader from '@/components/common/PreLoader'
import BottomBar from "@/components/common/BottomBar";

import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense>
    <UsersList/>
    <BottomBar />
    </Suspense>
  )
}

export default page