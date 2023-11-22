import { setSchemaProp } from '@/store/reducers/work.reducer'
import { DxBrickSchema } from '@/types/work'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

/**
 * 组件配置的一些属性变化时，全局的某些其他属性可能需要跟着变化，在这里监听和调整
 */
function useGlobalPropChanged(currentBrick?: DxBrickSchema | null) {
  const dispatch = useDispatch()

  useEffect(() => {
    const component = currentBrick?.component
    if (!component) {
      return
    }

    if (component === 'Text') {
      const styleProps = currentBrick?.props?.style
      const { position, width, height } = styleProps || {}

      if (position === 'absolute') {
        // 如果已经设置了width height的px 复用
        if (typeof width === 'string' && !width.includes('px')) {
          dispatch(setSchemaProp({
            type: 'style',
            propName: 'width',
            newValue: 'fit-content'
          }))
        }

        if (typeof height === 'string' && !height.includes('px')) {
          dispatch(setSchemaProp({
            type: 'style',
            propName: 'height',
            newValue: 'fit-content'
          }))
        }

      } else if (position === 'static') {
        // 默认auto
        dispatch(setSchemaProp({
          type: 'style',
          propName: 'width',
          newValue: 'auto'
        }))
        dispatch(setSchemaProp({
          type: 'style',
          propName: 'height',
          newValue: 'auto'
        }))
      }
    }

  }, [currentBrick?.component, currentBrick?.props?.style, dispatch])
}

export default useGlobalPropChanged
