const center = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const styles = {
  root: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#eee',
    padding: 5,
    paddingBottom: 0,
    transition: 'all 0.5s',
    overflow: 'hidden',
  },

  tabs: {
    height: 50,
  },

  props: {
    marginRight: 20,
  },

  actions: {
    ...center,
    height: 50,
  },
}

export default styles
