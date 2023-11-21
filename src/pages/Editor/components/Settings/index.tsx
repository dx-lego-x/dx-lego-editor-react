import { BaseFCProps } from '@/types/base'
import { FC, useState } from 'react'
import styles from './index.module.scss'
import { CloseOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import classNames from 'classnames'
import Preview from '../Preview'
import WorkSettings from './components/WorkSettings'

export interface SettingsProps extends BaseFCProps {
  isOpen: boolean
  onClose: () => void
}

const Settings: FC<SettingsProps> = ({ isOpen, onClose }) => {

  const [closing, setClosing] = useState(false)

  const animationWrapperClassnames = classNames({
    [styles.animationWrapper]: true,
    [styles.active]: isOpen,
    [styles.wrapperIn]: isOpen,
    [styles.wrapperOut]: closing,
  })

  const previewAnimationWrapperClassnames = classNames({
    [styles.previewAnimationWrapper]: true,
    [styles.previewIn]: isOpen,
    [styles.previewOut]: closing,
  })


  const sliderWrapperClassnames = classNames({
    [styles.sliderWrapper]: true,
    [styles.sliderIn]: isOpen,
    [styles.sliderOut]: closing,
  })
  // slider的animationend也会走到这里
  const onAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.currentTarget.classList.contains(styles.wrapperOut)) {
      onClose()
      setClosing(false)
    }
  }

  const onCloseClick = () => {
    setClosing(true)
  }

  
  return (
    <div 
      className={ animationWrapperClassnames } 
      // ref={ animationWrapperRef } 
      onAnimationEnd={ onAnimationEnd }
      >
      {
        isOpen
        &&
        <div className={ styles.root } >
          <div className={ styles.previewWrapper }>
            <div className={ previewAnimationWrapperClassnames }>
              <Preview/>
            </div>
          </div>
          <div className={ sliderWrapperClassnames }>
            <div className={ styles.header }>
              <Button type='text' icon={ <CloseOutlined/> } onClick={ onCloseClick } />
              <div className={ styles.titleWrapper}>作品设置</div>
            </div>

            <WorkSettings/>
          </div>
        </div>
      }
    </div>
  )
}

export default Settings