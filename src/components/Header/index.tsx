import React, { FC, ReactNode } from 'react'
import styles from './index.module.scss'
import { useNavigate } from 'react-router-dom'
import { PATHNAME_HOME } from '@/router'
import UserProfile from '@/components/UserProfile'

export interface HeaderProps {
  title?: string
  onTitleClick?: () => void
  titleControlArea?: ReactNode
  controlArea?: ReactNode
}

const Header: FC<HeaderProps> = ({ title = 'DX Web Editor', titleControlArea, controlArea, onTitleClick }) => {
  const navigate = useNavigate()

  const _onTitleClick = () => {
    if (!onTitleClick) {
      navigate(PATHNAME_HOME)
    } else {
      onTitleClick()
    }
  }

  return (
    <div className={ styles.root }>
      <div className={ styles.titleWrapper }>
        <h1 className={ styles.titleText } onClick={ _onTitleClick }>{ title }</h1>
        {
          titleControlArea &&
          <div className={ styles.titleControlWrapper}>{ titleControlArea }</div>
        }
      </div>

      <div className={ styles.controlWrapper }>
        <div className={ styles.customControlWrapper }>
        {
          controlArea
        }
        </div>
        <UserProfile/>
      </div>
    </div>
  )
}

export default React.memo(Header)
