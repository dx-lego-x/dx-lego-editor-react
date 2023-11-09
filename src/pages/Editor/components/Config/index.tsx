import { GlobalState } from '@/store'
import { WorkState, getCurrentBrick } from '@/store/reducers/work.reducer'
import { BrickConfig, BrickConfigGroupOption, transferBrickConfiguration } from '@/utils/brick-tools/transfer-config'
import { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './index.module.scss'
import { Collapse, List } from 'antd'
import ConfigItem from './components/Item'

function isGroupOptionWithValidConfigs(option: BrickConfigGroupOption) {
  return option.configs && option.configs.length > 0 && !option.configs.every(config => config === null)
}

const Config: FC = () => {
  const { data } = useSelector<GlobalState, WorkState>(store => store.work)
  const currentBrick = getCurrentBrick(data?.schemas)
  const [groupOptions, setGroupOptions] = useState<BrickConfigGroupOption[] | null>(null)

  useEffect(() => {
    if (!currentBrick) {
      return
    }

    const groupOptions = transferBrickConfiguration(currentBrick)
    setGroupOptions(groupOptions)


  }, [currentBrick])

  return (
    <div className={ styles.root }>
      <div className={ styles.contentWrapper }>
        {
          data && currentBrick && groupOptions && groupOptions.length > 0 &&
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
                            <ConfigItem config={ config } workData={ data } brick={ currentBrick } />
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
      </div>
    </div>
  )
}

export default Config