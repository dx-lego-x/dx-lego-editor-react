import { EditEventProps, DxBrickEditProps, DxBrickSchema, DxLegoSchema, WorkProps } from '@/types/work'
import { BrickConfigType, PropNameKeys } from '@/utils/brick-tools/transfer-config'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import {  } from 'lodash'
import { swap } from '@/utils/array'

export interface WorkState {
  data: WorkProps | null
}

const INIT_STATE: WorkState = {
  data: null
}

const slice = createSlice({
  name: 'work',

  initialState: INIT_STATE,

  reducers: {
    setWorkData(state, action: PayloadAction<WorkProps>) {
      state.data = action.payload
    },

    selectCurrentPage(state) {
      if (!state.data || !state.data.schemas) {
        return
      }

      state.data.schemas.curerntPageSelected = true
      state.data.schemas.currentBrickId = ''
    },


    selectCurrentBrick(state, action: PayloadAction<{ id: string }>) {
      if (!state.data || !state.data.schemas) {
        return
      }

      state.data.schemas.curerntPageSelected = false
      state.data.schemas.currentBrickId = action.payload.id
    },

    addBrick(state, action: PayloadAction<DxBrickSchema>) {
      const currentPage = getCurrentPage(state.data?.schemas)
      if (!currentPage) {
        return
      }

      const brickSchema = action.payload
      brickSchema.id = uuidv4()
      currentPage.props?.custom.children.push(brickSchema)
    },

    setSchemaProp(state, action: PayloadAction<{ type: BrickConfigType, propName: PropNameKeys, newValue: any }>) {
      const { type, propName, newValue } = action.payload

      const currentBrick = getCurrentBrick(state.data?.schemas)
      if (!currentBrick) {
        const currentPage = getCurrentPage(state.data?.schemas)
        if (currentPage) {
          // @ts-ignore
          currentPage.props[type][propName] = newValue
        }

      } else {
        // @ts-ignore
        currentBrick.props[type][propName] = newValue
      }
    },

    setSchemaEditProp(state, action: PayloadAction<DxBrickEditProps>) {
      const currentBrick = getCurrentBrick(state.data?.schemas)
      if (!currentBrick) {
        return
      }

      if (!currentBrick.editProps) {
        currentBrick.editProps = {}
      }

      currentBrick.editProps = {
        ...currentBrick.editProps,
        ...action.payload
      }
    },

    setEvent(state, action: PayloadAction<EditEventProps>) {
      const birck = getCurrentBrick(state.data?.schemas)
      if (!birck || !birck.props) {
        return
      }

      const { eventName, type, handler } = action.payload

      const events = birck.props?.events || {}
      
      birck.props.events = {
        ...events,
        [eventName]: {
          type,
          handler
        }
      }

    },

    removeEvent(state, action: PayloadAction<{ eventName: string }>) {
      const brick = getCurrentBrick(state.data?.schemas)
      if (!brick) {
        return
      }


      if (!brick.props || !brick.props.events) {
        return
      }

      const { eventName } = action.payload
      delete brick.props.events[eventName]
    },
    
    removeBrick(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload
      if (!id) {
        return
      }

      if (!state.data?.schemas) {
        return
      }

      const currentPage = getCurrentPage(state.data.schemas)
      if (!currentPage) {
        return
      }

      const children = currentPage.props?.custom.children
      if (!children || children.length === 0) {
        return
      }

      const index = children.findIndex((item: DxBrickSchema) => item.id === id)
      if (index >= 0) {
        children.splice(index, 1)
        // 删除后置空当前选中的brick
        state.data.schemas.currentBrickId = ''
      }
    },

    moveBrick(state, action: PayloadAction<{ x: number, y: number }>) {
      const { x, y } = action.payload

      const currentBrick = getCurrentBrick(state.data?.schemas)
      if (currentBrick && currentBrick.props) {
        currentBrick.props.style.left = x + 'px'
        currentBrick.props.style.top = y + 'px'
      }
    },

    switchBrick(state, action: PayloadAction<{ direction: 'up' | 'down' }>) {
      const schemas = state.data?.schemas
      const brickArr = state.data?.schemas?.pages?.[0].props?.custom.children as DxBrickSchema[]
      if (!brickArr || brickArr.length === 0) {
        return
      }

      const currentBrick = getCurrentBrick(schemas)
      if (!currentBrick) {
        return
      }

      const { direction } = action.payload
      const currentIndex = getBrickIndex(schemas, currentBrick)
      if (direction === 'up') {
        if (currentIndex > 0) {
          // 找到上一个position为static的组件，并且交换
          for(let i = currentIndex - 1; i >= 0; i--) {
            const brickForSwitching = brickArr[i]
            if (brickForSwitching.props?.style.position === 'static') {
              swap(brickArr, currentIndex, i)
              break
            }
          }
        }
      } else if (direction === 'down') {
        // 找到下一个position为static的组件，交换
        if (currentIndex < brickArr.length - 1) {
          for (let i = currentIndex + 1; i < brickArr.length; i++) {
            const brickForSwitching = brickArr[i]
            if (brickForSwitching.props?.style.position === 'static') {
              swap(brickArr, currentIndex, i)
              break
            }
          }
        }
      }

    }
  },
})

export function getCurrentPage(schemas?: DxLegoSchema) {
  const page = schemas?.pages.find(page => page.id === schemas?.currentPageId) || null
  return page
}

export function getCurrentPageBrickLength(schemas?: DxLegoSchema, withAbsolute = true): number {
  const currentPage = getCurrentPage(schemas)

  if (!currentPage || !currentPage.props?.custom.children) {
    return -1
  }

  const children = currentPage.props.custom.children as DxBrickSchema[]

  if (withAbsolute) {
    return children.length
  } else {
    return children.filter(item => item.props?.style.position === 'static').length
  }
}

export function getCurrentBrick(schemas?: DxLegoSchema) {
  const page = getCurrentPage(schemas)
  if (!page) {
    return null
  }

  const children = page.props?.custom.children as DxBrickSchema[]
  if (!children) {
    return null
  }

  const currentBrickId = schemas?.currentBrickId
  const brick = children.find((brick: DxBrickSchema) => brick.id === currentBrickId) || null
  return brick
}

export function getBrickIndex(schemas?: DxLegoSchema, brick?: DxBrickSchema): number {
  const currentPage = getCurrentPage(schemas)
  if (!currentPage) {
    return -1
  }

  const children = currentPage.props?.custom.children as DxBrickSchema[]
  if (!children) {
    return -1
  }

  let _brick: DxBrickSchema | null = brick || null
  if (!_brick) {
    _brick = getCurrentBrick(schemas)
  }

  if (_brick === null) {
    return -1
  }

  return children.findIndex(item => item.id === _brick?.id)

}

let copiedBrick: DxBrickSchema | null = null
export function setCopiedBrick(brick: DxBrickSchema) {
  copiedBrick = brick
}

export function getCopiedBrick() {
  return copiedBrick
}

export const {
  setWorkData,
  selectCurrentPage,
  selectCurrentBrick,
  addBrick,
  setSchemaProp,
  setSchemaEditProp,
  setEvent,
  removeEvent,
  removeBrick,
  moveBrick,
  switchBrick,

} = slice.actions
export default slice.reducer
