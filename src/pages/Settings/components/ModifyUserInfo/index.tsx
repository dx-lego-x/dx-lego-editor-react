import { GlobalState } from '@/store'
import { UserState } from '@/store/reducers/user.reducer'
import { UserProps } from '@/types/user'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Image, Input, Radio, Space, Upload } from 'antd'
import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import styles from './index.module.scss'
import { FORM_WRAPPER_COL_OFFSET, FORM_WRAPPER_COL_SPAN } from '@/utils/constants'

type UserInfoUpdateProps = Pick<UserProps, 'picture' | 'nickName' | 'sex'>

const ModifyUserInfo: FC = () => {
  const { userProps } = useSelector<GlobalState, UserState>(store => store.user)

  const onFinish = (values: UserInfoUpdateProps) => {
    console.log(values)
  }

  return (
    <>
      {
        userProps
        &&
        <div className={ styles.root }>
          <Form
            className={ styles.form }
            labelCol={{ span: FORM_WRAPPER_COL_OFFSET }}
            wrapperCol={{ span: FORM_WRAPPER_COL_SPAN }}
            initialValues={ userProps }
            onFinish={ onFinish }
            >
            <Form.Item<UserInfoUpdateProps> label='头像' name='picture' valuePropName="fileList">
              <Upload name="logo" action="/upload.do" listType="picture">
                <Space direction='vertical' >
                  <Image width={ 180 } height={ 180 } src={ userProps.picture } preview={ false } />
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Space>
              </Upload>
            </Form.Item>

            <Form.Item<UserInfoUpdateProps> label='昵称' name='nickName'>
              <Input />
            </Form.Item>

            <Form.Item<UserInfoUpdateProps> label='性别' name='sex'>
              <Radio.Group>
                <Radio.Button value="male">男</Radio.Button>
                <Radio.Button value="female">女</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: FORM_WRAPPER_COL_OFFSET, span: FORM_WRAPPER_COL_SPAN }}>
              <Button type='primary' htmlType='submit'>提交更新</Button>
            </Form.Item>
          </Form>
        </div>
      }
    </>
  )
}

export default ModifyUserInfo