import React, { FC, useState } from 'react'
import styles from './index.module.scss'
import { Button, Form, Input, message } from 'antd'
import { useRequest } from 'ahooks'
import { loginApi } from '@/api/user.api'
import { notEmpty } from '@/utils/rules'
import Register, { ReigsterResultType } from './Register'
import { FORM_WRAPPER_COL_OFFSET, FORM_WRAPPER_COL_SPAN } from '@/utils/constants'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { DEFAULT_TOKEN_KEY } from '@/utils/http'

type LoginFieldType = {
  username: string
  password: string
}

const Login: FC = () => {
  const searchParams = useSearchParams()
  const navigate = useNavigate()

  const [registerOpen, setRegisterOpen] = useState(false)
  const { run: login, loading: loginLoading } = useRequest(loginApi, {
    manual: true,

    onSuccess: (res) => {
      console.log(res)
      localStorage.setItem(DEFAULT_TOKEN_KEY, res.token)
      let redirect = searchParams[0].get('from')
      if (!redirect) {
        redirect = '/'
      }
      navigate(redirect)
    },

    onError: error => {
      console.log(error)
      message.error(error.message)
    }
  })

  const onFinish = (values: LoginFieldType) => {
    const { username, password } = values
    login({ username, password })
  }

  const onRegisterClick = () => {
    setRegisterOpen(true)
  }

  const onRegisterCallback = (type: ReigsterResultType) => {
    setRegisterOpen(false)

    if (type === 'success') {
      message.success('注册成功请登录')
    }
  }

  return (
    <>
      <div className={ styles.root }>
        <div className={ styles.centerWrapper }>
          <div className={ styles.titleWrapper }>
            <span className={ styles.title }>DX Web Editor</span>
          </div>

          <Form
            className={ styles.form }
            labelCol={{ span: FORM_WRAPPER_COL_OFFSET }}
            wrapperCol={{ span: FORM_WRAPPER_COL_SPAN }}
            onFinish={ onFinish }
            autoComplete='off'
            >
            <Form.Item<LoginFieldType> label='用户名' name='username' rules={[notEmpty('用户名不能为空')]}>
              <Input/>
            </Form.Item>
            <Form.Item<LoginFieldType> label='密码' name='password' rules={[notEmpty('密码不能为空')]}>
              <Input.Password />
            </Form.Item> 
            <Form.Item wrapperCol={{ offset: FORM_WRAPPER_COL_OFFSET, span: FORM_WRAPPER_COL_SPAN }}>
              <Button type='primary' htmlType='submit' loading={ loginLoading }>登录</Button>
              <Button className={ styles.registerButton } onClick={ onRegisterClick }>还没有账号？先注册</Button>
            </Form.Item>
          </Form>

        </div>
      </div>

      <Register open={ registerOpen } onClose={ onRegisterCallback }/>
    </>
  )
}

export default Login