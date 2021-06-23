import html from './html'
import mui from './mui'
import icons from './icons'
import * as muiComponents from '@material-ui/core'
import { compile } from 'utils'
export { default as Device } from './device'
export { default as Display } from './display'
export { default as FileControls } from './file-controls'
export { default as LeftPane } from './left-pane'
export { default as Props } from './props'
export { default as Renderer } from './renderer'
export { default as RightPane } from './right-pane'
export { default as Tree } from './tree'
export { default as KeyBind } from './keybind'

const components = { html, mui, icons }

export const noChildrenComponents = ['img', 'hr']

export const textOnlyComponents = ['textarea']

export const defaultData = {
  mui: {
    AppBar: {
      props: compile({ position: 'sticky' }),
      children: [
        {
          name: 'Toolbar',
          type: 'mui',
          component: muiComponents.Toolbar,
          text: '',
          opened: false,
          props: compile({}),
          children: [
            {
              name: 'Typography',
              type: 'mui',
              component: muiComponents.Typography,
              text: 'Freenit',
              opened: false,
              props: compile({ variant: 'h6' }),
              children: [],
            },
          ],
        },
      ],
    },
    Accordion: {
      children: [
        {
          name: 'AccordionSummary',
          type: 'mui',
          component: muiComponents.AccordionSummary,
          opened: false,
          props: compile({}),
          children: [
            {
              name: 'Typography',
              type: 'mui',
              component: muiComponents.Typography,
              text: 'Summary',
              opened: false,
              props: compile({}),
              children: [],
            },
          ],
        },
        {
          name: 'AccordionDetails',
          type: 'mui',
          component: muiComponents.AccordionDetails,
          opened: false,
          props: compile({}),
          children: [
            {
              name: 'Typography',
              type: 'mui',
              component: muiComponents.Typography,
              text: 'Details',
              opened: false,
              props: compile({}),
              children: [],
            },
          ],
        },
      ],
    },
  },
}

export default components
