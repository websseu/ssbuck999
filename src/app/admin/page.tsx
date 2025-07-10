'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AdminPosts from '@/components/admin/admin-posts'
import AdminUsers from '@/components/admin/admin-users'
import AdminContacts from '@/components/admin/admin-contacts'
import AdminComments from '@/components/admin/admin-comments'
import AdminStores from '@/components/admin/admin-stores'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('posts')

  return (
    <section>
      <div>
        <h1 className='text-xl text-center font-nanum mb-6 mt-4'>관리자</h1>
      </div>

      <Tabs defaultValue='posts' value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='mx-auto mb-2'>
          <TabsTrigger className='md:px-6 text-xs md:text-sm' value='posts'>
            글 관리
          </TabsTrigger>
          <TabsTrigger className='md:px-6 text-xs md:text-sm' value='stores'>
            스토어 관리
          </TabsTrigger>
          <TabsTrigger className='md:px-6 text-xs md:text-sm' value='users'>
            회원 관리
          </TabsTrigger>
          <TabsTrigger className='md:px-6 text-xs md:text-sm' value='contacts'>
            문의 관리
          </TabsTrigger>
          <TabsTrigger className='md:px-6 text-xs md:text-sm' value='comments'>
            댓글 관리
          </TabsTrigger>
        </TabsList>

        <TabsContent value='posts'>
          <AdminPosts />
        </TabsContent>

        <TabsContent value='stores'>
          <AdminStores />
        </TabsContent>

        <TabsContent value='users'>
          <AdminUsers />
        </TabsContent>

        <TabsContent value='contacts'>
          <AdminContacts />
        </TabsContent>

        <TabsContent value='comments'>
          <AdminComments />
        </TabsContent>
      </Tabs>
    </section>
  )
}
