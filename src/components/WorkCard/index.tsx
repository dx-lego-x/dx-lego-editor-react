import { Button, Card, Dropdown, MenuProps } from 'antd'
import React, { FC, useState } from 'react'
import styles from './index.module.scss'
import { DEFAULT_RATIO } from '@/utils/constants'
import { EditOutlined } from '@ant-design/icons'
import Meta from 'antd/es/card/Meta'
import { BaseFCProps } from '@/types/base'
import { WorkProps } from '@/types/work'
import { useNavigate } from 'react-router-dom'
import { PATHNAME_EDITOR } from '@/router'

export interface WorkCardProps extends BaseFCProps {
  work: WorkProps
}

const WorkCard: FC<WorkCardProps> = ({ work }) => {
  const [coverHeight, setCoverHeight] = useState(0)
  const [showMask, setShowMask] = useState(false)
  const navigate = useNavigate()

  const menuItems: MenuProps['items'] = [{
    key: 'copy',
    label: '复制',
    onClick: () => {
  
    }}, {
      key: 'remove',
      label: '删除',
      onClick: () => {
  
      }
    }, {
      key: 'downloadImage',
      label: '下载图片',
      onClick: () => {
  
      }
    }]


  const toEditWork = () => {
    navigate(PATHNAME_EDITOR + '/' + work.uuid)
  }

  return (
    <Card
      cover={
        <div 
          className={ styles.coverImageWrapper }
          style={{ height: coverHeight * 0.75 }}
          ref={ ref => {
            if (ref) {
              const width = ref.getBoundingClientRect().width
              setCoverHeight(width * DEFAULT_RATIO)
            }
          } }
          onMouseEnter={ () => setShowMask(true) }
          onMouseLeave={ () => setShowMask(false) }
          >
          <img
            style={{ width: '100%', height: coverHeight, objectFit: 'cover' }}
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
          {
            showMask &&
            <div className={ styles.maskWrapper }>
              <Button type='primary' onClick={ toEditWork }>编辑作品</Button>
            </div>
          }
        </div>
      }
      actions={[
        <EditOutlined key='edit' onClick={ toEditWork }/>,
        <Dropdown menu={{ items: menuItems }} placement='bottom'>
          <div>...</div>
        </Dropdown>
      ]}
      >
      <Meta 
        title={ work.title }
        description={ work.desc }
        />
    </Card>
  )
}

export default WorkCard