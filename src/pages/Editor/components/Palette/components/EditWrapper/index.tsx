import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import { BaseFCProps } from '@/types/base'
import classNames from 'classnames'
import { DxBrickSchema } from '@/types/work'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalState } from '@/store'
import { WorkState, getCurrentBrick, moveBrick, selectCurrentBrick } from '@/store/reducers/work.reducer'
import { pick } from 'lodash'
import ContextMenu from '../ContextMenu'
import { HotkeysProvider, useHotkeys } from 'react-hotkeys-hook'
import useBrickShortcut from '@/pages/Editor/hooks/useBrickShortcut'

export interface EditWrapperProps extends BaseFCProps {
  brick: DxBrickSchema
}

const EditWrapper: FC<EditWrapperProps> = ({ style, children, brick }) => {
  const { data } = useSelector<GlobalState, WorkState>(store => store.work)
  const currentBrick = getCurrentBrick(data?.schemas)
  const dispatch = useDispatch()

  const rootClass = classNames({
    [styles.root]: true,
    [styles.active]: brick.id === currentBrick?.id
  })

  const onWrapperClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (brick.id) {
      dispatch(selectCurrentBrick({ id: brick.id }))
    }
  }
  
  // ================= move control ==================== // 
  const [isMoving, setIsMoving] = useState(false)
  const [lastX, setLastX] = useState<number | null>(null)
  const [lastY, setLastY] = useState<number | null>(null)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const moveOffset = useRef<{ dx: number, dy: number }>({ dx: 0, dy: 0 })

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isMoving) {
      return
    }

    if (lastX && lastY) {
        let dx = e.clientX - lastX
        let dy = e.clientY - lastY
        setTranslateX(translateX + dx)
        setTranslateY(translateY + dy)
        moveOffset.current.dx += dx
        moveOffset.current.dy += dy
    }
    setLastX(e.clientX)
    setLastY(e.clientY)
  }, [isMoving, lastX, lastY, translateX, translateY])

  useEffect(() => {
    const onmousemove = (e: MouseEvent) => onMouseMove(e)
    const onmouseup = () => {
      setIsMoving(false)
      setLastX(null)
      setLastY(null)

      if (brick.props?.style.position === 'absolute') {
        const { dx, dy } = moveOffset.current
        const originX = parseInt(brick.props?.style.left as string)
        const originY = parseInt(brick.props?.style.top as string)
        dispatch(moveBrick({ x: originX + dx, y: originY + dy }))
      }

      // 非绝对布局的组件回到之前的布局原点
      setTranslateX(0)
      setTranslateY(0)
      moveOffset.current = { dx: 0, dy: 0 }
      
    }

    window.addEventListener('mousemove', onmousemove)
    window.addEventListener('mouseup', onmouseup)

    return () => {
      window.removeEventListener('mousemove', onmousemove)
      window.removeEventListener('mouseup', onmouseup)
    }

  }, [brick.props?.style.left, brick.props?.style.position, brick.props?.style.top, dispatch, onMouseMove])

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsMoving(true)
    dispatch(selectCurrentBrick({ id: brick.id || '' }))
  }

  // =================== hotkeys =================== //
  const { copyBrick, pasteBrick, cancelSelectBrick, removeBrick, upBrick, downBrick } = useBrickShortcut(data, brick)
  useHotkeys('ctrl+c', () => {
    if (brick.id !== currentBrick?.id) {
      return
    }

    console.log('copy')
    copyBrick()
  })

  useHotkeys('ctrl+v', () => {
    if (brick.id !== currentBrick?.id) {
      return
    }
    console.log('paste')
    pasteBrick()
  })

  useHotkeys('Escape', () => {
    if (brick.id !== currentBrick?.id) {
      return
    }

    console.log('esc')
    cancelSelectBrick()
  })

  useHotkeys('Backspace', () => {
    if (brick.id !== currentBrick?.id) {
      return
    }

    console.log('backsapce')
    removeBrick()
  })

  useHotkeys('up', () => {
    if (brick.id !== currentBrick?.id) {
      return
    }

    console.log('up')
    upBrick()
  })

  useHotkeys('down', (e) => {
    if (brick.id !== currentBrick?.id) {
      return
    }

    console.log('down')
    downBrick()
  })

  return (
    <HotkeysProvider>
      <ContextMenu workData={ data } holder={ brick }>
          <div
            className={ rootClass } 
            style={{ 
              ...style, 
              ...pick(brick.props?.style, ['position', 'left', 'top', 'right', 'bottom', 'width', 'height']),
              transform: `translateX(${translateX}px) translateY(${translateY}px)`
            }} 
            onClick={ onWrapperClick }
            onMouseDown={ onMouseDown }
            >
            { children }
          </div>
      </ContextMenu>
    </HotkeysProvider>
  )
}

export default EditWrapper
