import { DxBrickSchema, DxLegoSchema, WorkProps } from '@/types/work'
import { TextProps } from '../types/work'

// export interface DxBrickSchema<T = any> {
//   id?: string
//   title?: string // 组件名称 
//   desc?: string // 组件描述
//   component?: string // 组件对应的组件名（大写）
//   sampleImg?: string // 组件展示时的示例图片
//   props?: DxBrickProps<T> // 组件样式属性
// }

// export type DxLegoPageSchema = DxBrickSchema<{ children: React.ReactNode, [key: string]: any }>

const mockBrick1: DxBrickSchema<TextProps> = {
  id: '1',
  title: '',
  desc: '',
  component: 'Text',
  sampleImg: '',
  props: {
    style: {
      color: 'green'
    },
    custom: {
      text: '1234'
    }
  }
}

const mockBrick2: DxBrickSchema<TextProps> = {
  id: '2',
  title: '',
  desc: '',
  component: 'Text',
  sampleImg: '',
  props: {
    style: {
      color: 'red'
    },
    custom: {
      text: '5678'
    }
  }
}

const mockBrick3: DxBrickSchema<TextProps> = {
  id: '3',
  title: '',
  desc: '',
  component: 'Text',
  sampleImg: '',
  props: {
    style: {
      color: 'black'
    },
    custom: {
      text: '9012'
    }
  }
}

const schemas: DxLegoSchema = {
  currentPageId: '1',
  currentBrickId: '1',
  pages: [{
    id: '1',
    title: '未命名页面',
    desc: '无描述',
    component: 'Page',
    sampleImg: '',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'yellow'
      },
      custom: {
        children: [mockBrick1, mockBrick2, mockBrick3]
      }
    }
  }]
}

export const mockWorkProps: WorkProps = {
  _id: '',
  id: '1',
  uuid: '1234',
  title: '无标题作品',
  desc: '作品描述',
  coverImg: '',
  schemas,
  isTemplate: false,
  isPublic: false,
  isHot: false,
  author: 'test',
  copiedCount: 1,
  status: 'not-published',
  user: 'test2',
  latestPublishAt: undefined,
  channels: []
}