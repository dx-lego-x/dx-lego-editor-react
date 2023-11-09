import { FC, ReactNode } from 'react'
import styles from './index.module.scss'
import { useNavigate } from 'react-router-dom'
import { PATHNAME_HOME } from '@/router'
import UserProfile from '@/components/UserProfile'

export interface HeaderProps {
  title?: string
  titleControlArea?: ReactNode
  controlArea?: ReactNode
}

const Header: FC<HeaderProps> = ({ title = 'DX Web Editor', titleControlArea, controlArea }) => {
  const navigate = useNavigate()

  const onTitleClick = () => {
    navigate(PATHNAME_HOME)
  }

  return (
    <div className={ styles.root }>
      <div className={ styles.titleWrapper }>
        <h1 className={ styles.titleText } onClick={ onTitleClick }>{ title }</h1>
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

export default Header