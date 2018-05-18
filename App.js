import React, { Component } from 'react';
import {
  Alert,
  TouchableHighlight,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';
import t from 'tcomb-form-native'
import ImageFactory from 'react-native-image-picker-form'

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
              title: 'Select image',
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
      console.log(value.location); // value here is an instance of Person
    }
  }

  render() {
    return (
      <ScrollView>
        <View>
          <Image
            style={{width: 369, height: 127}}
            source={{uri: 'https://cso.uc.edu/CSO.jpg'}}
          />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#2196f3',
    padding: 10
  },
  buttonText: {
    color: '#ffffff',
  }
});
