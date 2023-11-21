import { BrickConfigFCProps } from '@/utils/brick-tools/transfer-config'
import { ColorPicker, Slider, Switch } from 'antd'
import React, { FC } from 'react'
import styles from './index.module.scss'

interface ShadowOption {
  x: number
  y: number
  blur: number
  color: string
}

const defaultShadowOption = { x: 5, y: 5, blur: 10, color: '#222222'}

function shadowValue2Option(value: string): null | ShadowOption {
  if (value === 'none') {
    return null
  }

  try {
    const valueArr = value.split(' ')
    if (valueArr.length !== 4) {
      return null
    }

    const [x, y, blur, color] = valueArr
    return {
      x: parseInt(x),
      y: parseInt(y),
      blur: parseInt(blur),
      color
    }

  } catch (e) {
    return null
  }
}

function shadowOption2Value(option: ShadowOption) {
  const { x, y, blur, color } = option
  return `${x}px ${y}px ${blur}px ${color}`
}

const ShadowInput: FC<BrickConfigFCProps<string>> = ({ style, value, onChange }) => {
  const hasShadow = value !== 'none'
  const shadowOption = shadowValue2Option(value)

  const onChangeInner = (_hasShadow: boolean, options?: ShadowOption) => {
    if (_hasShadow) { 
      // 从关闭状态打开了阴影开关，此时要给阴影赋一个默认值
      if (!options) {
        onChange(shadowOption2Value(defaultShadowOption))
      } else {
        onChange(shadowOption2Value(options))
      }

    } else {
      onChange('none')
    }
  }


  return (
    <div className={ styles.root } style={ style }>
      <Switch 
        checked={ hasShadow } 
        checkedChildren='开' 
        unCheckedChildren='关'
        onChange={ (checked) => onChangeInner(checked) }  
        />
      {
        hasShadow
        &&
        <div className={ styles.configWrapper }>
          {
            shadowOption &&
            Object.entries(shadowOption).map(entry => {
              const [key, value] = entry
              if (typeof value === 'number') {
                return (
                  <div key={ key }>
                    <div>{key}</div>
                    <Slider
                      value={ value }
                      onChange={ (v) => onChangeInner(hasShadow, { ...shadowOption, [key]: v }) }
                      min={ 0 }
                      max={ 50 }
                      step={ 1 }
                      />
                  </div>
                )
              } else {
                return (
                  <div key={ key }>
                    <div>{ key }</div>
                    <ColorPicker 
                      showText
                      value={ value } 
                      onChange={ (_, hex) => onChangeInner(hasShadow, { ...shadowOption, color: hex })} />
                  </div>
                )
              }

            })
          }
        </div>
      }
    </div>
  )
}

export default React.memo(ShadowInput)