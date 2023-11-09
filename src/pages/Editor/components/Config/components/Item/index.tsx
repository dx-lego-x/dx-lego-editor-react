import { setBrickProp } from '@/store/reducers/work.reducer'
import { BaseFCProps } from '@/types/base'
import { DxBrickSchema, WorkProps } from '@/types/work'
import { BrickConfig, defaultResultValueTransfer } from '@/utils/brick-tools/transfer-config'
import React, { FC, useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import styles from './index.module.scss'

export interface ConfigItemProps extends BaseFCProps {
  workData: WorkProps
  config: BrickConfig
  brick: DxBrickSchema
}
const Item: FC<ConfigItemProps> = ({ workData, config, brick }) => {
  const { type, propName, label, componentOption } = config
  const { component: Component, props, valueKey = 'value', initValueTransfer, resultValueTransfer } = componentOption
  const dispatch = useDispatch()
  
  const onChange = useCallback((...args: any) => {
    const newValue = resultValueTransfer ? resultValueTransfer.apply(null, args) : defaultResultValueTransfer.apply(null, args)

    dispatch(setBrickProp({
      type: config.type,
      propName: config.propName,
      newValue: newValue
    }))

  }, [config.propName, config.type, dispatch, resultValueTransfer])

  const value = useMemo(() => {
    let v = brick.props && brick.props[type] && brick.props[type][propName]
    if (initValueTransfer) {
      v = initValueTransfer(v)
    }

    return v
  }, [brick.props, initValueTransfer, propName, type])

  return (
    <div className={ styles.root } key={ propName }>
      <div className={ styles.labelWrapper } >{ label }</div>
      <Component
        className={ styles.configComponent }
        { ...props }
        { ...{ [valueKey]: value } }
        onChange={ onChange }
        workdata={ workData } 
        brickdata={ brick }
        />
    </div>
  )
}

export default Item