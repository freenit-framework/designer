import type Colord from 'colord'

export interface Component {
  id: string
  name: string
  title: string
  component: any
  children: Component[]
  props: Record<any, any>
  css: Record<any, boolean | string | number | Colord | null>
  text: string
  parent?: Component
  open?: boolean
  index?: number
  data?: string
}

export interface UndoItem {
  parent: Component | Component[]
  attribute: string
  value: any
}

export interface Prop {
  name: string
}
