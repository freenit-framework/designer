import * as mui from '@material-ui/core'

const names = Object.keys(mui).filter((name) => {
  const component = mui[name]
  return Boolean(component.Naked)
})

const muiComponents = {}

names.forEach((name) => {
  muiComponents[name] = {
    name,
    type: 'mui',
    component: mui[name],
    props: {},
    children: [],
    text: '',
    opened: false,
  }
})

export default muiComponents
