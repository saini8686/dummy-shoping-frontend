import ShopList from '@/components/admin/ShopsList'
import PreLoader from '@/components/common/PreLoader'
import Top10ShopsList from '@/components/common/top10/Top10ShopsList'
import HeaderCustomer from '@/components/customer/HeaderCustomer'
import BottomBarShopKepper from '@/components/shopkepper/common/BottomBarShopKepper'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense>
      <HeaderCustomer name="Top 10 Shops" />
      <Top10ShopsList />
      <BottomBarShopKepper />
    </Suspense>
  )
}

export default page