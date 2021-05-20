import * as icons from '@material-ui/icons'

const endings = ['Outlined', 'Rounded', 'Sharp', 'TwoTone']

const names = Object.keys(icons).filter((name) => {
  let result = true
  endings.forEach((ending) => {
    if (name.endsWith(ending)) {
      result = false
    }
  })
  return result
})

const muiIcons = {}

names.forEach((name) => {
  muiIcons[name] = {
    name,
    type: 'icon',
    component: icons[name],
    props: {},
    children: [],
    text: '',
    opened: false,
  }
})

export default muiIcons
