import { BaseFCProps } from '@/types/base'
import { DxPageSchema } from '@/types/work'
import classNames from 'classnames'
import React, { FC } from 'react'
import styles from './index.module.scss'
import { WorkState, selectCurrentPage } from '@/store/reducers/work.reducer'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalState } from '@/store'
import { pick } from 'lodash'

export interface EditWrapperProps extends BaseFCProps {
  page: DxPageSchema
}

const PageEditWrapper: FC<EditWrapperProps> = ({ style, children, page }) => {
  const { data } = useSelector<GlobalState, WorkState>(store => store.work)
  // const currentPage = getCurrentPage(data?.schemas)
  const dispatch = useDispatch()

  const rootClass = classNames({
    [styles.root]: true,
    [styles.active]: data?.schemas?.curerntPageSelected
  })

  const onWrapperClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (page.id) {
      dispatch(selectCurrentPage())
    }
  }

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