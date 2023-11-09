import React, { FC, useCallback, useState } from 'react'
import { useRequest } from 'ahooks'
import { fetchSelectorBricksApi } from '@/api/work.api'
import styles from './index.module.scss'
import { DxBrickSchema, SelectorBrickGroupInfo } from '@/types/work'
import { Collapse, List } from 'antd'
import { transferBrickComponent } from '@/utils/brick-tools/transfer-component'
import { useDispatch } from 'react-redux'
import { addBrick } from '@/store/reducers/work.reducer'
import { cloneDeep } from 'lodash'

const Selector: FC = () => {

  const [groupsInfo, setGroupsInfo] = useState<SelectorBrickGroupInfo[]>([])
  const dispatch = useDispatch()
  useRequest(fetchSelectorBricksApi, {
    onSuccess(res) {
      console.log(res)
      setGroupsInfo(res)
    },

    onError(error) {
      console.log(error)
    }
  })

  const onBrickSelected = useCallback((brick: DxBrickSchema) => {
    dispatch(addBrick(cloneDeep(brick)))
  }, [dispatch])

  return (
    <div className={ styles.root }>
      <div className={ styles.contentWrapper}>
        <div className={ styles.titleWrapper }>
          组件选择
        </div>
        {
          groupsInfo.length > 0
          &&
          <Collapse
            items={ groupsInfo.map(groupInfo => {
              return {
                key: groupInfo.id,
                label: groupInfo.groupName,
                children: (
                  <List
                    dataSource={ groupInfo.groupBricks }
                    renderItem={ brickInfo => {
                      const schema = brickInfo.schema
                      const Brick = transferBrickComponent(brickInfo.schema.component || '')
                      return (
                        <List.Item key={ brickInfo.id } onClick={ () => onBrickSelected(brickInfo.schema) }>
                          {
                            Brick &&
                            <Brick style={ schema.props?.style || {} } custom={ schema.props?.custom }/>
                          }
                        </List.Item>
                      )
                    }}
                    />
                )
              }
            }) }
            defaultActiveKey={ groupsInfo.map(item => item.id) }

            />
        }
        
        
      </div>
    </div>
  )
}

export default Selector