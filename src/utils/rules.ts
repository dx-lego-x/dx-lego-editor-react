import { Rule } from 'antd/es/form'

export const notEmpty: (message?: string) => Rule = (message = '输入不能为空') => {
  return {
    required: true,
    message
  }
}

export const email: (message?: string) => Rule = (message = '请输入合法的邮箱地址') => {
  return {
    type: 'email',
    message
  }
}
