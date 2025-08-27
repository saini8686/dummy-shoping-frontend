import UsersList from '@/components/admin/UsersList'
import PreLoader from '@/components/common/PreLoader'
import BottomBar from "@/components/common/BottomBar";

import React, { Suspense } from 'react'
import Top10UsersList from '@/components/common/top10/Top10UsersList';
import HeaderCustomer from '@/components/customer/HeaderCustomer';

const page = () => {
  return (
    <Suspense>
      <HeaderCustomer name="Top 10 Customers" />
      <Top10UsersList />
    </Suspense>
  )
}

export default page