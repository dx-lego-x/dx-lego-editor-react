import { DxBrickProps, Page, Text } from 'dx-lego-bricks'
import { FC } from 'react'

export function transferBrickComponent(componentName: string): FC<DxBrickProps<any>> | null {
  if (componentName === 'Page') {
    return Page
  } else if (componentName === 'Text') {
    return Text
  }

  return null
}