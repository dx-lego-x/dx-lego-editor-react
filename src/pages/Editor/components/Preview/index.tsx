import React, { FC } from 'react'
import styles from './index.module.scss'
import { useRequest } from 'ahooks'
import { genViewUrl, updateWorkApi } from '@/api/work.api'
import { useSelector } from 'react-redux'
import { GlobalState } from '@/store'
import { WorkState } from '@/store/reducers/work.reducer'
import { message } from 'antd'

const Preview: FC = () => {
  const { data: workData } = useSelector<GlobalState, WorkState>(store => store.work)

  const { loading: updateWorkLoading } = useRequest(async () => {
    if (!workData) {
      return
    }

    const { uuid, title, desc, schemas, coverImg } = workData
    return await updateWorkApi({
      uuid,
      payload: {
        title,
        desc,
        schemas,
        coverImg
      }
    })}, {

    onSuccess(res) {
      console.log('save ->', res)
      message.success('作品已保存')
    },

    onError(error) {
      console.log('save error ->', error)
    },

  })

  return (
    <div className={ styles.root }>
      {
        updateWorkLoading
        ?
        <div>正在保存...</div>
        :
        <div className={ styles.previewRoot }>
          <div className={ styles.titleWrapper } >
            { workData?.title }
          </div>
          <iframe
            className={ styles.iframe }
            title={ workData?.title }
            src={ genViewUrl(workData?.uuid) }
            />
        </div>
      }
    </div>
  )
}

export default Preview