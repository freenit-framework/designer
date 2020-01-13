import React from 'react'
import { withStore } from 'freenit'
import DnD from 'components/dnd'
import { toProps } from 'components'
import styles from './styles'


class Display extends React.Component {
  object2Components = (tree, store) => {
    const style = store.selected.identity === tree.identity
      ? { border: '1px dashed red' }
      : null
    const ownProps = toProps(tree.props)
    return (
      <DnD identity={tree.identity} key={tree.identity} style={style}>
        <tree.component
          {...ownProps}
          onClick={(event) => {
            event.stopPropagation()
            store.onClick(tree)
          }}
        >
          {tree.identity}
          {tree.text}
          {tree.children.map(el => this.object2Components(el, store))}
        </tree.component>
      </DnD>
    )
  }

  render() {
    const { design } = this.props.store
    const content = this.object2Components(design.tree, design)
    return (
      <div style={styles.root}>
        {content}
      </div>
    )
  }
}

export default withStore(Display)
