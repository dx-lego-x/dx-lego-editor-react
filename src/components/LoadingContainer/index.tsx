import { BaseFCProps } from '@/types/base'
import { Spin } from 'antd'
import React, { FC, useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'

export interface LoadingContainerProps extends BaseFCProps {
  loading: boolean
}

const LoadingContainer: FC<LoadingContainerProps> = ({ loading, children }) => {

  const rootRef = useRef<HTMLDivElement | null>(null)
  const [containerHeight, setContainerHeight] = useState(0)

  useEffect(() => {
    const height = rootRef.current?.parentElement?.getBoundingClientRect().height
    if (height !== undefined && height > 0) {
      setContainerHeight(height)
    }
  }, [])

  return (
    <div className={ styles.root } style={{ height: containerHeight }} ref={ rootRef }>
      {
        loading
        ?
        <div className={ styles.spinContainer }>
          <Spin size='default' /><div className={ styles.text }>内容加载中...</div>
        </div>
        :
        children
      }
    </div>
  )
}

export default LoadingContainer