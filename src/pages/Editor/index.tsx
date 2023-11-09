import { Layout } from 'antd'
import React, { FC } from 'react'
import styles from './index.module.scss'
import Selector from './components/Selector'
import Palette from './components/Palette'
import Config from './components/Config'
import Header from '@/components/Header'
import useWorkInfo from '@/hooks/useWorkInfo'
import HeaderControl from './components/HeaderControl'
import TitleControl from './components/TitleControl'

const Editor: FC = () => {
  useWorkInfo()

  return (
    <Layout className={ styles.root }>
      <Layout.Header>
        <Header 
          title='DX' 
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