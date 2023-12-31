import { FC } from 'react'
import styles from './index.module.scss'
import { useSelector } from 'react-redux'
import { GlobalState } from '@/store'
import { WorkState, getCurrentPage } from '@/store/reducers/work.reducer'
import EditWrapper from '../EditWrapper'
import { DxBrickSchema } from '@/types/work'
import PageEditWrapper from '../PageEditWrapper'
import { transferBrickComponent } from 'dx-lego-bricks'

const Canvas: FC = () => {
  const { data: workInfo } = useSelector<GlobalState, WorkState>(store => store.work)

  const render = () => {
    
    if (!workInfo) {
      return null
    }

    const page = getCurrentPage(workInfo.schemas)
    if (!page) {
      return null
    }

    const { component, props } = page
    if (!component || !props) {
      return
    }

    const Page = transferBrickComponent(component)
    
    return (
      <>
        {
          Page 
          &&
          <PageEditWrapper 
            page={ page }            
            >
            <Page 
              style={ props.style } 
              custom={{
                children: props.custom.children.map((brickSchema: DxBrickSchema) => {
                  const { id, component = '', props: brickProps, editProps } = brickSchema

                  if (editProps?.isHidden) {
                    return null
                  }

                  const Component = transferBrickComponent(component)
                  if (!Component) {
                    return null
                  }

                  return (
                    <EditWrapper key={ id } brick={ brickSchema } >
                      <Component 
                        style={ brickProps?.style || {} } 
                        custom={ brickProps?.custom } 
                        events={ {} } // Canvas上事件不生效
                        />
                    </EditWrapper>
                  )
                })
              }} 
              events={ {} }
              />
          </PageEditWrapper>
        }
      </>
    )
  }

  return (
    <div className={ styles.root }>
      {
        render()
      }
    </div>
  )
}

export default Canvas