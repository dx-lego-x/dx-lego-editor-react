import LoadingContainer from '@/components/LoadingContainer'
import useUserInfo from '@/hooks/useUserInfo'
import React, { FC } from 'react'
import styles from './index.module.scss'
import { Tabs } from 'antd'
import { Tab } from 'rc-tabs/lib/interface'
import ModifyUserInfo from './components/ModifyUserInfo'
import RestoreWorks from './components/RestoreWorks'

const Settings: FC = () => {
  const { loading: userInfoLoading } = useUserInfo(true)

  const tabs: Tab[] = [{
    key: '1',
    label: '修改个人资料',
    children: <ModifyUserInfo/>
  }, {
    key: '2',
    label: '恢复删除作品',
    children: <RestoreWorks/>
  }]

  return (
    <LoadingContainer loading={ userInfoLoading }>
      <div className={ styles.root }>
        <div className={ styles.contentWrapper}>
          <div className={ styles.titleWrapper }>
            个人设置
          </div>

          <Tabs
            defaultActiveKey="1"
            type="card"
            size='middle'
            items={ tabs }
          />
        </div>
        
      </div>
    </LoadingContainer>
  )
}

export default Settings