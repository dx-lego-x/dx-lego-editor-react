import Footer from '@/pages/Home/components/Footer'
import Header from '@/components/Header'
import { Layout } from 'antd'
import React, { FC } from 'react'
import { Outlet } from 'react-router-dom'
import HeaderControl from '@/pages/Home/components/HeaderControl'

const MainLayout: FC = () => {
  

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header>
        <Header controlArea={ <HeaderControl/> }/>
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