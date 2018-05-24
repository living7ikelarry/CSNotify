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
  'MSH': 'Marian Spencer Hall',
  'CRC': 'Rec Center'
}, 'Location');

const Category = t.enums({
  'BCC': 'Bearcat Card',
  'PC': 'PC Issue'
}, 'Category');

const Form = t.form.Form
const DocumentFormStruct = t.struct({
  location: Location,
  category: Category,
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
    this.state = {
      value: {},
      options: {
        fields: {
          location: {
              label: 'Location',
              placeholder: 'Select a location',
          },

          category: {
              label: 'Category',
              placeholder: 'Select a category'
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
      }
    }
  }

  onPress() {
    var value = this._formRef.getValue();
    if (value) { // if validation fails, value will be null
      var image = {
        uri: value.image,
        type: 'image/jpeg',
        name: 'img.jpg',
      };
      var data = new FormData();
      data.append("image", image);
      data.append("category", "BCC");
      data.append("description", "reader down");
      data.append("location", "CRC");

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
        }
      });

      xhr.open("POST", "http://10.142.2.167:3000/tickets");
      xhr.setRequestHeader("Cache-Control", "no-cache");
      xhr.setRequestHeader("Postman-Token", "08bd658d-1f02-43e2-8f2e-640fc0fe14dc");

      xhr.send(data);
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
            type={DocumentFormStruct}
            value={this.state.value}
            options={this.state.options}
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
