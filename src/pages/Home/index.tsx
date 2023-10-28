import useUserInfo from '@/hooks/useUserInfo'
import React, { FC } from 'react'

const Home: FC = () => {
  useUserInfo()

  return (
    <div>
      home
    </div>
  )
}

export default Home