import { GlobalState } from '@/store'
import { WorkState, setWorkData } from '@/store/reducers/work.reducer'
import { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InputText from '@/components/InputText'
import { useRequest } from 'ahooks'
import { updateWorkApi } from '@/api/work.api'
import { message } from 'antd'

const TitleControl: FC = () => {
  const { data } = useSelector<GlobalState, WorkState>(store => store.work)
  const dispatch = useDispatch()
  const { run: updateWork } = useRequest(updateWorkApi, {
    manual: true,

    onSuccess(res) {
      dispatch(setWorkData(res))
    },

    onError(error) {
      message.error('修改标题失败，请重试：' + error.message)
    }
  })

  const onChange = (value: string) => {
    console.log('titleControl ->', value)
    if (!value || !data || !data.uuid) {
      return
    }

    updateWork({
      uuid: data.uuid,
      payload: {
        title: value
      }
    })
  }

  return (
    <InputText
      value={ data?.title || '' }
      onChange={ onChange }
      />
  )
}

export default TitleControl
