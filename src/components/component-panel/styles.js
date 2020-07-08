export default {
  root: {
    width: 300,
    height: '100%',
    transition: 'all 0.5s',
    borderRight: 'solid 1px #eee',
    backgroundColor: '#eee',
    overflow: 'hidden',
  },

  components: {
    backgroundColor: '#eee',
    height: 'calc(100vh - 40px - 20px - 10px - 40px - 4px - 65px)',
    overflowY: 'auto',
    container: {
      padding: 10,
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

  toggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  button: {
    marginRight: 10,
  },

  icons: {
    backgroundColor: '#eee',
    height: 'calc(100vh - 40px - 20px - 10px - 40px - 4px - 65px - 20px)',
    overflowY: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(5, auto)',
    gridRowGap: 10,
    padding: 10,
  },
}