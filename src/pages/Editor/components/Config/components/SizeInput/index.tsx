import { BrickConfigFCProps, SelectOption } from '@/utils/brick-tools/transfer-config'
import { InputNumber, Select } from 'antd'
import React, { FC, useMemo } from 'react'
import styles from './index.module.scss'

export interface SizeInputProps extends BrickConfigFCProps<string> {

}

const baseOptions = [
  { label: '自动', value: 'auto' },
  { label: '自适应', value: 'fit-content' },
]

const SizeInput: FC<SizeInputProps> = ({ workdata, brickdata, value, onChange }) => {

  const options = useMemo<SelectOption[]>(() => {
    const position = brickdata.props?.style.position

    if (position === 'absolute') {
      return [...baseOptions, { label: '数值', value: 'number' }]
    }

    return [...baseOptions]

  }, [brickdata.props?.style.position])


  const defaultValue = useMemo(() => {
    return value.includes('px') ? 'number' : value
  }, [value])

  const onChangeInner = (newOption: string, newValue?: number) => {
    if (newOption !== 'number') {
      return onChange(newOption)
    }

    if (newValue === undefined) {
      return onChange('0px')
    }

    onChange(newValue + 'px')
  }

  return (
    <div className={ styles.root }>
      <Select
        className={ styles.select }
        value={ defaultValue }
        options={ options }
        onChange={ (v) => onChangeInner(v) }
        />
      {
        defaultValue === 'number'
        &&
        <InputNumber className={ styles.input } value={ parseInt(value) } onChange={ (v) => onChangeInner('number', v || 0) }/>
      }
    </div>
  )
}

export default SizeInput