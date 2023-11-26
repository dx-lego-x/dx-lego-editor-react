import { BrickConfigFCProps, SelectOption } from '@/utils/brick-tools/transfer-config'
import { InputNumber, Select } from 'antd'
import React, { FC } from 'react'
import styles from './index.module.scss'

export interface SizeInputProps extends BrickConfigFCProps<string> {

}

const baseOptions = [
  { label: '自动', value: 'auto' },
  { label: '自适应', value: 'fit-content' },
  { label: '100%', value: '100%' }
]

const SizeInput: FC<SizeInputProps> = ({ schemadata, value, onChange }) => {

  let options: SelectOption[] = []
  const position = schemadata.props?.style.position
  if (position === 'absolute') {
    options = [...baseOptions, { label: '数值', value: 'number' }]
  } else {
    options = [...baseOptions]
  }

  const defaultValue = value.includes('px') ? 'number' : value

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

export default React.memo(SizeInput)