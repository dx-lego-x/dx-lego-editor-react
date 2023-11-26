import { BaseFCProps } from '@/types/base'
import { Dropdown, MenuProps } from 'antd'
import classNames from 'classnames'
import React, { FC } from 'react'
import styles from './index.module.scss'
import { getBrickIndex, getCurrentPageBrickLength } from '@/store/reducers/work.reducer'
import { DxBrickSchema, WorkProps } from '@/types/work'
import { CloseOutlined, CopyOutlined, DeleteOutlined, DiffOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import useBrickShortcut from '@/pages/Editor/hooks/useBrickShortcut'

export interface ContextMenuProps extends BaseFCProps {
  workData: WorkProps | null
  holder: DxBrickSchema
}

const ContextMenu: FC<ContextMenuProps> = ({ workData, holder, children }) => {
  const { copyBrick, pasteBrick, cancelSelectBrick, removeBrick, upBrick, downBrick } = useBrickShortcut(workData, holder)

  const MenuLabel = (text: string, icon: React.ReactNode, shortcut?: string, danger: boolean = false) => 
    <span className={ classNames({[styles.menuLabel]: true, [styles.danger]: danger}) }>
      { icon }
      &nbsp;
      { text }
      {
        shortcut
        &&
        <>
          &nbsp;&nbsp;&nbsp;
          { shortcut }
        </>
      }
    </span>

  const items: MenuProps['items'] = [{
    key: 'copy',
    label: MenuLabel('复制组件', <CopyOutlined/>, 'ctrl + c'),
    onClick: (info) => {
      info.domEvent.stopPropagation()
      // setCopiedBrick(holder)
      // message.success('组件复制成功')
      copyBrick()
    }
  }, {
    key: 'paste',
    label: MenuLabel('粘贴组件', <DiffOutlined/>, 'ctrl + v'),
    onClick: (info) => {
      info.domEvent.stopPropagation()

      // const copiedBrick = getCopiedBrick()
      // if (!copiedBrick) {
      //   message.warning('当前没有可以粘贴的组件，请先复制某个组件')
      //   return
      // }
      // dispatch(addBrick(cloneDeep(copiedBrick)))
      pasteBrick()
    }
  }, {
    key: 'cancel-selected',
    label: MenuLabel('取消选中', <CloseOutlined/>, 'Esc'),
    onClick: (info) => {
      info.domEvent.stopPropagation()
      // dispatch(selectCurrentBrick({ id: '' }))
      cancelSelectBrick()
    }
  }, {
    key: 'delete',
    label: MenuLabel('删除组件', <DeleteOutlined/>, 'Backspace/Delete', true),
    onClick: (info) => {
      info.domEvent.stopPropagation()
      // Modal.confirm({
      //   content: '确定要删除组件吗',
      //   cancelText: '取消',
      //   okText: '确定',
      //   onOk: () => {
      //     dispatch(removeBrick({ id: holder.id as string }))
      //   }
      // })
      removeBrick()
    },
  }]

  if (holder.props?.style.position === 'static') {
    const length = getCurrentPageBrickLength(workData?.schemas, false)
    if (length > 0) {
      const brickIndex = getBrickIndex(workData?.schemas, holder)

      // brickIndex === 0时，无法向上移动，隐藏向上按钮
      if (brickIndex > 0) {
        items.push({
          key: 'up',
          label: MenuLabel('向上移动', <UpOutlined/>, '↑'),
          onClick: (info) => {
            info.domEvent.stopPropagation()
            // dispatch(switchBrick({ direction: 'up' }))
            upBrick()
          }
        })
      }

      // brickIndex === length - 1时，无法向下移动，隐藏向下按钮
      if (brickIndex < (length - 1)) {
        items.push({
          key: 'down',
          label: MenuLabel('向下移动', <DownOutlined/>, '↓'),
          onClick: (info) => {
            info.domEvent.stopPropagation()
            // dispatch(switchBrick({ direction: 'down' }))
            downBrick()
          }
        })
      }
    }
  }

  return (
    <Dropdown trigger={['contextMenu']} menu={{ items }}>
      { children }
    </Dropdown>
  )
}

export default ContextMenu
