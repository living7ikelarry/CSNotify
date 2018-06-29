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
    backgroundColor: '#2196f3',
    padding: 10
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16
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
})
