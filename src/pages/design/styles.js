export default {
  root: {
    minHeight: 'calc(100vh - 65px)',
    display: 'grid',
    gridTemplateColumns: '250px auto 400px',
  },

  provider: {
    height: '100%',
  },

  components: {
    backgroundColor: '#eee',
    height: 'calc(100vh)',
    overflowY: 'auto',
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
}
