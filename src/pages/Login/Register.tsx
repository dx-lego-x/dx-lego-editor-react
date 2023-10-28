import { registerApi } from '@/api/user.api'
import { BaseFCProps } from '@/types/base'
import { FORM_WRAPPER_COL_OFFSET, FORM_WRAPPER_COL_SPAN } from '@/utils/constants'
import { email, notEmpty } from '@/utils/rules'
import { useRequest } from 'ahooks'
import { Button, Form, Input, Modal, message } from 'antd'
import React, { FC } from 'react'

type RegisterFieldType = {
  username: string
  password: string
  confirmPassword: string
  email: string
  phoneNumber?: string
  nickName?: string
}

export type ReigsterResultType = 'success' | 'cancel' | 'error'

export interface RegisterProps extends BaseFCProps {
  open: boolean
  onClose: (resultType: ReigsterResultType) => void
}

const Register: FC<RegisterProps> = ({ open, onClose }) => {

  const { run: register, loading: registerLoading } = useRequest(registerApi, {
    manual: true,

    onSuccess() {
      onClose('success')
    },

    onError(error) {
      console.log(error)
      message.error(error.message)
      onClose('error')
    }
  })

  const onFinish = (values: RegisterFieldType) => {
    const { username, password, confirmPassword, email, phoneNumber, nickName } = values

    if (password !== confirmPassword) {
      message.error('两次输入密码不一致')
      return
    }

    register({
      username,
      password,
      email,
      phoneNumber,
      nickName,
      type: 'email'
    })
  }

  return (
    <Modal title='注册用户' open={ open } footer={ null } onCancel={ () => onClose('cancel') }>
      <Form
        labelCol={{ span: FORM_WRAPPER_COL_OFFSET }}
        wrapperCol={{ span: FORM_WRAPPER_COL_SPAN }}
        onFinish={ onFinish }
        autoComplete='off'
        >
        <Form.Item<RegisterFieldType> label='用户名' name='username' rules={[notEmpty('用户名不能为空')]}>
          <Input/>
        </Form.Item>
        <Form.Item<RegisterFieldType> label='密码' name='password' rules={[notEmpty('密码不能为空')]}>
          <Input.Password />
        </Form.Item> 
        <Form.Item<RegisterFieldType> label='确认密码' name='confirmPassword' rules={[notEmpty('确认密码不能为空')]}>
          <Input.Password />
        </Form.Item>
        <Form.Item<RegisterFieldType> label='邮箱' name='email' rules={[notEmpty('邮箱不能为空'), email()]}>
          <Input />
        </Form.Item> 
        <Form.Item<RegisterFieldType> label='绑定手机号' name='phoneNumber' rules={[]}>
          <Input />
        </Form.Item> 
        <Form.Item<RegisterFieldType> label='昵称' name='nickName' >
          <Input />
        </Form.Item> 
        <Form.Item wrapperCol={{ offset: FORM_WRAPPER_COL_OFFSET, span: FORM_WRAPPER_COL_SPAN }}>
          <Button type='primary' htmlType='submit' loading={ registerLoading }>提交</Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Register