import React from 'react'
import store from 'store'
import { EditProp, PropItem } from 'components'

class ThemeEditor extends React.Component {
  state = {
    edit: false,
    data: null,
    identity: null,
  }

  showEdit = (data, identity) => () => {
    this.setState({ edit: true, data, identity })
  }

  closeEdit = () => {
    this.setState({
      edit: false,
      data: null,
      identity: null,
    })
  }

  render() {
    const { theme } = store
    const propView = this.state.edit ? (
      <EditProp
        flavor="theme"
        onEdit={this.showEdit}
        onClose={this.closeEdit}
        data={this.state.data}
        identity={this.state.identity}
      />
    ) : (
      <PropItem flavor="theme" onEdit={this.showEdit} data={theme.theme} />
    )
    return <div>{propView}</div>
  }
}

export default ThemeEditor
