import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { App as AntdApp} from 'antd'
import router from './router'
import './App.scss'

function App() {
  return (
    <AntdApp>
      <RouterProvider router={ router }/>
    </AntdApp>
  )
}

export default App
