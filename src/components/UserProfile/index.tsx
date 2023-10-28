import { PATHNAME_LOGIN, PATHNAME_MY_WORKS, PATHNAME_SETTINGS } from '@/router'
import { GlobalState } from '@/store'
import { UserState, logout } from '@/store/reducers/user.reducer'
import { genRedirectFormatStr } from '@/utils/http'
import { UserOutlined } from '@ant-design/icons'
import { Button, Dropdown, MenuProps } from 'antd'
import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

const UserProfile: FC = () => {
  const { userProps } = useSelector<GlobalState, UserState>(store => store.user)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const dropdownMenu: MenuProps['items'] = [{
    key: '1',
    label: (
      <div>我的作品</div>
    ),
    onClick: () => {
      navigate(PATHNAME_MY_WORKS)
    }
  }, {
    key: '2',
    label: (
      <div>个人设置</div>
    ),
    onClick: () => {
      navigate(PATHNAME_SETTINGS)
    }
  }, {
    key: '3',
    label: (
      <div>退出登录</div>
    ),
    onClick: () => {
      dispatch(logout())
    }
  }]

  const onLoginClick = () => {
    navigate({
      pathname: PATHNAME_LOGIN,
      search: genRedirectFormatStr(location.pathname)
    })
  }

  return (
    <div>
      {
        userProps
        ?
        <div>
          <Dropdown menu={{ items: dropdownMenu }} placement='bottomRight'>
            <Button><UserOutlined/>{ userProps.nickName }</Button>
          </Dropdown>
        </div>
        :
        <Button type='primary' onClick={ onLoginClick } >登录</Button>
      }
    </div>
  )
}

export default UserProfile