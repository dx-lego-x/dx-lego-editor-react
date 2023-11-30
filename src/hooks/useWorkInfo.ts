import { fetchWorkByUuidApi } from '@/api/work.api'
import { GlobalState } from '@/store'
import { WorkState, setWorkData } from '@/store/reducers/work.reducer'
import { useRequest } from 'ahooks'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import useUserInfo from './useUserInfo'
import { message } from 'antd'

export default function useWorkInfo() {
  const { userInfo } = useUserInfo(true)

  const { data: workInfo } = useSelector<GlobalState, WorkState>(store => store.work)
  const dispatch = useDispatch()
  const { uuid } = useParams()
  const lastuuid = useRef<string | undefined>(undefined)

  const { run: fetchWorkByUuid, loading } = useRequest(fetchWorkByUuidApi, {
    manual: true,

    onSuccess(res) {
      dispatch(setWorkData(res))
    },

    onError(error) {
      console.log('fetchWorkInfo failed ->', error)
      message.error('获取作品信息失败：' + error.message)
    }
  })

  useEffect(() => {
    if (!userInfo) {
      return
    }

    if (!uuid) {
      return
    }

    if (lastuuid.current !== uuid) {
      fetchWorkByUuid({ uuid })
      lastuuid.current = uuid
    }
  }, [userInfo, fetchWorkByUuid, uuid, workInfo])

  return {
    workInfo,
    loading,
  }
}