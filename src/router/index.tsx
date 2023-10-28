import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import MyWorks from '@/pages/MyWorks'
import Settings from '@/pages/Settings'
import { createBrowserRouter } from 'react-router-dom'

export const PATHNAME_LOGIN = '/login'
export const PATHNAME_HOME = '/'
export const PATHNAME_SETTINGS = '/settings'
export const PATHNAME_MY_WORKS = '/myWorks'

const router = createBrowserRouter([{
  path: PATHNAME_HOME,
  element: <MainLayout/>,
  children: [{
    path: PATHNAME_HOME,
    element: <Home/>
  }, {
    path: PATHNAME_SETTINGS,
    element: <Settings />
  }, {
    path: PATHNAME_MY_WORKS,
    element: <MyWorks/>
  }],
}, {
  path: PATHNAME_LOGIN,
  element: <Login/>
}])

export default router