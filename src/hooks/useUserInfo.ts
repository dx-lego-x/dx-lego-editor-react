import { fetchUserInfoApi } from '@/api/user.api'
import { PATHNAME_LOGIN } from '@/router'
import { GlobalState } from '@/store'
import { UserState, setUserInfo } from '@/store/reducers/user.reducer'
import { DEFAULT_TOKEN_KEY, genRedirectFormatStr } from '@/utils/http'
import { useRequest } from 'ahooks'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

export default function useUserInfo(needLogin = false) {
  const { userProps } = useSelector<GlobalState, UserState>(store => store.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const [error, setError] = useState<Error | null>(null)

  const { loading, run: fetchUserInfo } = useRequest(fetchUserInfoApi, {
    manual: true,

    onSuccess(res) {
      console.log('fetchUserInfo -> ', res)
      dispatch(setUserInfo(res))
    },

    onError(error) {
      console.log('fetchUserInfo error -> ', error)
      setError(error)
      if (needLogin) {
        navigate({
          pathname: PATHNAME_LOGIN,
          search: genRedirectFormatStr(location.pathname)
        })
      }
    }
  })

  useEffect(() => {
    if (userProps) {
      return
    }

    const token = localStorage.getItem(DEFAULT_TOKEN_KEY)

    if (!token) {
      if (needLogin) {
        // 去登录
        navigate({
          pathname: PATHNAME_LOGIN,
          search: genRedirectFormatStr(location.pathname)
        })
      }

    } else if (!userProps) {
      // 获取用户信息
      fetchUserInfo()
    }

  }, [fetchUserInfo, navigate, userProps, needLogin, dispatch, location.pathname])

  return {
    userInfo: userProps,
    error,
    loading
  }
}