import MainLayout from '@/layouts/MainLayout'
import Editor from '@/pages/Editor'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import MyWorks from '@/pages/MyWorks'
import Settings from '@/pages/Settings'
import AnimationLearn from '@/test/AnimationLearn'
import Any from '@/test/Any'
import { createBrowserRouter } from 'react-router-dom'

export const PATHNAME_LOGIN = '/login'
export const PATHNAME_HOME = '/'
export const PATHNAME_SETTINGS = '/settings'
export const PATHNAME_MY_WORKS = '/myWorks'
export const PATHNAME_EDITOR = '/editor'

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
  path: PATHNAME_EDITOR + '/:uuid',
  element: <Editor/>
}, {
  path: PATHNAME_LOGIN,
  element: <Login/>
}, {
  path: 'animation',
  element: <AnimationLearn/>
}, {
  path: 'test',
  element: <Any/>
}])

export default router