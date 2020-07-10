import * as mui from '@material-ui/core'
import types from 'types'
import { makeid } from 'utils'

export { default as Component } from './component'
export { default as ComponentPanel } from './component-panel'
export { default as Display } from './display'
export { default as DnD } from './dnd'
export { default as EditProp } from './edit-prop'
export { default as Editor } from './editor'
export { default as Icon } from './icon'
export { default as Menu } from './menu'
export { default as PropItem } from './prop-item'
export { default as Props } from './props'
export { default as ThemeEditor} from './theme-editor'
export { default as TreeItem } from './tree-item'



export const compile = (component) => {
  const result = {
    ...component,
    identity: makeid(8),
    type: types.COMPONENT,
  }
  result.props = convert('props', result.props)
  result.children = result.children.map(item => compile(item))
  return result
}


export const isSimple = data => typeof data === 'number' ||
                                typeof data === 'boolean' ||
                                typeof data === 'string'


export const convert = (key, value) => {
  const base = {
    name: key,
    identity: makeid(8)
  }
  if (isSimple(value)) {
    return {
      ...base,
      value,
    }
  }
  if (Array.isArray(value)) {
    return {
      ...base,
      value: value.map(v => convert(null, v)),
    }
  }
  if (typeof value === 'object') {
    return {
      ...base,
      children: Object.getOwnPropertyNames(value).map(
        name => convert(name, value[name]),
      ),
    }
  }
}


export const toProps = (data) => {
  if (data.children) { // object
    const props = {}
    data.children.forEach(prop => {
      props[prop.name] = toProps(prop)
    })
    return props
  }
  if (data.value) { // simple value or array
    if (Array.isArray(data.value)) { // array
      return data.value.map(item => item.value)
    }
    return data.value // simple value
  }
}


export const decompile = (data) => {
  const result = {
    ...data,
  }
  delete result.identity
  result.props = toProps(result.props)
  result.children = result.children.map(item => decompile(item))
  return result
}


const components = [
  {
    component: mui.AppBar,
    name: 'AppBar',
    props: {
      position: 'static',
    },
    children: [{
      component: mui.Toolbar,
      name: 'Toolbar',
      props: {},
      children: [{
        component: mui.Typography,
        name: 'Typography',
        props: {
          variant: 'h6',
        },
        text: 'Title',
        children: [],
      }],
    }],
  },

  {
    name: 'Avatar',
    component: mui.Avatar,
    children: [],
    props: {},
  },

  {
    name: 'Backdrop',
    component: mui.Backdrop,
    children: [],
    props: {},
  },

  {
    name: 'Badge',
    component: mui.Badge,
    children: [],
    props: {},
  },

  {
    name: 'BottomNavigation',
    component: mui.BottomNavigation,
    children: [],
    props: {},
  },

  {
    name: 'BottomNavigationAction',
    component: mui.BottomNavigationAction,
    children: [],
    props: {},
  },

  {
    name: 'Box',
    component: mui.Box,
    children: [],
    props: {},
  },

  {
    name: 'Breadcrumbs',
    component: mui.Breadcrumbs,
    children: [],
    props: {},
  },

  {
    name: 'Button',
    component: mui.Button,
    children: [],
    props: {},
  },

  {
    name: 'ButtonBase',
    component: mui.ButtonBase,
    children: [],
    props: {},
  },

  {
    name: 'ButtonGroup',
    component: mui.ButtonGroup,
    children: [],
    props: {},
  },

  {
    name: 'Card',
    component: mui.Card,
    children: [],
    props: {},
  },

  {
    name: 'CardActionArea',
    component: mui.CardActionArea,
    children: [],
    props: {},
  },

  {
    name: 'CardActions',
    component: mui.CardActions,
    children: [],
    props: {},
  },

  {
    name: 'CardContent',
    component: mui.CardContent,
    children: [],
    props: {},
  },

  {
    name: 'CardHeader',
    component: mui.CardHeader,
    children: [],
    props: {},
  },

  {
    name: 'CardMedia',
    component: mui.CardMedia,
    children: [],
    props: {},
  },

  {
    name: 'Checkbox',
    component: mui.Checkbox,
    children: [],
    props: {},
  },

  {
    name: 'Chip',
    component: mui.Chip,
    children: [],
    props: {},
  },

  {
    name: 'CircularProgress',
    component: mui.CircularProgress,
    children: [],
    props: {},
  },

  {
    name: 'ClickAwayListener',
    component: mui.ClickAwayListener,
    children: [],
    props: {},
  },

  {
    name: 'Collapse',
    component: mui.Collapse,
    children: [],
    props: {},
  },

  {
    name: 'Container',
    component: mui.Container,
    children: [],
    props: {},
  },

  {
    name: 'Dialog',
    component: mui.Dialog,
    children: [],
    props: {},
  },

  {
    name: 'DialogActions',
    component: mui.DialogActions,
    children: [],
    props: {},
  },

  {
    name: 'DialogContent',
    component: mui.DialogContent,
    children: [],
    props: {},
  },

  {
    name: 'DialogContentText',
    component: mui.DialogContentText,
    children: [],
    props: {},
  },

  {
    name: 'DialogTitle',
    component: mui.DialogTitle,
    children: [],
    props: {},
  },

  {
    name: 'Divider',
    component: mui.Divider,
    children: [],
    props: {},
  },

  {
    name: 'Drawer',
    component: mui.Drawer,
    children: [],
    props: {},
  },

  {
    name: 'ExpansionPanel',
    component: mui.ExpansionPanel,
    children: [],
    props: {},
  },

  {
    name: 'ExpansionPanelActions',
    component: mui.ExpansionPanelActions,
    children: [],
    props: {},
  },

  {
    name: 'ExpansionPanelDetails',
    component: mui.ExpansionPanelDetails,
    children: [],
    props: {},
  },

  {
    name: 'ExpansionPanelSummary',
    component: mui.ExpansionPanelSummary,
    children: [],
    props: {},
  },

  {
    name: 'Fab',
    component: mui.Fab,
    children: [],
    props: {},
  },

  {
    name: 'Fade',
    component: mui.Fade,
    children: [],
    props: {},
  },

  {
    name: 'FilledInput',
    component: mui.FilledInput,
    children: [],
    props: {},
  },

  {
    name: 'FormControl',
    component: mui.FormControl,
    children: [],
    props: {},
  },

  {
    name: 'FormControlLabel',
    component: mui.FormControlLabel,
    children: [],
    props: {},
  },

  {
    name: 'FormGroup',
    component: mui.FormGroup,
    children: [],
    props: {},
  },

  {
    name: 'FormHelperText',
    component: mui.FormHelperText,
    children: [],
    props: {},
  },

  {
    name: 'FormLabel',
    component: mui.FormLabel,
    children: [],
    props: {},
  },

  {
    name: 'Grid',
    component: mui.Grid,
    children: [],
    props: {},
  },

  {
    name: 'GridList',
    component: mui.GridList,
    children: [],
    props: {},
  },

  {
    name: 'GridListTile',
    component: mui.GridListTile,
    children: [],
    props: {},
  },

  {
    name: 'GridListTileBar',
    component: mui.GridListTileBar,
    children: [],
    props: {},
  },

  {
    name: 'Grow',
    component: mui.Grow,
    children: [],
    props: {},
  },

  {
    name: 'Icon',
    component: mui.Icon,
    children: [],
    props: {},
  },

  {
    name: 'IconButton',
    component: mui.IconButton,
    children: [],
    props: {},
  },

  {
    name: 'Input',
    component: mui.Input,
    children: [],
    props: {},
  },

  {
    name: 'InputAdornment',
    component: mui.InputAdornment,
    children: [],
    props: {},
  },

  {
    name: 'InputBase',
    component: mui.InputBase,
    children: [],
    props: {},
  },

  {
    name: 'InputLabel',
    component: mui.InputLabel,
    children: [],
    props: {},
  },

  {
    name: 'LinearProgress',
    component: mui.LinearProgress,
    children: [],
    props: {},
  },

  {
    name: 'Link',
    component: mui.Link,
    children: [],
    props: {},
  },

  {
    name: 'List',
    component: mui.List,
    children: [],
    props: {},
  },

  {
    name: 'ListItem',
    component: mui.ListItem,
    children: [],
    props: {},
  },

  {
    name: 'ListItemAvatar',
    component: mui.ListItemAvatar,
    children: [],
    props: {},
  },

  {
    name: 'ListItemIcon',
    component: mui.ListItemIcon,
    children: [],
    props: {},
  },

  {
    name: 'ListItemSecondaryAction',
    component: mui.ListItemSecondaryAction,
    children: [],
    props: {},
  },

  {
    name: 'ListItemText',
    component: mui.ListItemText,
    children: [],
    props: {},
  },

  {
    name: 'ListSubheader',
    component: mui.ListSubheader,
    children: [],
    props: {},
  },

  {
    name: 'Menu',
    component: mui.Menu,
    children: [],
    props: {},
  },

  {
    name: 'MenuItem',
    component: mui.MenuItem,
    children: [],
    props: {},
  },

  {
    name: 'MenuList',
    component: mui.MenuList,
    children: [],
    props: {},
  },

  {
    name: 'MobileStepper',
    component: mui.MobileStepper,
    children: [],
    props: {},
  },

  {
    name: 'Modal',
    component: mui.Modal,
    children: [],
    props: {},
  },

  {
    name: 'NativeSelect',
    component: mui.NativeSelect,
    children: [],
    props: {},
  },

  {
    name: 'OutlinedInput',
    component: mui.OutlinedInput,
    children: [],
    props: {},
  },

  {
    component: mui.Paper,
    name: 'Paper',
    props: {
      style: {
        minHeight: 30,
      },
    },
    children: [],
  },

  {
    name: 'Popover',
    component: mui.Popover,
    children: [],
    props: {},
  },

  {
    name: 'Popper',
    component: mui.Popper,
    children: [],
    props: {},
  },

  {
    name: 'Portal',
    component: mui.Portal,
    children: [],
    props: {},
  },

  {
    name: 'Radio',
    component: mui.Radio,
    children: [],
    props: {},
  },

  {
    name: 'RadioGroup',
    component: mui.RadioGroup,
    children: [],
    props: {},
  },

  {
    name: 'Select',
    component: mui.Select,
    children: [],
    props: {},
  },

  {
    name: 'Slide',
    component: mui.Slide,
    children: [],
    props: {},
  },

  {
    name: 'Slider',
    component: mui.Slider,
    children: [],
    props: {},
  },

  {
    name: 'Snackbar',
    component: mui.Snackbar,
    children: [],
    props: {},
  },

  {
    name: 'SnackbarContent',
    component: mui.SnackbarContent,
    children: [],
    props: {},
  },

  {
    name: 'Step',
    component: mui.Step,
    children: [],
    props: {},
  },

  {
    name: 'StepButton',
    component: mui.StepButton,
    children: [],
    props: {},
  },

  {
    name: 'StepConnector',
    component: mui.StepConnector,
    children: [],
    props: {},
  },

  {
    name: 'StepContent',
    component: mui.StepContent,
    children: [],
    props: {},
  },

  {
    name: 'StepIcon',
    component: mui.StepIcon,
    children: [],
    props: {},
  },

  {
    name: 'StepLabel',
    component: mui.StepLabel,
    children: [],
    props: {},
  },

  {
    name: 'Stepper',
    component: mui.Stepper,
    children: [],
    props: {},
  },

  {
    name: 'SvgIcon',
    component: mui.SvgIcon,
    children: [],
    props: {},
  },

  {
    name: 'SwipeableDrawer',
    component: mui.SwipeableDrawer,
    children: [],
    props: {},
  },

  {
    name: 'Switch',
    component: mui.Switch,
    children: [],
    props: {},
  },

  {
    name: 'Tab',
    component: mui.Tab,
    children: [],
    props: {},
  },

  {
    name: 'Table',
    component: mui.Table,
    children: [],
    props: {},
  },

  {
    name: 'TableBody',
    component: mui.TableBody,
    children: [],
    props: {},
  },

  {
    name: 'TableCell',
    component: mui.TableCell,
    children: [],
    props: {},
  },

  {
    name: 'TableContainer',
    component: mui.TableContainer,
    children: [],
    props: {},
  },

  {
    name: 'TableFooter',
    component: mui.TableFooter,
    children: [],
    props: {},
  },

  {
    name: 'TableHead',
    component: mui.TableHead,
    children: [],
    props: {},
  },

  {
    name: 'TablePagination',
    component: mui.TablePagination,
    children: [],
    props: {},
  },

  {
    name: 'TableRow',
    component: mui.TableRow,
    children: [],
    props: {},
  },

  {
    name: 'TableSortLabel',
    component: mui.TableSortLabel,
    children: [],
    props: {},
  },

  {
    name: 'Tabs',
    component: mui.Tabs,
    children: [],
    props: {},
  },

  {
    name: 'TextField',
    component: mui.TextField,
    children: [],
    props: {},
  },

  {
    name: 'TextareaAutosize',
    component: mui.TextareaAutosize,
    children: [],
    props: {},
  },

  {
    component: mui.Toolbar,
    name: 'Toolbar',
    props: {},
    children: [],
  },

  {
    name: 'Tooltip',
    component: mui.Tooltip,
    children: [],
    props: {},
  },

  {
    component: mui.Typography,
    name: 'Typography',
    text: 'Typography',
    props: {},
    children: [],
  },

  {
    name: 'Zoom',
    component: mui.Zoom,
    children: [],
    props: {},
  },

  {
    name: "a",
    component: "a",
    children: [],
    props: {},
  },

  {
    name: "abbr",
    component: "abbr",
    children: [],
    props: {},
  },

  {
    name: "acronym",
    component: "acronym",
    children: [],
    props: {},
  },

  {
    name: "address",
    component: "address",
    children: [],
    props: {},
  },

  {
    name: "applet",
    component: "applet",
    children: [],
    props: {},
  },

  {
    name: "area",
    component: "area",
    children: [],
    props: {},
  },

  {
    name: "article",
    component: "article",
    children: [],
    props: {},
  },

  {
    name: "aside",
    component: "aside",
    children: [],
    props: {},
  },

  {
    name: "audio",
    component: "audio",
    children: [],
    props: {},
  },

  {
    name: "b",
    component: "b",
    children: [],
    props: {},
  },

  {
    name: "base",
    component: "base",
    children: [],
    props: {},
  },

  {
    name: "basefont",
    component: "basefont",
    children: [],
    props: {},
  },

  {
    name: "bdi",
    component: "bdi",
    children: [],
    props: {},
  },

  {
    name: "bdo",
    component: "bdo",
    children: [],
    props: {},
  },

  {
    name: "big",
    component: "big",
    children: [],
    props: {},
  },

  {
    name: "blockquote",
    component: "blockquote",
    children: [],
    props: {},
  },

  {
    name: "body",
    component: "body",
    children: [],
    props: {},
  },

  {
    name: "br",
    component: "br",
    children: [],
    props: {},
  },

  {
    name: "button",
    component: "button",
    children: [],
    props: {},
  },

  {
    name: "canvas",
    component: "canvas",
    children: [],
    props: {},
  },

  {
    name: "caption",
    component: "caption",
    children: [],
    props: {},
  },

  {
    name: "center",
    component: "center",
    children: [],
    props: {},
  },

  {
    name: "cite",
    component: "cite",
    children: [],
    props: {},
  },

  {
    name: "code",
    component: "code",
    children: [],
    props: {},
  },

  {
    name: "col",
    component: "col",
    children: [],
    props: {},
  },

  {
    name: "colgroup",
    component: "colgroup",
    children: [],
    props: {},
  },

  {
    name: "data",
    component: "data",
    children: [],
    props: {},
  },

  {
    name: "datalist",
    component: "datalist",
    children: [],
    props: {},
  },

  {
    name: "dd",
    component: "dd",
    children: [],
    props: {},
  },

  {
    name: "del",
    component: "del",
    children: [],
    props: {},
  },

  {
    name: "details",
    component: "details",
    children: [],
    props: {},
  },

  {
    name: "dfn",
    component: "dfn",
    children: [],
    props: {},
  },

  {
    name: "dialog",
    component: "dialog",
    children: [],
    props: {},
  },

  {
    name: "dir",
    component: "dir",
    children: [],
    props: {},
  },

  {
    name: "div",
    component: "div",
    children: [],
    props: {},
  },

  {
    name: "dl",
    component: "dl",
    children: [],
    props: {},
  },

  {
    name: "dt",
    component: "dt",
    children: [],
    props: {},
  },

  {
    name: "em",
    component: "em",
    children: [],
    props: {},
  },

  {
    name: "embed",
    component: "embed",
    children: [],
    props: {},
  },

  {
    name: "fieldset",
    component: "fieldset",
    children: [],
    props: {},
  },

  {
    name: "figcaption",
    component: "figcaption",
    children: [],
    props: {},
  },

  {
    name: "figure",
    component: "figure",
    children: [],
    props: {},
  },

  {
    name: "font",
    component: "font",
    children: [],
    props: {},
  },

  {
    name: "footer",
    component: "footer",
    children: [],
    props: {},
  },

  {
    name: "form",
    component: "form",
    children: [],
    props: {},
  },

  {
    name: "frame",
    component: "frame",
    children: [],
    props: {},
  },

  {
    name: "frameset",
    component: "frameset",
    children: [],
    props: {},
  },

  {
    name: "h1",
    component: "h1",
    children: [],
    props: {},
  },

  {
    name: "h2",
    component: "h2",
    children: [],
    props: {},
  },

  {
    name: "h3",
    component: "h3",
    children: [],
    props: {},
  },

  {
    name: "h4",
    component: "h4",
    children: [],
    props: {},
  },

  {
    name: "h5",
    component: "h5",
    children: [],
    props: {},
  },

  {
    name: "h6",
    component: "h6",
    children: [],
    props: {},
  },

  {
    name: "head",
    component: "head",
    children: [],
    props: {},
  },

  {
    name: "header",
    component: "header",
    children: [],
    props: {},
  },

  {
    name: "hr",
    component: "hr",
    children: [],
    props: {},
  },

  {
    name: "html",
    component: "html",
    children: [],
    props: {},
  },

  {
    name: "i",
    component: "i",
    children: [],
    props: {},
  },

  {
    name: "iframe",
    component: "iframe",
    children: [],
    props: {},
  },

  {
    name: "img",
    component: "img",
    children: [],
    props: {},
  },

  {
    name: "input",
    component: "input",
    children: [],
    props: {},
  },

  {
    name: "ins",
    component: "ins",
    children: [],
    props: {},
  },

  {
    name: "kbd",
    component: "kbd",
    children: [],
    props: {},
  },

  {
    name: "label",
    component: "label",
    children: [],
    props: {},
  },

  {
    name: "legend",
    component: "legend",
    children: [],
    props: {},
  },

  {
    name: "li",
    component: "li",
    children: [],
    props: {},
  },

  {
    name: "link",
    component: "link",
    children: [],
    props: {},
  },

  {
    name: "main",
    component: "main",
    children: [],
    props: {},
  },

  {
    name: "map",
    component: "map",
    children: [],
    props: {},
  },

  {
    name: "mark",
    component: "mark",
    children: [],
    props: {},
  },

  {
    name: "meta",
    component: "meta",
    children: [],
    props: {},
  },

  {
    name: "meter",
    component: "meter",
    children: [],
    props: {},
  },

  {
    name: "nav",
    component: "nav",
    children: [],
    props: {},
  },

  {
    name: "noframes",
    component: "noframes",
    children: [],
    props: {},
  },

  {
    name: "noscript",
    component: "noscript",
    children: [],
    props: {},
  },

  {
    name: "object",
    component: "object",
    children: [],
    props: {},
  },

  {
    name: "ol",
    component: "ol",
    children: [],
    props: {},
  },

  {
    name: "optgroup",
    component: "optgroup",
    children: [],
    props: {},
  },

  {
    name: "option",
    component: "option",
    children: [],
    props: {},
  },

  {
    name: "output",
    component: "output",
    children: [],
    props: {},
  },

  {
    name: "p",
    component: "p",
    children: [],
    props: {},
  },

  {
    name: "param",
    component: "param",
    children: [],
    props: {},
  },

  {
    name: "picture",
    component: "picture",
    children: [],
    props: {},
  },

  {
    name: "pre",
    component: "pre",
    children: [],
    props: {},
  },

  {
    name: "progress",
    component: "progress",
    children: [],
    props: {},
  },

  {
    name: "q",
    component: "q",
    children: [],
    props: {},
  },

  {
    name: "rp",
    component: "rp",
    children: [],
    props: {},
  },

  {
    name: "rt",
    component: "rt",
    children: [],
    props: {},
  },

  {
    name: "ruby",
    component: "ruby",
    children: [],
    props: {},
  },

  {
    name: "s",
    component: "s",
    children: [],
    props: {},
  },

  {
    name: "samp",
    component: "samp",
    children: [],
    props: {},
  },

  {
    name: "script",
    component: "script",
    children: [],
    props: {},
  },

  {
    name: "section",
    component: "section",
    children: [],
    props: {},
  },

  {
    name: "select",
    component: "select",
    children: [],
    props: {},
  },

  {
    name: "small",
    component: "small",
    children: [],
    props: {},
  },

  {
    name: "source",
    component: "source",
    children: [],
    props: {},
  },

  {
    name: "span",
    component: "span",
    children: [],
    props: {},
  },

  {
    name: "strike",
    component: "strike",
    children: [],
    props: {},
  },

  {
    name: "strong",
    component: "strong",
    children: [],
    props: {},
  },

  {
    name: "style",
    component: "style",
    children: [],
    props: {},
  },

  {
    name: "sub",
    component: "sub",
    children: [],
    props: {},
  },

  {
    name: "summary",
    component: "summary",
    children: [],
    props: {},
  },

  {
    name: "sup",
    component: "sup",
    children: [],
    props: {},
  },

  {
    name: "svg",
    component: "svg",
    children: [],
    props: {},
  },

  {
    name: "table",
    component: "table",
    children: [],
    props: {},
  },

  {
    name: "tbody",
    component: "tbody",
    children: [],
    props: {},
  },

  {
    name: "td",
    component: "td",
    children: [],
    props: {},
  },

  {
    name: "template",
    component: "template",
    children: [],
    props: {},
  },

  {
    name: "textarea",
    component: "textarea",
    children: [],
    props: {},
  },

  {
    name: "tfoot",
    component: "tfoot",
    children: [],
    props: {},
  },

  {
    name: "th",
    component: "th",
    children: [],
    props: {},
  },

  {
    name: "thead",
    component: "thead",
    children: [],
    props: {},
  },

  {
    name: "time",
    component: "time",
    children: [],
    props: {},
  },

  {
    name: "title",
    component: "title",
    children: [],
    props: {},
  },

  {
    name: "tr",
    component: "tr",
    children: [],
    props: {},
  },

  {
    name: "track",
    component: "track",
    children: [],
    props: {},
  },

  {
    name: "tt",
    component: "tt",
    children: [],
    props: {},
  },

  {
    name: "u",
    component: "u",
    children: [],
    props: {},
  },

  {
    name: "ul",
    component: "ul",
    children: [],
    props: {},
  },

  {
    name: "var",
    component: "var",
    children: [],
    props: {},
  },

  {
    name: "video",
    component: "video",
    children: [],
    props: {},
  },

  {
    name: "wbr",
    component: "wbr",
    children: [],
    props: {},
  },
]


export const noChildrenComponents = [
  'img',
  'hr',
]


export const textOnlyComponents = [
  'textarea',
]


export default components.map(item => compile(item))
