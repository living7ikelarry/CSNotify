import React, { Component } from 'react';
import {
  Alert,
  TouchableHighlight,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions
} from 'react-native';
import t from 'tcomb-form-native'
import ImageFactory from 'react-native-image-picker-form'

const { width } = Dimensions.get('window');

const Location = t.enums({
  'Marian Spencer Hall': 'Marian Spencer Hall',
  'Campus Recreation Center': 'Campus Recreation Center',
  'Tangeman University Center': 'Tangeman University Center',
  'DAAP': 'DAAP',
  'Care/Crawley': 'Care/Crawley'

}, 'Location');

const ParkingLoc = t.enums({
  'Marian Spencer Hall': 'Marian Spencer Hall',
  'Campus Recreation Center': 'Campus Recreation Center',
  'Tangeman University Center': 'Tangeman University Center',
  'DAAP': 'DAAP',
  'Care/Crawley': 'Care/Crawley'

}, 'ParkingLocs');

const Department = t.enums({
  'Parking': 'Parking',
  'Vending': 'Vending'

}, 'Department');

const Form = t.form.Form

// basic form structure, now unused
const DocumentFormStruct = t.struct({
  location: Location,
  department: Department,
  description: t.String,
  image: t.String
})

type Props = {}
type State = {
  value: Object,
  options: Object
}

type Props = {};
export default class App extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.erroralert = this.erroralert.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      value: {},
      options: {
        fields: {
          location: {
              label: 'Location',
              placeholder: 'Select a location',
          },

          vendingLoc: {
            label: 'Location',
            placeholder: 'Input location'
          },

          parkingLoc: {
            label: 'Location',
            placeholder: 'Select a location'
          },

          department: {
              label: 'Department',
              placeholder: 'Select a department'
          },

          description: {
            label: 'Description',
            placeholder: 'Describe the issue',
            multiline: true,
            numberOfLines: 4,

          },


          image: {
            config: {
              title: 'Take Picture',
              options: ['Open camera', 'Select from gallery', 'Cancel'],
              // Used on Android to style BottomSheet
              style: {
                titleFontFamily: 'Roboto'
              }
            },
            error: 'No image provided',
            factory: ImageFactory
          }

        }
      },
      type: this.getLocations('')
    }
  }

  getLocations(value) {
    if (value.department === 'Parking') {
      return t.struct({
        department: Department,
        parkingLoc: ParkingLoc,
        description: t.String,
        image: t.String
      });
    } else if (value.department === 'Vending') {
      return t.struct({
        department: Department,
        vendingLoc: t.String,
        description: t.String,
        image: t.String
      });
    } else {
      return t.struct({
        department: Department
      })
    }
  }

  getInitialState() {
    const value = {};
    return { value, type: this.getLocations(value) };
  }

  onChange(value) {
    // recalculate the type only if strictly necessary
    const type = this.getLocations(value);
    this.setState({ value, type });
  }

  clearForm() {
    // clear content from all textbox
    this.setState({ value: null });
  }

  postTicket = function(data, alertcb) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4 && xhr.status === 200) {
        alertcb(true);
     } else if (this.readyState !== 4 && xhr.status !== 200 && xhr.status !== 0) {
       alertcb(false);
     }
    });

    xhr.open("POST", "http://10.142.2.167:3000/tickets");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Postman-Token", "08bd658d-1f02-43e2-8f2e-640fc0fe14dc");

    xhr.send(data);
  }

  erroralert(didSucceed) {
    if(didSucceed) {
      Alert.alert(
       'Success!',
       'Ticket sent.',
       [
         {text: 'OK', onPress: () => console.log('OK Pressed')},
       ],
       { cancelable: false }
     )
     this.clearForm();
   } else {
     Alert.alert(
       'Error',
       'Ticket failed to send. Check network connection.',
       [
         {text: 'OK', onPress: () => console.log('OK Pressed')},
       ],
       { cancelable: false }
     )
   }
 }

  onPress() {
    var value = this._formRef.getValue();
    if (value) { // if validation fails, value will be null
      if (value.parkingLoc != null) {
        var loc = value.parkingLoc;
      } else if (value.vendingLoc != null) {
        var loc = value.vendingLoc;
      }
      var image = {
        uri: value.image,
        type: 'image/jpeg',
        name: 'img.jpg',
      };
      var data = new FormData();
      data.append("image", image);
      data.append("department", value.department);
      data.append("description", value.description);
      data.append("location", loc);

      this.postTicket(data, this.erroralert);

    }


  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.bgContainer}>
            <Image
              style={styles.image}
              resizeMode='contain'
              source={require('./images/cso.jpg')}
            />
          </View>
          <Form
            ref={(ref) => this._formRef=ref}
            type={this.state.type}
            value={this.state.value}
            options={this.state.options}
            onChange={this.onChange}
          />
          <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
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
  },
  image: {
   width: 250,
   height: 86,
 },
 bgContainer: {
   width: width-5,
   height: 86,
   justifyContent: 'flex-start',
   alignItems: 'center'
 }
});
