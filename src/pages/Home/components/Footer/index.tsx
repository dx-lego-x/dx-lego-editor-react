import React, { FC } from 'react'
import styles from './index.module.scss'
import { Button, Space } from 'antd'

const Footer: FC = () => {
  return (
    <div className={ styles.root }>
      <div className={ styles.contentWrapper }>

      </div>
      <div className={ styles.copyrightWrapper }>
        <Space direction='horizontal' >
          <span>© DX Web Editor all rights reserved</span>
          <div className={ styles.divider }  />
          <Button className={ styles.button } type='link'>开源仓库</Button>
        </Space>
      </div>
    </div>
  )
}

export default Footer