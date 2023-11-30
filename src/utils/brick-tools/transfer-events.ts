import { SelectOption } from './transfer-config'

export const eventTypeOptions: SelectOption[] = [
  { label: '点击', value: 'onClick'}
]

export const eventActionTypeOptions: SelectOption[] = [
  { label: '跳转链接', value: 'link' },
  { label: '自定义js', value: 'function' }
]

const mapEventName2Label: Record<string, string> = {
  onClick: '点击'
}

export function transferEventName2Label(eventName: string) {
  return mapEventName2Label[eventName] || '未配置的事件名'
}