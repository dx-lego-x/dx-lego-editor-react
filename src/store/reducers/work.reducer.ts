import { DxBrickSchema, DxLegoSchema, WorkProps } from '@/types/work'
import { BrickConfigType, PropNameKeys } from '@/utils/brick-tools/transfer-config'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

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

    setCurrentBrick(state, action: PayloadAction<{ id: string }>) {
      if (!state.data || !state.data.schemas) {
        return
      }

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

    setBrickProp(state, action: PayloadAction<{ type: BrickConfigType, propName: PropNameKeys, newValue: any }>) {
      const { type, propName, newValue } = action.payload

      const currentBrick = getCurrentBrick(state.data?.schemas)
      if (!currentBrick) {
        return
      }

      // @ts-ignore
      currentBrick.props[type][propName] = newValue
    }
  },
})

export function getCurrentPage(schemas?: DxLegoSchema) {
  const page = schemas?.pages.find(page => page.id === schemas?.currentPageId)
  return page
}

export function getCurrentBrick(schemas?: DxLegoSchema) {
  const page = getCurrentPage(schemas)
  if (!page) {
    return null
  }

  const children = page.props?.custom.children
  if (!children) {
    return null
  }

  const currentBrickId = schemas?.currentBrickId
  const brick = children.find(brick => brick.id === currentBrickId) || null
  return brick
}

export const {
  setWorkData,
  setCurrentBrick,
  addBrick,
  setBrickProp

} = slice.actions
export default slice.reducer