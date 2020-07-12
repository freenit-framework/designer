import React from 'react'
import { withStore } from 'freenit'
import {
  EditProp,
  PropItem,
} from 'components'



class ThemeEditor extends React.Component {
  state = {
    edit: null,
    name: '',
    value: '',
  }

  showEdit = (prop, identity) => () => {
    this.setState({ edit: prop, identity })
  }

  closeEdit = () => {
    this.setState({ edit: null })
  }

  render() {
    let propView
    if (this.state.edit) {
      propView = (
        <EditProp
          onClose={this.closeEdit}
          identity={this.state.identity}
          data={this.props.store.design.theme}
        />
      )
    } else {
      propView = (
        <PropItem
          flavor="theme"
          onEdit={this.showEdit}
          data={this.props.store.design.theme}
        />
      )
    }
    return (
      <div>
        {propView}
      </div>
    )
  }
}


export default withStore(ThemeEditor)
