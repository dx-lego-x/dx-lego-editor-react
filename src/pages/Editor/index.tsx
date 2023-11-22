import { Layout, Modal } from 'antd'
import React, { FC, useCallback } from 'react'
import styles from './index.module.scss'
import Selector from './components/Selector'
import Palette from './components/Palette'
import Config from './components/Config'
import Header from '@/components/Header'
import useWorkInfo from '@/hooks/useWorkInfo'
import HeaderControl from './components/HeaderControl'
import TitleControl from './components/TitleControl'
import { useNavigate } from 'react-router-dom'
import { PATHNAME_HOME } from '@/router'

const Editor: FC = () => {
  useWorkInfo()
  const navigate = useNavigate()

  const onTitleClick = useCallback(() => {
    Modal.confirm({
      title: '将返回到首页，是否继续',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        navigate(PATHNAME_HOME)
      }
    })
  }, [navigate])

  return (
    <Layout className={ styles.root }>
      <Layout.Header>
        <Header 
          title='DX'
          onTitleClick={ onTitleClick } 
          controlArea={ <HeaderControl/> }
          titleControlArea={ <TitleControl/> }
          />
      </Layout.Header>

      <Layout.Content className={ styles.contentRoot }>
        <div className={ styles.selectorRoot}>
          <Selector/>
        </div>
        <div className={ styles.paletteRoot }>
          <Palette/>
        </div>
        <div className={ styles.configRoot }>
          <Config/>
        </div>
      </Layout.Content>

    </Layout>
  )
}

export default Editor