import LoadingContainer from '@/components/LoadingContainer'
import useUserInfo from '@/hooks/useUserInfo'
import React, { FC } from 'react'

const MyWorks: FC = () => {
  const { loading } = useUserInfo(true)

  return (
    <LoadingContainer loading={ loading }>
      <div>
        myworks
      </div>
    </LoadingContainer>
  )
}

export default MyWorks