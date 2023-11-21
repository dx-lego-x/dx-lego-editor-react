import { Input, InputRef } from 'antd'
import classNames from 'classnames'
import React, { FC, useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import { BaseFCProps } from '@/types/base'

export interface InputTextProps extends BaseFCProps {
  value: string
  onChange: (v: string) => void
}

const InputText: FC<InputTextProps> = ({ value, onChange }) => {
  const [innerValue, setInnerValue] = useState(value)
  const [editMode, setEditMode] = useState(false)
  const inputRef = useRef<null | InputRef>(null)

  const inputClassnames = classNames({
    [styles.input]: true,
    [styles.editMode]: editMode
  })

  useEffect(() => {
    setInnerValue(value)
  }, [value])

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInnerValue(newValue)
  }

  const onBlur = () => {
    setEditMode(false)
    inputRef.current?.blur()
    onChange(innerValue)
  }

  return (
    <Input 
      className={ inputClassnames }
      ref={ inputRef }
      value={ innerValue } 
      bordered={ editMode } 
      onFocus={ () => setEditMode(true) } 
      onBlur={ onBlur }
      onChange={ _onChange }
      onPressEnter={ onBlur }
      />
  )
}

export default InputText
