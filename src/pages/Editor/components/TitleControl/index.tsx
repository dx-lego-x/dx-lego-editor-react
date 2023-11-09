import { GlobalState } from '@/store'
import { WorkState } from '@/store/reducers/work.reducer'
import { Input } from 'antd'
import React, { FC, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './index.module.scss'
import classNames from 'classnames'

const TitleControl: FC = () => {
  const { data } = useSelector<GlobalState, WorkState>(store => store.work)
  const [editMode, setEditMode] = useState(false)

  const inputClassnames = classNames({
    [styles.input]: true,
    [styles.editMode]: editMode
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  return (
    <>
      <Input 
        className={ inputClassnames }
        value={ data?.title } 
        bordered={ editMode } 
        onFocus={ () => setEditMode(true) } 
        onBlur={ () => setEditMode(false) }
        onChange={ onChange }
        />
    </>
  )
}

export default TitleControl