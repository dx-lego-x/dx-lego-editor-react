import Footer from '@/pages/Home/components/Footer'
import Header from '@/pages/Home/components/Header'
import { Layout } from 'antd'
import React, { FC } from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout: FC = () => {
  

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header>
        <Header/>
      </Layout.Header>
      <Layout.Content>
        <Outlet/>
      </Layout.Content>
      <Layout.Footer style={{ padding: 0 }}>
        <Footer/>
      </Layout.Footer>
    </Layout>
  )
}

export default MainLayout