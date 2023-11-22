import React, { FC, useState } from 'react'

const Any: FC = () => {
  console.log('render')
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={ () => setCount(count + 1) }>+</button>
    </div>
  )
}

export default Any