import React, { FC, useCallback } from 'react'
import styles from './index.module.scss'
import { BaseFCProps } from '@/types/base'
import classNames from 'classnames'
import { DxBrickSchema } from '@/types/work'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalState } from '@/store'
import { WorkState, getCurrentBrick, setCurrentBrick } from '@/store/reducers/work.reducer'
import { pick } from 'lodash'

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

  const onWrapperClick = useCallback(() => {
    dispatch(setCurrentBrick({ id: brick.id || '' }))
  }, [brick.id, dispatch])

  return (
    <div 
      className={ rootClass } 
      style={{ ...style, ...pick(brick.props?.style, ['position', 'left', 'top', 'right', 'bottom', 'width', 'height']) }} 
      onClick={ onWrapperClick }
      >
      { children }
    </div>
  )
}

export default EditWrapper