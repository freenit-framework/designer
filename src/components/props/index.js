import React from 'react'
import { observer } from 'mobx-react'
import Icon from '@material-ui/icons/Add'

import store from 'store'
import AddProp from './add'
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
    const { selected, theme } = store.design
    if (this.props.source === 'props' && (!selected || !selected.identity)) {
      return null
    }
    const props = this.props.source === 'props' ? selected.props : theme
    const propsView = Object.keys(props.value).map((name) => (
      <PropItem
        key={name}
        name={name}
        data={props.value[name]}
        parent={props}
        level={2}
      />
    ))
    const addView = this.state.over ? (
      <Icon onClick={this.showAdd} />
    ) : (
      <Icon style={{ opacity: 0 }} />
    )
    let textView
    if (this.state.text) {
      textView = <EditText handleClose={this.hideText} />
    } else if (this.props.source === 'props') {
      textView = <div onClick={this.showText}>text: {selected.text}</div>
    }
    return (
      <div style={styles.root}>
        <AddProp
          open={this.state.add}
          handleClose={this.hideAdd}
          data={props}
        />
        <div
          style={styles.name}
          onMouseEnter={this.showOver}
          onMouseLeave={this.hideOver}
        >
          {this.props.source}: &#123;
          {addView}
        </div>
        {propsView}
        &#125;
        {textView}
      </div>
    )
  }
}

export default observer(Props)
