import React from 'react'
import { observer } from 'mobx-react'
import Icon from '@material-ui/icons/Add'

import store from 'store'
import AddProp from './add'
import EditProp from './edit'
import styles from './styles'
import PropItem from './item'

class Props extends React.Component {
  state = {
    add: false,
    over: false,
  }

  showAdd = () => {
    this.setState({ add: true })
  }

  hideAdd = () => {
    this.setState({ add: false })
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
        <div
          style={styles.name}
          onMouseEnter={() => this.setState({ over: true })}
          onMouseLeave={() => this.setState({ over: false })}
        >
          props: &#123;
          {addView}
        </div>
        {propsView}
        &#125;
        <div>text: {selected.text}</div>
      </div>
    )
  }
}

export default observer(Props)
