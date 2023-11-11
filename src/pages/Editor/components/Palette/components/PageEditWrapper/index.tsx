import { BaseFCProps } from '@/types/base'
import { DxPageSchema } from '@/types/work'
import classNames from 'classnames'
import React, { FC, useCallback, useMemo } from 'react'
import styles from './index.module.scss'
import { WorkState, getCurrentPage, setCurrentPage } from '@/store/reducers/work.reducer'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalState } from '@/store'
import { pick } from 'lodash'

export interface EditWrapperProps extends BaseFCProps {
  page: DxPageSchema
}

const PageEditWrapper: FC<EditWrapperProps> = ({ style, children, page }) => {
  const { data } = useSelector<GlobalState, WorkState>(store => store.work)
  const currentPage = getCurrentPage(data?.schemas)
  const dispatch = useDispatch()

  const rootClass = useMemo(() => classNames({
    [styles.root]: true,
    [styles.active]: page.id === currentPage?.id && !data?.schemas?.currentBrickId
  }), [page.id, currentPage?.id, data?.schemas?.currentBrickId])

  const onWrapperClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (page.id) {
      dispatch(setCurrentPage({ id: page.id }))
    }
  }, [dispatch, page.id])

  return (
    <div 
      className={ rootClass } 
      style={{ 
        ...style, 
        ...pick(page.props?.style, ['position', 'width', 'height']),
      }} 
      onClick={ onWrapperClick }
      >
      { children }
    </div>
  )
}

export default PageEditWrapper