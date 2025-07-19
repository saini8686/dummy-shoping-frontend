import ShopList from '@/components/admin/ShopsList'
import PreLoader from '@/components/common/PreLoader'
import BottomBarAdmin from '@/components/admin/common/BottomBarAdmin'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense>
    <ShopList/>
    <BottomBarAdmin />
    </Suspense>
  )
}

export default page