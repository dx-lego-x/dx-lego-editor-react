import React, { FC } from 'react'
import styles from './index.module.scss'
import Canvas from './components/Canvas'

const Palette: FC = () => {
  return (
    <div className={ styles.root }>
      <Canvas/>
    </div>
  )
}

export default Palette