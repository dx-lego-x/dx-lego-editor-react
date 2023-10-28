import React, { FC } from 'react'
import styles from './index.module.scss'
import { useSelector } from 'react-redux'
import { GlobalState } from '@/store'
import { UserState } from '@/store/reducers/user.reducer'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PATHNAME_HOME } from '@/router'
import UserProfile from '@/components/UserProfile'

const Header: FC = () => {
  const { userProps } = useSelector<GlobalState, UserState>(store => store.user)
  const navigate = useNavigate()

  const onTitleClick = () => {
    navigate(PATHNAME_HOME)
  }

  return (
    <div className={ styles.root }>
      <div className={ styles.titleWrapper }>
        <h1 onClick={ onTitleClick }>DX Web Editor</h1>
      </div>

      <div className={ styles.controlWrapper }>
        {
          userProps 
          &&
          <Button type='primary' className={ styles.button } >创建作品</Button>
        }
        <UserProfile/>
      </div>
    </div>
  )
}

export default Header