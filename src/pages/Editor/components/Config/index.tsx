import { GlobalState } from '@/store'
import { WorkState, getCurrentBrick, getCurrentPage, selectCurrentPage, setSchemaEditProp } from '@/store/reducers/work.reducer'
import { BrickConfig, BrickConfigGroupOption, transferSchemaConfiguration } from '@/utils/brick-tools/transfer-config'
import { FC, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.scss'
import { Button, Collapse, Empty, List, Result, Tabs } from 'antd'
import ConfigItem from './components/Item'
import { BaseFCProps } from '@/types/base'
import { DxBrickSchema, DxPageSchema, WorkProps } from '@/types/work'
import LayerConfig from './components/LayerConfig'
import { LockFilled } from '@ant-design/icons'
import useGlobalPropChanged from '../../hooks/useGlobalPropChanged'
import EventsInput from './components/EventsInput'

function isGroupOptionWithValidConfigs(option: BrickConfigGroupOption) {
  return option.configs && option.configs.length > 0 && !option.configs.every(config => config === null)
}

export interface ConfigTabComponentProps extends BaseFCProps {
  workData: WorkProps
  currentSchema: DxBrickSchema | DxPageSchema | null
}

const SchemaConfig: FC<ConfigTabComponentProps> = ({ workData, currentSchema }) => {
  const [groupOptions, setGroupOptions] = useState<BrickConfigGroupOption[] | null>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!currentSchema) {
      return
    }

    const groupOptions = transferSchemaConfiguration(currentSchema)
    setGroupOptions(groupOptions)

  }, [currentSchema])

  const onUnlockClick = () => {
    dispatch(setSchemaEditProp({
      isLocked: !!!currentSchema?.editProps?.isLocked
    }))
  }
  
  return (
    <>
      {
        !currentSchema
        ?
        <Empty description='未选中任何组件' />
        :
        currentSchema.editProps?.isLocked
        ?
        <Result 
          icon={ <LockFilled /> }
          title={ '组件已锁定，无法编辑' }
          extra={
            <Button type='primary' onClick={ onUnlockClick }>
              解锁
            </Button>
          }
          />
        :
        groupOptions && groupOptions.length > 0 &&
        <Collapse
          items={
            groupOptions.filter(option => isGroupOptionWithValidConfigs(option)).map(groupOption => {
              const { type } = groupOption

              if (type === 'events') {
                return {
                  key: groupOption.type,
                  label: <div className={ styles.collapseLabelWrapper }>{ groupOption.name }</div>,
                  children: (
                    <EventsInput
                      workData={ workData }
                      schema={ currentSchema }
                      />
                  )
                }
              }

              return {
                key: groupOption.type,
                label: <div className={ styles.collapseLabelWrapper }>{ groupOption.name }</div>,
                children: (
                  <List
                    dataSource={ groupOption.configs.filter(config => config !== null) as BrickConfig[] }
                    renderItem={ (config) => {    
                      return (
                        <List.Item>
                          <ConfigItem config={ config } workData={ workData } schema={ currentSchema } />
                        </List.Item>
                      )
                    } }
                    />
                )
              }
            })
          }
          defaultActiveKey={ groupOptions[0].type }
          />
      }
    </>
  )
}

const Config: FC = () => {
  const { data } = useSelector<GlobalState, WorkState>(store => store.work)
  const currentBrick = getCurrentBrick(data?.schemas)
  const currentPage = getCurrentPage(data?.schemas)
  const dispatch = useDispatch()
  const isUserActive = useRef(false)

  useGlobalPropChanged(currentBrick)

  const [tabKey, setTabKey] = useState<'component' | 'layer' | 'page'>('component') 

  useEffect(() => {
    if (!data?.schemas) {
      return
    }

    // 主动点击优先级最高，不follow下面的策略
    const curerntPageSelected = data.schemas.curerntPageSelected
    if (isUserActive.current === true) {
      if (tabKey === 'page' && !curerntPageSelected) {
        dispatch(selectCurrentPage())
      }
      isUserActive.current = false
      return
    }

    // 在page tab下选中了某个组件，自动切换到component tab
    if (tabKey !== 'layer') {
      if (currentBrick && !curerntPageSelected) {
        setTabKey('component')
      }
    }

    // 在非page tab下选中了page，自动切换到page tab
    if (tabKey !== 'page') {
      if (!currentBrick && curerntPageSelected) {
        setTabKey('page')
      }
    }

  }, [currentBrick, data?.schemas, dispatch, tabKey])

  const onTabClick = (activeKey: string) => {
    isUserActive.current = true
    const _tabKey = activeKey as 'component' | 'layer' | 'page'
    setTabKey(_tabKey)
  }

  return (
    <div className={ styles.root }>
      <div className={ styles.contentWrapper }>
        <Tabs
          activeKey={ tabKey }
          onTabClick={ onTabClick } 
          items={[{
            key: 'component',
            label: '组件配置',
            children: (
              <>
                {
                  data &&
                  <SchemaConfig workData={ data } currentSchema={ currentBrick } />
                }
              </>
            )
          }, {
            key: 'layer',
            label: '图层配置',
            children: (
              data &&
              <LayerConfig workData={ data } currentSchema={ currentPage } />
            )
          }, {
            key: 'page',
            label: '页面配置',
            children: (
              <>
                {
                  data &&
                  <SchemaConfig workData={ data } currentSchema={ currentPage } />
                }
              </>
            )
          }]}
          />
      </div>
    </div>
  )
}

export default Config
