import { addBrick, getCopiedBrick, selectCurrentBrick, setCopiedBrick, removeBrick as removeBrickAction, switchBrick, getBrickIndex, getCurrentPageBrickLength } from '@/store/reducers/work.reducer'
import { DxBrickSchema, WorkProps } from '@/types/work'
import { Modal, message } from 'antd'
import { cloneDeep } from 'lodash'
import { useDispatch } from 'react-redux'

function useBrickShortcut(workData: WorkProps | null, brick: DxBrickSchema) {
  const dispatch = useDispatch()

  const copyBrick = () => {
    setCopiedBrick(brick)
    message.success('组件复制成功')
  }

  const pasteBrick = () => {
    const copiedBrick = getCopiedBrick()
    if (!copiedBrick) {
      message.warning('当前没有可以粘贴的组件，请先复制某个组件')
      return
    }
    dispatch(addBrick(cloneDeep(copiedBrick)))
  }

  const cancelSelectBrick = () => {
    dispatch(selectCurrentBrick({ id: '' }))
  }

  const removeBrick = () => {
    Modal.confirm({
      content: '确定要删除组件吗',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        dispatch(removeBrickAction({ id: brick.id as string }))
      }
    })
  }

  const upBrick = () => {
    if (brick.props?.style.position !== 'static') {
      return
    }

    const brickIndex = getBrickIndex(workData?.schemas, brick)
    if (brickIndex > 0) {
      dispatch(switchBrick({ direction: 'up' }))
    }
  }

  const downBrick = () => {
    if (brick.props?.style.position !== 'static') {
      return
    }

    const length = getCurrentPageBrickLength(workData?.schemas, false)
    const brickIndex = getBrickIndex(workData?.schemas, brick)
    if (brickIndex < length -1) {
      dispatch(switchBrick({ direction: 'down' }))
    }
  }

  return {
    copyBrick,
    pasteBrick,
    cancelSelectBrick,
    removeBrick,
    upBrick,
    downBrick,
  }
}

export default useBrickShortcut
