import { createWorkApi } from '@/api/work.api'
import { PATHNAME_EDITOR } from '@/router'
import { GlobalState } from '@/store'
import { UserState } from '@/store/reducers/user.reducer'
import { setWorkData } from '@/store/reducers/work.reducer'
import { UserProps } from '@/types/user'
import { WorkProps } from '@/types/work'
import { FORM_WRAPPER_COL_OFFSET, FORM_WRAPPER_COL_SPAN } from '@/utils/constants'
import { useRequest } from 'ahooks'
import { Button, Form, Input, Modal, message } from 'antd'
import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

type CreateWorkProps = Pick<WorkProps, 'title' | 'desc'>

interface WorkCreatorProps {
  userProps: UserProps
  onCancel: () => void
  onResult: (workData: WorkProps) => void
}

const WorkCreator: FC<WorkCreatorProps> = ({ userProps, onCancel, onResult }) => {

  const initialValues: CreateWorkProps = {
    title: '未命名作品',
    desc: '暂无描述',
  }
  const { run: createWork, loading: createWorkLoading } = useRequest(createWorkApi, {
    manual: true,

    onSuccess(res) {
      console.log(res)

      onResult(res)
    },

    onError(error) {
      console.log(error)
      message.error(error.message)
    }
  })

  const onFinish = (values: CreateWorkProps) => {
    createWork(values)
  }

  return (
    <div>
      <Form
        initialValues={ initialValues }
        onFinish={ onFinish }
        labelCol={{ span: FORM_WRAPPER_COL_OFFSET }}
        wrapperCol={{ span: FORM_WRAPPER_COL_SPAN }}
        >
        <Form.Item<CreateWorkProps> label='标题' name='title' rules={[]}>
          <Input />
        </Form.Item>
        <Form.Item<CreateWorkProps> label='描述' name='desc'>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: FORM_WRAPPER_COL_OFFSET, span: FORM_WRAPPER_COL_SPAN }}>
          <Button onClick={ onCancel } >放弃</Button>
          <Button style={{ marginLeft: 16 }} type='primary' htmlType='submit' loading={ createWorkLoading }>提交</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const HeaderControl: FC = () => {
  const { userProps } = useSelector<GlobalState, UserState>(store => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onCreateWorkClick = () => {
    const modal = Modal.info({
      title: '创建作品',
      content: (
        <>
          {
            userProps
            &&
            <WorkCreator 
              userProps={ userProps } 
              onCancel={ () => modal.destroy() } 
              onResult={ (res) => {
                dispatch(setWorkData(res))
                modal.destroy()
                message.loading('创建成功，2s后跳转到作品编辑页面', 2, () => {
                  navigate(PATHNAME_EDITOR + '/' + res.uuid)
                })
              } }
              />
          }
        </>
      ),
      footer: null
    })
  }

  return (
    <>
      {
          userProps 
          &&
          <Button type='primary' onClick={ onCreateWorkClick } >创建作品</Button>
        }
    </>
  )
}

export default HeaderControl