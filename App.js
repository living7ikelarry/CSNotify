/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import t from 'tcomb-form-native'
import ImageFactory from 'react-native-image-picker-form'

const Location = t.enums({
  'MSH': 'Marian Spencer Hall',
  'CRC': 'Rec Center'
}, 'Location');

const Form = t.form.Form
const DocumentFormStruct = t.struct({
  location: Location,
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
    super(props)
    this.state = {
      value: {},
      options: {
        fields: {
          location: {
              label: 'Location',
              placeholder: 'Select a location',
              help: 'Select a location'
          },

          description: {
            label: 'Description',
            placeholder: 'Describe issue',
            help: 'Describe the issue'

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

  render() {
    return (
        <View>
          <Image
            style={{width: 369, height: 127}}
            source={{uri: 'https://cso.uc.edu/CSO.jpg'}}
          />
          <Form
            ref={(ref: any) => {
              this.form = ref
            }}
            type={DocumentFormStruct}
            value={this.state.value}
            options={this.state.options}
          />
        </View>
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
});
