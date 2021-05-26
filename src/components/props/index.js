import React from 'react'
import { observer } from 'mobx-react'
import Icon from '@material-ui/icons/Add'

import store from 'store'
import AddProp from './add'
import EditProp from './edit'
import EditText from './edit-text'
import styles from './styles'
import PropItem from './item'

class Props extends React.Component {
  state = {
    add: false,
    over: false,
    text: false,
  }

  showAdd = () => {
    this.setState({ add: true })
  }

  hideAdd = () => {
    this.setState({ add: false })
  }

  showOver = () => {
    this.setState({ over: true })
  }

  hideOver = () => {
    this.setState({ over: false })
  }

  showText = () => {
    this.setState({ text: true })
  }

  hideText = () => {
    this.setState({ text: false })
  }

  render() {
    const { selected } = store.design
    if (!selected || !selected.identity) {
      return null
    }
    const propsView = Object.keys(selected.props.value).map((name) => (
      <PropItem
        key={name}
        name={name}
        data={selected.props.value[name]}
        parent={selected.props}
        level={2}
      />
    ))
    const addView = this.state.over ? (
      <Icon onClick={this.showAdd} />
    ) : (
      <Icon style={{ opacity: 0 }} />
    )
    return (
      <div style={styles.root}>
        <AddProp
          open={this.state.add}
          handleClose={this.hideAdd}
          data={selected.props}
        />
        <EditText open={this.state.text} handleClose={this.hideText} />
        <div
          style={styles.name}
          onMouseEnter={this.showOver}
          onMouseLeave={this.hideOver}
        >
          props: &#123;
          {addView}
        </div>
        {propsView}
        &#125;
        <div onClick={this.showText}>text: {selected.text}</div>
      </div>
    )
  }
}

export default observer(Props)
