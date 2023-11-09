import { Api } from '@/types/base'
import { UserProps } from '@/types/user'
import { getApiPrefix, getInstance } from '@/utils/http'

const USER_PREFIX = getApiPrefix() + '/user'

export type UserRegisterProps = Pick<UserProps, 'username' | 'password' | 'email' | 'phoneNumber' | 'nickName' | 'type'>

export const registerApi: Api<any, UserRegisterProps> = (params) => {
  return getInstance().post(USER_PREFIX, params)
}

export const loginApi: Api<{ token: string }, { username: string, password: string }> = (params) => {
  return getInstance().post(USER_PREFIX + '/login', params)
}

export const fetchUserInfoApi: Api<UserProps> = () => {
  return getInstance().get(USER_PREFIX + '/fetchUserInfo')
}