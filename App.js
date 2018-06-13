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
  Dimensions,
  Modal,
  Button,
  ListView
} from 'react-native';
import t from 'tcomb-form-native'
import ImageFactory from 'react-native-image-picker-form'
import * as Const from './constants/const.js'
import styles from './styles/styles.js'

const Form = t.form.Form

type Props = {}
type State = {
  value: Object,
  options: Object
}

type Props = {};
export default class App extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.onPressSend = this.onPressSend.bind(this);
    this.onPressOpen = this.onPressOpen.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.erroralert = this.erroralert.bind(this);
    this.onChange = this.onChange.bind(this);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      value: {},
      options: {
        fields: {

          locationTxt: {
            label: 'Location',
            placeholder: 'Input location'
          },

          locationSel: {
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
      type: this.getLocations(''),
      modalVisible: false,
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
    }
  }

  getLocations(value) {
    if (value.department === 'Parking') {
      return t.struct({
        department: Const.Department,
        locationSel: Const.ParkingLoc,
        description: t.String,
        image: t.String
      });
    } else if (value.department === 'Vending' || value.department === 'Bearcat Card') {
      return t.struct({
        department: Const.Department,
        locationTxt: t.String,
        description: t.String,
        image: t.String
      });
    } else if (value.department === 'Campus Recreation') {
      return t.struct({
        department: Const.Department,
        locationSel: Const.RecLoc,
        description: t.String,
        image: t.String
      });
    } else {
      return t.struct({
        department: Const.Department
      });
    }
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

  onPressSend() {
    var value = this._formRef.getValue();
    if (value) { // if validation fails, value will be null
      if (value.department === 'Parking' || value.department === 'Campus Recreation') {
        var loc = value.locationSel;
      } else if (value.department === 'Vending' || value.department === 'Bearcat Card') {
        var loc = value.locationTxt;
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

  onPressOpen() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (e) => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status === 200) {
        console.log('success', xhr.responseText);
        this.openModal(xhr.responseText);
      } else {
        alert('Error retrieving tickets');
      }
    };

    xhr.open('GET', 'http://10.142.2.167:3000/tickets');
    xhr.send();

  }

  openModal(data) {
    this.setState({modalVisible: true, dataSource: this.state.dataSource.cloneWithRows(data)});
  }

  closeModal() {
    this.setState({modalVisible: false});
  }

  renderRow = function(rowData) {
    return (
      <View style={styles.row}>
        <Text>{rowData.department}</Text>
        <Text>{rowData.location}</Text>
        <Text>{rowData.description}</Text>
      </View>
    );
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
          <TouchableHighlight style={styles.button} onPress={this.onPressSend} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.onPressOpen} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Open Tickets</Text>
          </TouchableHighlight>
          <View style={styles.modalView}>
          <Modal
              visible={this.state.modalVisible}
              animationType={'slide'}
              onRequestClose={() => this.closeModal()}
          >
            <View style={styles.modalContainer}>
              <View style={styles.innerContainer}>
              <ListView
                dataSource={ this.state.dataSource }
                renderRow={ this.renderRow }
              />
                <Text style = {{paddingTop: 20}} />

                <Text style = {{paddingTop: 20}} />
                <Button
                    onPress={() => this.closeModal()}
                    title="Close"
                >
                </Button>
              </View>
            </View>
          </Modal>
          </View>
        </View>
      </ScrollView>
    );
  }
}
