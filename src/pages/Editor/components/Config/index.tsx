import { GlobalState } from '@/store'
import { WorkState, getCurrentBrick, getCurrentPage, setCurrentPage } from '@/store/reducers/work.reducer'
import { BrickConfig, BrickConfigGroupOption, transferSchemaConfiguration } from '@/utils/brick-tools/transfer-config'
import { FC, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.scss'
import { Collapse, Empty, List, Tabs } from 'antd'
import ConfigItem from './components/Item'
import { BaseFCProps } from '@/types/base'
import { DxBrickSchema, DxPageSchema, WorkProps } from '@/types/work'

function isGroupOptionWithValidConfigs(option: BrickConfigGroupOption) {
  return option.configs && option.configs.length > 0 && !option.configs.every(config => config === null)
}

interface ComponentConfigProps extends BaseFCProps {
  workData: WorkProps
  currentSchema: DxBrickSchema | DxPageSchema | null
}
const SchemaConfig: FC<ComponentConfigProps> = ({ workData, currentSchema }) => {
  const [groupOptions, setGroupOptions] = useState<BrickConfigGroupOption[] | null>(null)

  useEffect(() => {
    if (!currentSchema) {
      return
    }

    const groupOptions = transferSchemaConfiguration(currentSchema)
    setGroupOptions(groupOptions)

  }, [currentSchema])
  
  return (
    <>
      {
        !currentSchema
        ?
        <Empty description='未选中任何组件' />
        :
        groupOptions && groupOptions.length > 0 &&
        <Collapse
          items={
            groupOptions.filter(option => isGroupOptionWithValidConfigs(option)).map(groupOption => {
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
  const currentBrick = useMemo(() => getCurrentBrick(data?.schemas), [data?.schemas])
  const currentPage = useMemo(() => getCurrentPage(data?.schemas), [data?.schemas])
  const dispatch = useDispatch()

  const [tabKey, setTabKey] = useState<'component' | 'layer' | 'page'>('component') 

  useEffect(() => {
    if (currentBrick) {
      setTabKey('component')
    }

    if (currentPage && !currentBrick) {
      setTabKey('page')
    }
  }, [currentBrick, currentPage])

  const onTabClick = (activeKey: string) => {
    const _tabKey = activeKey as 'component' | 'layer' | 'page'
    setTabKey(_tabKey)

    if (_tabKey === 'page') {
      dispatch(setCurrentPage({ id: currentPage?.id || '' }))
    }
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
            children: <div>2</div>
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