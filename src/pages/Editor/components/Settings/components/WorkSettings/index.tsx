import React, { FC, ReactNode, useMemo } from 'react'
import styles from './index.module.scss'
import { Button, Form, Image, Input, message } from 'antd'
import { WorkProps } from '@/types/work'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalState } from '@/store'
import { WorkState, setWorkData } from '@/store/reducers/work.reducer'
import { FORM_WRAPPER_COL_OFFSET, FORM_WRAPPER_COL_SPAN } from '@/utils/constants'
import { notEmpty } from '@/utils/rules'
import { useRequest } from 'ahooks'
import { genViewUrl, updateWorkApi } from '@/api/work.api'
import { useForm } from 'antd/es/form/Form'
import { CopyOutlined } from '@ant-design/icons'

type InfoInputType = Pick<WorkProps, 'title' | 'desc'>

const InfoInput: FC<{ workData: WorkProps | null }> = ({ workData }) => {
  const [form] = useForm()
  const dispatch = useDispatch()

  const { loading: updateWorkLoading, run: updateWork } = useRequest(updateWorkApi, {
    manual: true,

    onSuccess(res) {
      console.log('save ->', res)
      message.success('保存成功')
      dispatch(setWorkData(res))
    },

    onError(error) {
      console.log('save error ->', error)
      message.error('保存失败：' + error.message)
    }
  })

  const onFinish = ({ title, desc }: InfoInputType) => {
    const { uuid } = workData || {}
    if (!uuid) {
      return
    }

    updateWork({
      uuid,
      payload: {
        title,
        desc
      }
    })
  }

  const onPublishClick = () => {
    console.log(form.getFieldsValue())
  }

  return (
    <>
      {
        workData &&
        <Form
          style={{ width: '100%' }}
          initialValues={{ title: workData.title, desc: workData.desc }}
          labelCol={{ span: FORM_WRAPPER_COL_OFFSET }}
          wrapperCol={{ span: FORM_WRAPPER_COL_SPAN }}
          onFinish={ onFinish }
          form={ form }
          >
          <Form.Item<InfoInputType> name='title' label='标题' rules={[notEmpty()]}>
            <Input/>
          </Form.Item>
          <Form.Item<InfoInputType> name='desc' label='描述' rules={[notEmpty()]} >
            <Input/>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: FORM_WRAPPER_COL_OFFSET, span: FORM_WRAPPER_COL_SPAN }}>
            <Button htmlType='submit' loading={ updateWorkLoading } >保存</Button>
            <Button type='primary' style={{ marginLeft: 16 }} onClick={ onPublishClick } >发布</Button>
          </Form.Item>
        </Form>
      }
    </>
  )
}

interface Item {
  key: string
  label?: string
  content: ReactNode
}

const WorkSettings: FC = () => {
  const { data: workData } = useSelector<GlobalState, WorkState>(store => store.work)

  const items = useMemo<Item[]>(() => {
    return [{
      key: 'qrcode',
      label: '扫码预览：',
      content: (
        <Image
          width={ '150px' }
          height={ '150px' } 
          src='data:image/png;base64,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' 
          />
      )
    }, {
      key: 'link',
      label: '预览链接：',
      content: (
        <span>
          <span>{ genViewUrl(workData?.uuid) }</span>
          <Button style={{ marginLeft: '8px', padding: 0 }} type='text' icon={<CopyOutlined/>} />
        </span>
      )
    }, {
      key: 'upload-cover',
      label: '上传封面：',
      content: (
        <Image  
          width={ '150px' }
          height={ '150px' } 
          />
      )
    }, {
      key: 'info-change',
      content: (
        <InfoInput workData={ workData }/>
      )
    }]
  }, [workData])

  return (
    <div className={ styles.root }>
      <ul>
        {
          items.map(item => {
            const { key, label, content } = item

            return (
              <li key={ key }>
                {
                  label &&
                  <div className={ styles.labelWrapper }>
                    { label }
                  </div>
                }
                <div className={ styles.contentWrapper }>
                  { content }
                </div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default WorkSettings
