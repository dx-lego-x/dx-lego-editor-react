import React, { FC } from 'react'
import { ConfigTabComponentProps } from '../..'
import { DxBrickSchema, WorkProps } from '@/types/work'
import { Button, Empty, List, Tooltip } from 'antd'
import styles from './index.module.scss'
import { DragOutlined, EyeInvisibleOutlined, EyeOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { setCurrentBrick, setSchemaEditProp } from '@/store/reducers/work.reducer'
import classNames from 'classnames'

const LayerItem: FC<{ workData: WorkProps, brickSchema: DxBrickSchema }> = ({ workData, brickSchema}) => {
  const dispatch = useDispatch()

  const onItemClick = (brickSchema: DxBrickSchema) => {
    dispatch(setCurrentBrick({ id: brickSchema.id as string }))
  }

  const onHideClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    dispatch(setCurrentBrick({ id: brickSchema.id as string }))
    dispatch(setSchemaEditProp({ isHidden: !!!brickSchema.editProps?.isHidden }))
  }

  const onLockClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    dispatch(setCurrentBrick({ id: brickSchema.id as string }))
    dispatch(setSchemaEditProp({ isLocked: !!!brickSchema.editProps?.isLocked }))
  }

  const itemWrapperClassnames = classNames({
    [styles.itemWrapper]: true,
    [styles.active]: workData.schemas?.currentBrickId === brickSchema.id
  })


  return (
    <div className={ itemWrapperClassnames } onClick={ () => onItemClick(brickSchema) }>
      <div>
        <Tooltip title={ !!brickSchema.editProps?.isHidden ? '可见' : '隐藏' }>
          <Button 
            type='text' 
            icon={ !!brickSchema.editProps?.isHidden ? <EyeOutlined /> : <EyeInvisibleOutlined /> } 
            onClick={ onHideClick } 
            />
        </Tooltip>
        <Tooltip title={ !!brickSchema.editProps?.isLocked ? '解锁' : '锁定' }>
          <Button 
            type='text' 
            icon={ !!brickSchema.editProps?.isLocked ? <UnlockOutlined /> : <LockOutlined /> }
            onClick={ onLockClick }
            />
        </Tooltip>
        { brickSchema.title }
      </div>
      <Button type='text' icon={ <DragOutlined/> } />
    </div>
  )
}

const LayerConfig: FC<ConfigTabComponentProps> = ({ workData, currentSchema }) => {
  const childrenBrickSchemas = currentSchema?.props?.custom.children as DxBrickSchema[] | undefined | null

  return (
    <>
      {
        (childrenBrickSchemas && childrenBrickSchemas.length > 0)
        ?
        <List
          bordered
          dataSource={ childrenBrickSchemas }
          renderItem={ brickSchema => {
            return (
              <List.Item>
                <LayerItem workData={ workData } brickSchema={ brickSchema }/>
              </List.Item>
            )
          }}
          />
        :
        <Empty description='还未添加任何组件' />
      }
    </>
  )
}

export default LayerConfig
