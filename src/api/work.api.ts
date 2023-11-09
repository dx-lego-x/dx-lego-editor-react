import { Api } from '@/types/base'
import { SelectorBrickGroupInfo, WorkListData, WorkProps } from '@/types/work'
import { getApiPrefix, getInstance } from '@/utils/http'

const WORK_PREFIX = getApiPrefix() + '/work'

export const createWorkApi: Api<WorkProps, Pick<WorkProps, 'title' | 'desc'>> = (params) => {
  return getInstance().post(WORK_PREFIX, params)
}

export const fetchWorkByUuidApi: Api<WorkProps, { uuid: string }> = (params) => {
  return getInstance().get(WORK_PREFIX + '/' + params?.uuid)
}

export const fetchMyWorksApi: Api<WorkListData> = () => {
  return getInstance().get(WORK_PREFIX + '/myWorks')
}

export const fetchSelectorBricksApi: Api<SelectorBrickGroupInfo[]> = () => {
  return getInstance().get(WORK_PREFIX + '/selectorBricks')
}

export const updateWorkApi: Api<WorkProps, { uuid: string, payload: Partial<Pick<WorkProps, 'title' | 'desc' | 'schemas' | 'coverImg'>>}> = (params) => {
  const { uuid, payload } = params || {}
  return getInstance().patch(WORK_PREFIX + '/' + uuid, payload)
}