import ShadowInput from '@/pages/Editor/components/Config/components/ShadowInput'
import SizeInput from '@/pages/Editor/components/Config/components/SizeInput'
import { BaseFCProps } from '@/types/base'
import { DxBrickSchema, DxPageSchema, WorkProps } from '@/types/work'
import { ColorPicker, Input, InputNumber, Radio, Select, Slider } from 'antd'
import { DxBrickProps, DxBrickStyleProps, PageProps, TextProps, ImageProps } from 'dx-lego-bricks'
import { cloneDeep } from 'lodash'
import { FC } from 'react'

// =============== types ================== //
export type BrickConfigGroupOption = { type: ConfigGroupType, name: string, configs: (BrickConfig | null)[]}
export type ConfigGroupType = 'basic' | 'size' | 'border' | 'shadow' | 'position' | 'events' | 'layout'
export type PropNameKeys = 
  keyof DxBrickStyleProps | 
  keyof DxBrickProps<TextProps & PageProps & ImageProps>['custom']
export type ConfigComponent = React.ForwardRefExoticComponent<any> | FC<BrickConfigFCProps<any> | any>
export interface BrickConfigFCProps<T> extends BaseFCProps {
  workdata: WorkProps
  schemadata: DxBrickSchema | DxPageSchema
  value: T
  onChange: (value: T) => void
}
export interface ConfigGroupInfo {
  type: ConfigGroupType
  name: string
  propNames: PropNameKeys[]
}
export type BrickConfigType = 'style' | 'custom' | 'events'
export interface ConfigComponentOption {
  component: ConfigComponent
  props?: any
  valueKey?: string
  initValueTransfer?: (v: any) => any
  resultValueTransfer?: (...args: any) => any
  displayCondition?: (brickProps: DxBrickProps<any>) => boolean // 某些属性存在联动情况，展示或不展示取决于某些其他属性
}
export interface BrickConfig {
  type: BrickConfigType
  propName: PropNameKeys
  label: string
  componentOption: ConfigComponentOption
}
export interface SelectOption {
  label: string
  value: string
}


// ============= default values ================ //
const defaultConfigGroups: ConfigGroupInfo[] = [{
  type: 'basic',
  name: '基础属性',
  propNames: ['fontSize', 'fontFamily', 'lineHeight', 'textAlign', 'color', 'textDecoration', 'backgroundColor']
}, {
  type: 'size',
  name: '尺寸',
  propNames: ['width', 'height', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom']
}, {
  type: 'border',
  name: '边框',
  propNames: ['borderRadius', 'borderStyle', 'borderColor', 'borderWidth'],
}, {
  type: 'shadow',
  name: '阴影与透明度',
  propNames: ['boxShadow', 'opacity']
}, {
  type: 'position',
  name: '定位',
  propNames: ['position', 'left', 'top'],
}, {
  type: 'events',
  name: '事件',
  propNames: [],
}]

export const defaultResultValueTransfer = (e: any) => e.target.value

// =============== functions ================== //
function genBrickGroupOptions(component?: string) {
  let config: null | ConfigGroupInfo[] = null
  if (component === 'Page') {
    config = []
    const _defaultConfigGroups = cloneDeep(defaultConfigGroups)
    const basicConfig = _defaultConfigGroups.find(item => item.type === 'basic') as ConfigGroupInfo
    config.push({
      ...basicConfig,
      propNames: [
        'backgroundColor', 'backgroundImage', 'backgroundRepeat', 'backgroundSize', 'display', 'flexDirection'],
    }, {
      type: 'layout',
      name: '布局',
      propNames: ['display', 'flexDirection']
    })

  } else if (component === 'Text') {
    const _defaultConfigGroups = cloneDeep(defaultConfigGroups)
    config = _defaultConfigGroups
    config.find(item => item.type === 'basic')?.propNames.unshift('text')

  } else if (component === 'Image') {
    const _defaultConfigGroups = cloneDeep(defaultConfigGroups)
    const basicConfig = _defaultConfigGroups.find(item => item.type === 'basic') as ConfigGroupInfo
    basicConfig.propNames = ['src']
    config = _defaultConfigGroups
  }

  return config
}

function makeNumberInput(): ConfigComponentOption {
  return {
    component: InputNumber,
    initValueTransfer: (v: string) => parseInt(v),
    resultValueTransfer: (v: number) => v + 'px'
  }
}

function makeColorInput(): ConfigComponentOption {
  return {
    component: ColorPicker,
    props: {
      showText: true
    },
    resultValueTransfer: (_, v) => v // color, hex
  }
}

function makeRadioGroup(options: SelectOption[]): ConfigComponentOption {
  return {
    component: Radio.Group,
    props: {
      optionType: 'button',
      buttonStyle: 'solid',
      options,
    }
  }
}

function makeSelect(options: SelectOption[]): ConfigComponentOption {
  return {
    component: Select,
    props: {
      options
    },
    resultValueTransfer: v => v
  }
}

const mapPropName2ConfigComponentOption: Partial<Record<PropNameKeys, ConfigComponentOption>> = {
  // 基础
  text: {
    component: Input.TextArea,
  },
  src: {
    component: Input.TextArea
  },
  fontSize: makeNumberInput(),
  color: makeColorInput(),
  fontFamily: makeSelect([
    { label: '无', value: 'unset' },
    { label: '宋体', value: '"SimSun","STSong"' },
    { label: '黑体', value: '"SimHei","STHeiti"' },
    { label: '楷体', value: '"KaiTi","STKaiti"' },
    { label: '仿宋', value: '"FangSong","STFangsong"' }, 
  ]),
  textAlign: makeRadioGroup([
    { label: '左对齐', value: 'left' },
    { label: '居中', value: 'center' },
    { label: '右对齐', value: 'right' },
  ]),
  textDecoration: makeRadioGroup([
    { label: '无', value: 'none' },
    { label: '下划线', value: 'underline' },
    { label: '上划线', value: 'overline' },
    { label: '删除线', value: 'line-through' }
  ]),
  backgroundColor: makeColorInput(),
  backgroundRepeat: {
    ...makeSelect([
      { label: '不重复', value: 'no-repeat' },
      { label: '全部重复', value: 'repeat' },
      { label: '水平重复', value: 'repeat-x' },
      { label: '垂直重复', value: 'repeat-y' },
    ]),
    displayCondition: (props) => {
      if (props.style.backgroundImage) {
        return true
      }

      return false
    }
  },
  backgroundSize: {
    ...makeSelect([
      { label: '自动', value: 'auto' },
      { label: 'contain', value: 'contain' },
      { label: 'cover', value: 'cover' }
    ]),
    displayCondition: (props) => {
      if (props.style.backgroundImage) {
        return true
      }

      return false
    }
  },
  // 尺寸
  width: {
    component: SizeInput,
    resultValueTransfer: v => v
  },
  height: {
    component: SizeInput,
    resultValueTransfer: v => v
  },
  paddingLeft: makeNumberInput(),
  paddingRight: makeNumberInput(),
  paddingTop: makeNumberInput(),
  paddingBottom: makeNumberInput(),
  // 边框和圆角
  borderRadius: makeNumberInput(),
  borderStyle: makeRadioGroup([
    { label: '无边框', value: 'none' },
    { label: '实线', value: 'solid' },
    { label: '虚线', value: 'dashed' },
  ]),
  borderWidth: { 
    ...makeNumberInput(),
    displayCondition: (props) => {
      if (props.style.borderStyle !== 'none') {
        return true
      }

      return false
    } 
  },
  borderColor: { 
    ...makeColorInput(),
    displayCondition: (props) => {
      if (props.style.borderStyle !== 'none') {
        return true
      }

      return false
    } 
  },
  // 阴影和透明度
  opacity: {
    component: Slider,
    props: {
      min: 0,
      max: 1,
      step: 0.1,
    },
    valueKey: 'defaultValue',
    initValueTransfer: (v) => parseInt(v),
    resultValueTransfer: (v) => v + ''
  },
  boxShadow: {
    component: ShadowInput,
    resultValueTransfer: v => v,
  },
  // 定位
  position: makeSelect([
    { label: '默认', value: 'static' },
    { label: '绝对布局', value: 'absolute' },
  ]),
  left: {
    ...makeNumberInput(),
    displayCondition: (props) => {
      if (props.style.position === 'absolute') {
        return true
      }

      return false
    }
  },
  top: {
    ...makeNumberInput(),
    displayCondition: (props) => {
      if (props.style.position === 'absolute') {
        return true
      }

      return false
    }
  },
}

const mapPropName2Label: Partial<Record<PropNameKeys, string>> = {
  'text': '文本内容',
  'src': '链接',
  'height': '高度',
  'width': '宽度',
  'minHeight': '最小高度',
  'paddingLeft': '左内边距',
  'paddingRight': '右内边距',
  'paddingTop': '上内边距',
  'paddingBottom': '下内边距',
  'color': '字体颜色',
  'backgroundColor': '背景颜色',
  'backgroundImage': '背景图片',
  'backgroundRepeat': '背景图片重复模式',
  'backgroundSize': '背景图片尺寸',
  'borderStyle': '边框样式',
  'borderColor': '边框颜色',
  'borderWidth': '边框宽度',
  'borderRadius': '边框圆角',
  'boxSizing': '',
  'boxShadow': '阴影',
  'opacity': '透明度',
  'position': '布局',
  'left': 'X轴坐标',
  'top': 'Y轴坐标',
  'right': '',
  'bottom': '',
  'display': '布局模式',
  'flexDirection': '布局方向',
  'fontFamily': '字体',
  'fontSize': '字体大小',
  'fontWeight': '字体',
  'fontStyle': '字体样式',
  'textDecoration': '字体修饰',
  'lineHeight': '行高',
  'textAlign': '字体对齐方式',
}

function getBrickConfigType(brick: DxBrickSchema, propName: PropNameKeys): BrickConfigType {
  if (Object.keys(brick.props?.custom).includes(propName)) {
    return 'custom'
  }
  
  return 'style'
}

export function transferSchemaConfiguration(schema: DxBrickSchema | DxPageSchema): null | BrickConfigGroupOption[] {
  if (!schema) {
    return null
  }

  const groupOptions = genBrickGroupOptions(schema?.component)
  if (!groupOptions) {
    return null
  }

  const groupOptionsWithConfigs = groupOptions.map(groupOption => {
    let configs: (BrickConfig | null)[]
    // 事件提供一个统一的配置组件，而不是单项逐一配置
    if (groupOption.type === 'events') {
      configs = [{
        type: 'events',
        propName: 'width',
        label: '事件',
        componentOption: {
          component: Input
        }
      }]
    } else {
      configs = groupOption.propNames.map(propName => {
        const componentOption = mapPropName2ConfigComponentOption[propName]
        // 当前属性没有配置或配置里不存在组件，返回null则不展示
        if (!componentOption || !componentOption.component) {
          return null
        }

        // 某些属性的配置展示依赖的前置条件，当条件不成立时也不展示，例如borderWidth只在borderStyle不为none时才展示
        const displayCondition = componentOption.displayCondition
        if (displayCondition && schema.props && !displayCondition(schema.props)) {
          return null
        }

        return {
          type: getBrickConfigType(schema, propName),
          propName,
          label: mapPropName2Label[propName] || '未配置的属性 = =',
          componentOption
        }
      })
    }

    return {
      type: groupOption.type,
      name: groupOption.name,
      configs,
    }
  })

  return groupOptionsWithConfigs
}
