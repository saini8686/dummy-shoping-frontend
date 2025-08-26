import UsersList from '@/components/admin/UsersList'
import PreLoader from '@/components/common/PreLoader'

import React, { Suspense } from 'react'
import BottomBarShopKepper from '@/components/shopkepper/common/BottomBarShopKepper';
import Top10UsersList from '@/components/common/top10/Top10UsersList';
import HeaderCustomer from '@/components/customer/HeaderCustomer';

const page = () => {
  return (
    <Suspense>
      <HeaderCustomer name="Top 10 Customers" />
      <Top10UsersList />
      <BottomBarShopKepper />
    </Suspense>
  )
}

export default page