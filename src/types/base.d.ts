import React, { PropsWithChildren } from 'react'

export type BaseFCProps = PropsWithChildren<{
  style?: React.CSSProperties
  classname?: string
}>

export type Api<R = any, P = any> = (params?: P) => Promise<R>

export interface BaseResponse<T> {
  errno: number
  data?: T
  message?: string
}

export interface HttpErrorDetail {
  type: 'http' | 'biz' | 'unknown'
  errno?: number
  message: string
  httpCode?: number
}
