import { Add, Remove } from '@material-ui/icons'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { isSimple } from 'utils'

import AddProp from './add'
import EditProp from './edit'
import styles from './styles'

const PropItem = observer(
  class Item extends React.Component {
    state = {
      edit: false,
      open: false,
      over: false,
      name: false,
    }

    showAdd = () => {
      this.setState({ open: true })
    }

    hideAdd = () => {
      this.setState({ open: false })
    }

    showEdit = () => {
      this.setState({ edit: true })
    }

    hideEdit = () => {
      this.setState({ edit: false })
    }

    showEditName = () => {
      this.setState({ name: true })
    }

    hideEditName = () => {
      this.setState({ name: false })
    }

    showOver = () => {
      this.setState({ over: true })
    }

    hideOver = () => {
      this.setState({ over: false })
    }

    baseProps = {
      onMouseEnter: this.showOver,
      onMouseLeave: this.hideOver,
    }

    nameProps = {
      ...this.baseProps,
      onClick: this.showEditName,
    }

    valueProps = {
      ...this.baseProps,
      onClick: this.showEdit,
    }

    removeProp = (name, prop) =>
      action(() => {
        const { parent } = this.props
        if (Array.isArray(parent.value)) {
          parent.value = parent.value.filter(
            (item) => item.identity !== prop.identity
          )
        } else {
          delete parent.value[name]
        }
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
        <Remove onClick={this.removeProp(name, data)} />
      ) : (
        <Remove style={{ opacity: 0 }} />
      )
      const style = {
        marginLeft: level * 5,
      }
      if (isSimple(data.value)) {
        const view = name ? (
          <>
            <span onClick={this.showEditName}>{name}:</span>
            &nbsp;
            <span onClick={this.showEdit}>{data.value}</span>
          </>
        ) : (
          <span onClick={this.showEdit}>{data.value}</span>
        )
        return this.state.edit ? (
          <EditProp name={name} data={data} handleClose={this.hideEdit} />
        ) : (
          <div {...this.baseProps} style={{ ...styles.name, ...style }}>
            {view} {removeView}
          </div>
        )
      }
      if (Array.isArray(data.value)) {
        return (
          <div style={style}>
            <AddProp
              noname
              open={this.state.open}
              handleClose={this.hideAdd}
              data={data}
            />
            <div {...this.nameProps} style={styles.name}>
              {this.props.name}: &#91; {addView} {removeView}
            </div>
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
        <div {...this.nameProps} style={styles.name}>
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
