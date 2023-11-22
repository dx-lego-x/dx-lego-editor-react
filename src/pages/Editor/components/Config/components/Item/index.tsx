import { setSchemaProp } from '@/store/reducers/work.reducer'
import { BaseFCProps } from '@/types/base'
import { DxBrickSchema, DxPageSchema, WorkProps } from '@/types/work'
import { BrickConfig, defaultResultValueTransfer } from '@/utils/brick-tools/transfer-config'
import React, { FC, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styles from './index.module.scss'

export interface ConfigItemProps extends BaseFCProps {
  workData: WorkProps
  config: BrickConfig
  schema: DxBrickSchema | DxPageSchema
}
const Item: FC<ConfigItemProps> = ({ workData, config, schema }) => {
  const { type, propName, label, componentOption } = config
  const { component: Component, props, valueKey = 'value', initValueTransfer, resultValueTransfer } = componentOption
  const dispatch = useDispatch()
  
  // 传递给子组件的函数通过useCallback来优化性能
  const onChange = useCallback((...args: any) => {
    const newValue = resultValueTransfer ? resultValueTransfer.apply(null, args) : defaultResultValueTransfer.apply(null, args)

    dispatch(setSchemaProp({
      type: config.type,
      propName: config.propName,
      newValue: newValue
    }))

  }, [config.propName, config.type, dispatch, resultValueTransfer])

  let value = schema.props && schema.props[type] && schema.props[type][propName]
  if (initValueTransfer) {
    value = initValueTransfer(value)
  }

  return (
    <div className={ styles.root } key={ propName }>
      <div className={ styles.labelWrapper } >{ label }</div>
      <Component
        className={ styles.configComponent }
        { ...props }
        { ...{ [valueKey]: value } }
        onChange={ onChange }
        workdata={ workData } 
        schemadata={ schema }
        />
    </div>
  )
}

export default Item