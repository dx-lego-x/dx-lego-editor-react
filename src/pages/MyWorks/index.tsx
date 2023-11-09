import { fetchMyWorksApi } from '@/api/work.api'
import LoadingContainer from '@/components/LoadingContainer'
import useUserInfo from '@/hooks/useUserInfo'
import { WorkListData } from '@/types/work'
import { useRequest } from 'ahooks'
import { Button, List, Result } from 'antd'
import { FC, useState } from 'react'
import styles from './index.module.scss'
import WorkCard from '@/components/WorkCard'

const MyWorks: FC = () => {
  const { loading } = useUserInfo(true)
  const [error, setError] = useState<Error | null>(null)
  const [workListData, setWorkListData] = useState<WorkListData | null>(null)

  const { run: fetchMyWorks, loading: requestLoading } = useRequest(fetchMyWorksApi, {

    onSuccess(res) {
      setWorkListData(res)
    },

    onError(error) {
      setError(error)
    }
  })


  const render = () => {
    if (error) {
      return (
        <Result
          status="error"
          title="获取作品列表失败"
          subTitle={ "错误详情：" + error.message }
          extra={[
            <Button type="primary" key='refersh' onClick={ () => fetchMyWorks() } >
              刷新试试
            </Button>,
          ]}
          />
      )
    }

    if (!workListData || !workListData.list || workListData.list.length === 0) {
      return (
        <Result
          status='info'
          title="您还未创建任何作品"
          subTitle='点击右上角创建'
          />
      )
    }

    return (
      <div className={ styles.listRoot }>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={ workListData.list }
          renderItem={(work) => {
            return (
              <List.Item>
                <WorkCard work={ work }/>
              </List.Item>
            )
          }}
          />
      </div>
    )
  }

  return (
    <LoadingContainer loading={ loading || requestLoading }>
      {
        render()
      }
    </LoadingContainer>
  )
}

export default MyWorks