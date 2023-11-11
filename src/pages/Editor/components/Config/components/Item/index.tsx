import { setSchemaProp } from '@/store/reducers/work.reducer'
import { BaseFCProps } from '@/types/base'
import { DxBrickSchema, DxPageSchema, WorkProps } from '@/types/work'
import { BrickConfig, defaultResultValueTransfer } from '@/utils/brick-tools/transfer-config'
import React, { FC, useCallback, useMemo } from 'react'
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
  
  const onChange = useCallback((...args: any) => {
    const newValue = resultValueTransfer ? resultValueTransfer.apply(null, args) : defaultResultValueTransfer.apply(null, args)

    dispatch(setSchemaProp({
      type: config.type,
      propName: config.propName,
      newValue: newValue
    }))

  }, [config.propName, config.type, dispatch, resultValueTransfer])

  const value = useMemo(() => {
    let v = schema.props && schema.props[type] && schema.props[type][propName]
    if (initValueTransfer) {
      v = initValueTransfer(v)
    }

    return v
  }, [schema.props, initValueTransfer, propName, type])

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