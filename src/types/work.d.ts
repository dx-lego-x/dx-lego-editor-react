// import { DxBrickProps  } from 'dx-lego-bricks'
// 
// export interface DxBrickSchema<T = any> {
//   id?: string
//   title?: string // 组件名称 
//   desc?: string // 组件描述
//   component?: string // 组件对应的组件名（大写）
//   sampleImg?: string // 组件展示时的示例图片
//   props?: DxBrickProps<T> // 组件属性，包括style和custom
// }

// export type DxPageSchema = DxBrickSchema<{ children: DxBrickSchema[], [key: string]: any }>

// export interface DxLegoSchema {
//   pages: DxPageSchema[]
//   currentPageId: string
//   currentBrickId: string
// }

// interface ChannelProps {
//   name: string
//   id: string
// }

// export interface WorkProps {
//   id?: number
//   uuid: string
//   title: string
//   desc: string
//   coverImg?: string
//   schemas?: DxLegoSchema
//   isTemplate?: boolean
//   isPublic?: boolean
//   isHot?: boolean
//   author: string
//   copiedCount: number
//   status: 'removed' | 'not-published' | 'published'
//   user: string
//   latestPublishAt?: Date
//   channels?: ChannelProps[]
// }

import { DxBrickProps } from 'dx-lego-bricks'

export * from 'dx-lego-bricks'

export interface DxBrickSchema<T = any> {
  id?: string
  title?: string // 组件名称
  desc?: string // 组件描述
  component?: string // 组件对应的组件名（大写）
  sampleImg?: string // 组件展示时的示例图片
  props?: DxBrickProps<T> // 组件属性，包括style和custom
}

export type DxPageSchema = DxBrickSchema<{ children: DxBrickSchema[], [key: string]: any }>

export interface DxLegoSchema {
  pages: DxPageSchema[]
  currentPageId: string
  currentBrickId: string
}

export interface ChannelProps {
  name: string
  id: string
}

export interface WorkModelProps {
  // id?: number
  uuid: string
  title: string
  desc: string
  coverImg?: string
  schemas?: DxLegoSchema
  isTemplate?: boolean
  isPublic?: boolean
  isHot?: boolean
  author: string
  copiedCount: number
  status: 'removed' | 'not-published' | 'published'
  user: string
  latestPublishAt?: Date
  channels?: ChannelProps[]
}

export interface WorkProps extends WorkModelProps {
  _id: string
  id: string
}

export interface WorkListData {
  count: number
  list: WorkProps[]
  pageSize: number
  pageIndex: number
}

export interface SelectorBrickModelProps {
  id: string
  type: 'text' | 'image' | 'shape'
  schema: DxBrickSchema<TextProps>
}

export interface SelectorBrickProps extends SelectorBrickModelProps {
  _id: string
  id: string
}

export interface SelectorBrickGroupInfo {
  id: string
  groupType: string
  groupName: string
  groupBricks: SelectorBrickProps[]
}
