export default {
  components: {
    backgroundColor: '#eee',
    height: 'calc(100vh - 40px - 20px - 10px)',
    overflowY: 'auto',
    container: {
      padding: 10,
      borderRight: 'solid 1px #eee',
    },
    button: {
      margin: 5,
    },
  },

  search: {
    marginLeft: 10,
    marginBottom: 10,
  },

  find: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  case: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: 50,
    height: 50,
    margin: 10,
    cursor: 'grabbing',
  },

  input: {
    display: 'none',
  },
}
