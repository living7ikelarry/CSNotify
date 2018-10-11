import { StyleSheet, Platform, Dimensions } from "react-native"

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: 40,
      },
    }),
    backgroundColor: '#fff',
    flexDirection:'column',
    margin: 10
  },
  button: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#bd1c2a',
    padding: 8,
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18
  },
  image: {
   width: 250,
   height: 86,
 },
 bgContainer: {
   width: width-5,
   height: 86,
   justifyContent: 'flex-start',
   alignItems: 'center',
   marginBottom: 10
 },
 modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  innerContainer: {
    alignItems: 'center',
    paddingTop: 20,
    height: '80%',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    padding: 12,
    paddingBottom: 16
  },
  loadScreen: {
    paddingTop: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
