import { Button, message } from 'antd'
import React, { FC, useState } from 'react'
import styles from './index.module.scss'
import { useRequest } from 'ahooks'
import { updateWorkApi } from '@/api/work.api'
import { useSelector } from 'react-redux'
import { GlobalState } from '@/store'
import { WorkState } from '@/store/reducers/work.reducer'
import Settings from '../Settings'

const HeaderControl: FC = () => {
  const { data: workData } = useSelector<GlobalState, WorkState>(store => store.work)
  
  const { loading: updateWorkLoading, run: updateWork } = useRequest(updateWorkApi, {
    manual: true,

    onSuccess(res) {
      console.log('save ->', res)
      message.success('保存成功')
    },

    onError(error) {
      console.log('save error ->', error)
      message.error('保存失败：' + error.message)
    }
  })

  const onSaveClick = () => {
    if (!workData) {
      message.error('无作品信息无法保存')
      return
    }

    const { uuid, title, desc, schemas, coverImg } = workData

    updateWork({
      uuid,
      payload: {
        title,
        desc,
        schemas,
        coverImg
      }
    })
  }

  const [isPreviewOpen, setIsPreviewOpen] = useState(false)


  return (
    <>
      <>
        <Button onClick={ onSaveClick } loading={ updateWorkLoading } >保存</Button>
        <Button className={ styles.withMargin } onClick={ () => setIsPreviewOpen(true) } >预览和设置</Button>
        <Button className={ styles.withMargin } type='primary' >发布</Button>
      </>
      <Settings isOpen={ isPreviewOpen } onClose={ () => setIsPreviewOpen(false) } />
    </>
  )
}

export default HeaderControl
