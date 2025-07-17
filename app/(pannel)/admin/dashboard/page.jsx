import BottomBarAdmin from '@/components/admin/common/BottomBarAdmin'
import React, { Suspense } from 'react'
import Dashboard from '@/components/admin/dashboard'
import Navbar from '@/components/common/Navbar'

const page = () => {
  return (
    <Suspense>
      <Navbar />
      <Dashboard />
      <BottomBarAdmin />
    </Suspense>
  )
}

export default page