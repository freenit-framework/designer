const center = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const styles = {
  root: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#eee',
    overflow: 'auto',
    padding: 5,
    paddingBottom: 0,
    transition: 'all 0.5s',
  },

  types: {
    ...center,
    justifyContent: 'space-between',
    height: 50,
    marginBottom: 5,
  },

  component: {
    backgroundColor: 'white',
    border: '1px solid #aaa',
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
  },

  search: {
    ...center,
    marginBottom: 10,
    button: {
      ...center,
      marginLeft: 5,
      width: 50,
      height: 50,
      cursor: 'grabbing',
    },
    text: {
      width: 'calc(300px - 55px)',
    },
  },

  components: {
    height: 'calc(100vh - 55px - 60px - 10px - 80px)',
    overflow: 'auto',
  },
}

export default styles
