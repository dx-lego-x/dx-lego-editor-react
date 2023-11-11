import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './index.module.scss'
import { BaseFCProps } from '@/types/base'
import classNames from 'classnames'
import { DxBrickSchema } from '@/types/work'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalState } from '@/store'
import { WorkState, getCurrentBrick, moveBrick, setCurrentBrick } from '@/store/reducers/work.reducer'
import { pick } from 'lodash'

export interface EditWrapperProps extends BaseFCProps {
  brick: DxBrickSchema
}

const EditWrapper: FC<EditWrapperProps> = ({ style, children, brick }) => {
  const { data } = useSelector<GlobalState, WorkState>(store => store.work)
  const currentBrick = getCurrentBrick(data?.schemas)
  const dispatch = useDispatch()
  const [isMoving, setIsMoving] = useState(false)
  const [lastX, setLastX] = useState<number | null>(null)
  const [lastY, setLastY] = useState<number | null>(null)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const moveOffset = useRef<{ dx: number, dy: number }>({ dx: 0, dy: 0 })

  const rootClass = useMemo(() => classNames({
    [styles.root]: true,
    [styles.active]: brick.id === currentBrick?.id
  }), [brick.id, currentBrick?.id])

  const onWrapperClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (brick.id) {
      dispatch(setCurrentBrick({ id: brick.id }))
    }
  }, [brick.id, dispatch])

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
    window.onmousemove = (e) => onMouseMove(e)
    window.onmouseup = () => {
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

  }, [brick.props?.style.left, brick.props?.style.position, brick.props?.style.top, dispatch, onMouseMove])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsMoving(true)
    dispatch(setCurrentBrick({ id: brick.id || '' }))
  }, [brick.id, dispatch])

  return (
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
  )
}

export default EditWrapper
