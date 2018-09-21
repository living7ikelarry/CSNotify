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
  ListView,
  AsyncStorage
} from 'react-native';
import t from 'tcomb-form-native'
import ImageFactory from 'react-native-image-picker-form'
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

    // binds
    this.onPressSend = this.onPressSend.bind(this);
    this.onPressOpen = this.onPressOpen.bind(this);
    this.postTicket = this.postTicket.bind(this);
    this.erroralert = this.erroralert.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getDepartments = this.getDepartments.bind(this);
    this.getLocations = this.getLocations.bind(this);
    this.closeTicketModal = this.closeTicketModal.bind(this);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      loaded: false,
      appdata: {},
      selected: '',
      value: '',
      url: 'https://cso.uc.edu:3000/notify',
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
                titleFontFamily: 'Roboto',
              }
            },
            error: 'No image provided',
            factory: ImageFactory
          }
        }
      },
      type: '',
      ticketModalVisible: false,
      welcomeModalVisible: false,
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
    }

    // set server url for development
    if (__DEV__) {
      this.state.url = 'http://10.142.2.167:3000';
    }
  }

  async componentDidMount() {
    const response = await fetch(this.state.url + '/appdata');
    const data = await response.json();
    console.log(data);
    this.setState({
      appdata: JSON.stringify(data),
      loaded: true
    });
  }

  // was going to add a welcome tutorial/instructions
  setWelcomeModalVisible(visible) {
    this.setState({ welcomeModalVisible: visible });
  }

// list of departments-only from db
  getDepartments() {
    // console.log(this.state.appdata);
    var data = JSON.parse(this.state.appdata);
    for (var i = 0; i < data.length; i++) {
      if (data[i].department === 'Department') {
        return t.enums(data[i].locations, 'Department');
      }
    }

    return t.enums({'Error': 'Error'}, 'Department');
  }

// list of locations for department
  getLocations(value) {
    if (value === '' || value.department === '') {
      return t.struct({
        department: this.getDepartments()
      });
    }
    else {
      var data = JSON.parse(this.state.appdata);
      for (var i = 0; i < data.length; i++) {
        if (data[i].department != 'Department' & value.department === data[i].department & data[i].input === 'locationSel') {
          return t.struct({
            department: this.getDepartments(),
            locationSel: t.enums(data[i].locations, value.department),
            description: t.String,
            image: t.String
          });
        }
        else if (data[i].department != 'Department' & value.department === data[i].department & data[i].input === 'locationTxt') {
          return t.struct({
            department: this.getDepartments(),
            locationTxt: t.String,
            description: t.String,
            image: t.String
          });
        }
      }
    }
  }

  // on change of form element re-render
  onChange(value) {
    // recalculate the type only if strictly necessary
    const type = this.getLocations(value);
    this.setState({ value: value, type: type });
  }

  clearForm() {
    // clear content from all textbox
    this.setState({ value: '' });
  }

  // post request to api
  // change to fetch request
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

    // alert for ticket sent status
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


  // send ticket
  onPressSend() {
    var value = this._formRef.getValue();
    var data = JSON.parse(this.state.appdata);
    if (value) { // if validation fails, value will be null
      for (i = 0; i < data.length; i++) {
        if (value.department === data[i].department & data[i].input === 'locationSel') {
          var loc = value.locationSel;
        } else if (value.department === data[i].department & data[i].input === 'locationTxt') {
          var loc = value.locationTxt;
        }
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

// open list of active tickets
  onPressOpen() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = (e) => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status === 200) {
        console.log('success', xhr.response);
        this.openTicketModal(xhr.response);
      } else {
        alert('Error retrieving tickets');
      }
    };

    xhr.open('GET', 'http://10.142.2.167:3000/tickets');
    xhr.send();

  }

// modal functions
  openTicketModal(data) {
    this.setState({ticketModalVisible: true, dataSource: this.state.dataSource.cloneWithRows(data)});
  }

  closeTicketModal() {
    this.setState({ticketModalVisible: false});
  }


  content() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.bgContainer}>
            <Image
              style={styles.image}
              resizeMode='contain'
              source={require('./images/banner.png')}
            />
          </View>
          <Form
            ref={(ref) => this._formRef=ref}
            type={this.getLocations(this.state.value)}
            value={this.state.value}
            options={this.state.options}
            onChange={this.onChange}
          />
          <TouchableHighlight style={styles.button} onPress={this.onPressSend} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.onPressOpen} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>View Active Tickets</Text>
          </TouchableHighlight>
          <View style={styles.modalView}>
          <Modal
              visible={this.state.ticketModalVisible}
              animationType={'slide'}
              onRequestClose={() => this.closeTicketModal()}
          >
            <View style={styles.modalContainer}>
              <View style={styles.innerContainer}>

                <ListView
                  dataSource={ this.state.dataSource }
                  enableEmptySections={ true }
                  renderRow={ (rowData) =>
                    <View style={styles.row}>
                      <Text>{rowData.department}</Text>
                      <Text>{rowData.location}</Text>
                      <Text>{rowData.description}</Text>
                    </View>
                  }
                />

              </View>
              <Text style={{paddingTop: 20}} />
              <TouchableHighlight style={styles.button} onPress={this.closeTicketModal} underlayColor='#99d9f4'>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableHighlight>
            </View>
          </Modal>
          </View>
        </View>
      </ScrollView>
    );
  }

  render() {
    return (
      <View>
        {this.state.loaded ? this.content() : null}
      </View>
    );
  }
}
