import { EditEventProps, DxBrickSchema, DxPageSchema, WorkProps } from '@/types/work'
import { PlusCircleOutlined } from '@ant-design/icons'
import { FC, memo, useCallback, useRef, useState } from 'react'
import styles from './index.module.scss'
import { Button, Empty, Form, Input, InputRef, List, Modal, Popconfirm, Select, Space } from 'antd'
import { FORM_WRAPPER_COL_OFFSET, FORM_WRAPPER_COL_SPAN } from '@/utils/constants'
import { useDispatch } from 'react-redux'
import { removeEvent, setEvent } from '@/store/reducers/work.reducer'
import { notEmpty } from '@/utils/rules'
import { eventActionTypeOptions, eventTypeOptions, transferEventName2Label } from '@/utils/brick-tools/transfer-events'
import { TextAreaRef } from 'antd/es/input/TextArea'

interface EventEditModalProps {
  type: 'edit' | 'create'
  open: boolean
  onCancel: () => void
  onConfirm: (result: EditEventProps) => void
  onRemove: (eventName?: string) => void
  eventProps?: EditEventProps
}
 
const _EventEditModal: FC<EventEditModalProps> = ({ type, open, onCancel, onConfirm, onRemove, eventProps }) => {

  const onFinish = (values: EditEventProps) => {
    onConfirm(values)
  }

  return (
    <Modal
      title={ type === 'edit' ? '编辑事件' : '新增事件' }
      footer={ null }
      open={ open }
      onCancel={ onCancel }
      destroyOnClose
      >
      <div>
        <Form
          initialValues={ type === 'edit' ? eventProps : { eventName: 'onClick', type: 'link', handler: '' } }
          onFinish={ onFinish }
          labelCol={{ span: FORM_WRAPPER_COL_OFFSET }}
          wrapperCol={{ span: FORM_WRAPPER_COL_SPAN }}
          >
          <Form.Item<EditEventProps> label='事件名' name='eventName' >
            <Select
              value='onClick'
              options={ eventTypeOptions }
              />
          </Form.Item>
          <Form.Item<EditEventProps> label='类型' name='type' >
            <Select
              options={
                eventActionTypeOptions
              }
              />
          </Form.Item>
          <Form.Item<EditEventProps> label='内容' name='handler' rules={[notEmpty()]} >
            <Input.TextArea/>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: FORM_WRAPPER_COL_OFFSET, span: FORM_WRAPPER_COL_SPAN }}>
            <Space direction='horizontal'>
              <Button onClick={ onCancel }>取消</Button>
              <Button type='primary' htmlType='submit'>确定</Button>
              {
                type === 'edit' 
                && 
                <Popconfirm
                  title={ `删除事件` }
                  description={ `确定要删除${transferEventName2Label(eventProps?.eventName || '')}事件吗？` }
                  onConfirm={ () => onRemove(eventProps?.eventName) }
                  okText="删除"
                  okButtonProps={{ danger: true }}
                  cancelText="取消"
                  >
                  <Button danger  >删除事件</Button>
                </Popconfirm>
              }
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

const EventEditModal = memo(_EventEditModal)

export interface EventsInputProps {
  workData: WorkProps
  schema: DxBrickSchema | DxPageSchema
}

const EventsInput: FC<EventsInputProps> = ({ workData, schema }) => {
  const dispatch = useDispatch()

  const [isModalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'edit' | 'create'>('create')
  const [editEventProps, setEditEventProps] = useState<EditEventProps | undefined>(undefined)

  const events = schema.props?.events

  const onAddNewEvent = () => {
    setModalOpen(true)
    setModalType('create')
  }

  const onCancel = useCallback(() => {
    setModalOpen(false)
  }, [])

  const onEditEventConfirm = useCallback((result: EditEventProps) => {
    setModalOpen(false)
    dispatch(setEvent(result))
  }, [dispatch])

  const onRemoveEvent = useCallback((eventName?: string) => {
    if (!eventName) {
      return
    }
    setModalOpen(false)
    dispatch(removeEvent({ eventName }))

  }, [dispatch])

  const inputRef = useRef<InputRef | null>(null)
  const textAreaRef = useRef<TextAreaRef | null>(null)

  const onModifyEventClick = (eventProps: EditEventProps) => {
    setModalType('edit')
    setEditEventProps(eventProps)
    setModalOpen(true)
  }

  return (
    <>
      {
        typeof events !== 'object' || Object.keys(events).length === 0
        ?
        <Empty description='当前未配置任何事件'/>
        :
        <List
          bordered
          itemLayout='vertical'
          dataSource={ Object.entries(events) }
          renderItem={ entry => {
            const [eventName, eventProps] = entry

            return (
              <List.Item>
                <Space className={ styles.itemWrapper } direction='vertical'>
                  <div className={ styles.titleWrapper }>
                    <div className={ styles.title }>
                      { transferEventName2Label(eventName) }
                    </div>
                    <div className={ styles.modifyWrapper }>
                      <Button 
                        className={ styles.button } 
                        type='link' 
                        onClick={ () => onModifyEventClick({
                          eventName,
                          ...eventProps
                        }) } 
                        >
                        修改
                      </Button>
                    </div>
                  </div>
                  <Input 
                    ref={ inputRef } 
                    value={ eventProps.type } 
                    onFocus={ () => inputRef.current?.blur() } // 不可编辑，阻止获取焦点
                    />
                  <Input.TextArea
                    ref={ textAreaRef }
                    value={ eventProps.handler }
                    onFocus={ () => textAreaRef.current?.blur() }
                    />
                </Space>
                
              </List.Item>
            )
          }}
          />
      }

      <Button 
        className={ styles.addItemButton } 
        icon={ <PlusCircleOutlined/> } 
        onClick={ onAddNewEvent } 
        >
        添加新事件
      </Button>
      <EventEditModal
        type={ modalType } 
        open={ isModalOpen } 
        onCancel={ onCancel }
        onConfirm={ onEditEventConfirm }
        onRemove={ onRemoveEvent }
        eventProps={ editEventProps }
        />
    </>
  )
}

export default EventsInput
