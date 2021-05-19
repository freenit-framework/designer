import * as icons from '@material-ui/icons'

const names = Object.keys(icons)

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
