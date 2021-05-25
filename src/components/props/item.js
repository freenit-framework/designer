import { Add, Remove } from '@material-ui/icons'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { isSimple } from 'utils'

import AddProp from './add'
import styles from './styles'

const PropItem = observer(
  class Item extends React.Component {
    state = {
      open: false,
      over: false,
    }

    showAdd = () => {
      this.setState({ open: true })
    }

    hideAdd = () => {
      this.setState({ open: false })
    }

    removeProp = (prop) =>
      action(() => {
        delete this.props.parent.value[prop]
      })

    // data is either simple value (string, number, ...), array or object
    render() {
      const { name, level, data } = this.props
      const addView = this.state.over ? (
        <Add onClick={this.showAdd} />
      ) : (
        <Add style={{ opacity: 0 }} />
      )
      const removeView = this.state.over ? (
        <Remove onClick={this.removeProp(name)} />
      ) : (
        <Remove style={{ opacity: 0 }} />
      )
      const style = {
        marginLeft: level * 5,
      }
      if (isSimple(data.value)) {
        const view = name ? `${name}: ${data.value}` : null
        return (
          <div
            style={{ ...styles.name, ...style }}
            onMouseEnter={() => this.setState({ over: true })}
            onMouseLeave={() => this.setState({ over: false })}
          >
            {view} {removeView}
          </div>
        )
      }
      if (Array.isArray(data.value)) {
        return (
          <div style={style}>
            <div
              onMouseEnter={() => this.setState({ over: true })}
              onMouseLeave={() => this.setState({ over: false })}
            >
              {this.props.name}: &#91; {addView} {removeView}
            </div>{' '}
            {data.value.map((item) => (
              <PropItem
                key={item}
                data={item}
                parent={data}
                level={this.props.level + 1}
              />
            ))}
            &#93;
          </div>
        )
      }
      // If it's not simple value nor array, we assume object
      const nameView = name ? (
        <div
          style={styles.name}
          onMouseEnter={() => this.setState({ over: true })}
          onMouseLeave={() => this.setState({ over: false })}
        >
          {name}: &#123; {addView} {removeView}
        </div>
      ) : null
      const endNameView = name ? '}' : null
      const childrenView = Object.keys(data.value).map((n) => (
        <PropItem
          key={n}
          name={n}
          data={data.value[n]}
          parent={data}
          level={level + 1}
        />
      ))
      return (
        <div style={style}>
          <AddProp
            open={this.state.open}
            handleClose={this.hideAdd}
            data={data}
          />
          {nameView}
          {childrenView}
          {endNameView}
        </div>
      )
    }
  }
)

export default PropItem
