import ShopList from '@/components/admin/ShopsList'
import PreLoader from '@/components/common/PreLoader'
import React, { Suspense } from 'react'
import BottomBar from '@/components/common/BottomBar'
import Top10ShopsList from '@/components/common/top10/Top10ShopsList'
import HeaderCustomer from '@/components/customer/HeaderCustomer'

const page = () => {
  return (
    <Suspense>
    <HeaderCustomer name="Top 10 Shops" />
    <Top10ShopsList/>
    </Suspense>
  )
}

export default page