import React, { Component } from 'react';
import {
  Alert,
  TouchableHighlight,
  Platform,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Dimensions,
  Modal,
  Button,
  ListView,
  AsyncStorage,
} from 'react-native';
import t from 'tcomb-form-native'
import ImageFactory from 'react-native-image-picker-form'
import styles from './styles/styles.js'
import RNRestart from 'react-native-restart'
import {setJSExceptionHandler} from 'react-native-exception-handler'
import * as Animatable from 'react-native-animatable';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageResizer from 'react-native-image-resizer';
import Toast from 'react-native-simple-toast';

import { default as ProgressImg } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
const INDICATORS = [null, Progress.Bar, Progress.Circle, Progress.Pie];


const Form = t.form.Form

// handle unexpected errors globally in release build
const errorHandler = (e, isFatal) => {
  if (isFatal) {
    Alert.alert(
        'Unexpected error occurred',
        `
        Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}

        We will need to restart the app.
        `,
      [{
        text: 'Restart',
        onPress: () => {
          RNRestart.Restart();
        }
      }]
    );
  } else {
    console.log(e);
  }
};

setJSExceptionHandler(errorHandler);

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
    this.convertDate = this.convertDate.bind(this);
    this.openImageModal = this.openImageModal.bind(this);
    this.closeImageModal = this.closeImageModal.bind(this);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      loaded: false,
      appdata: {},
      selected: '',
      passText: '',
      passValid: false,
      loadedPass: false,
      passExist: false,
      sendDisable: false,
      spinner: false,
      value: '',
      url: 'https://cso.uc.edu:3000/notify',
      options: {
        fields: {

          locationTxt: {
            label: 'Location',
            placeholder: 'Input location'
          },

          locationSel: {
            label: 'Select a Location (dropdown below)',
            placeholder: 'Select a location'
          },

          department: {
            label: 'Select a Department (dropdown below)',
            placeholder: 'Select a department'
          },

          description: {
            label: 'Description',
            placeholder: 'Describe the issue',
            multiline: false,
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
      imageModalVisible: false,
      imageFileName: '',
      imageURL: '',
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
    }

    // set server url for development
    if (__DEV__) {
      this.state.url = 'http://10.142.2.167:3000';
    }

  }

  async componentWillMount() {
    await this.fetchPass().done();
  }

  async fetchPass(): Promise<void> {
    const pass = await AsyncStorage.getItem('pass');
    console.log(pass);
    if (pass != null & (pass === 'uc' || pass === 'UC' || pass === 'uC' || pass === 'Uc')) {
      await this.promisedSetState({passValid:true});
    }
  }

  promisedSetState = (newState) => {
    return new Promise((resolve) => {
        this.setState(newState, () => {
            resolve()
        });
    });
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
            // image: t.maybe(t.String)
            image: t.maybe(t.String)
          });
        }
        else if (data[i].department != 'Department' & value.department === data[i].department & data[i].input === 'locationTxt') {
          return t.struct({
            department: this.getDepartments(),
            locationTxt: t.String,
            description: t.String,
            // image: t.maybe(t.String)
            image: t.maybe(t.String)
          });
        }
      }
    }
  }

  // on change of form element re-render
  onChange(value, path) {
    // when department field is changed, reset value of location select
    // this fixes bug with IOSPicker
    if (path[0] === 'department') {
      value.locationSel = null;
    }
    // recalculate the type only if strictly necessary
    const type = this.getLocations(value);
    this.setState({ value: value, type: type });
  }

  clearForm() {
    // clear content from all textbox and enable send button again
    this.setState({ value: '' });
  }

  // post request to api
  // change to fetch request
  postTicket = function(data, alertcb) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 304) {
          alertcb(true);
        } else {
          alertcb(false);
        }
      }
    });

    xhr.open('POST', this.state.url + '/tickets');
    // xhr.setRequestHeader("Cache-Control", "no-cache");
    // xhr.setRequestHeader("Postman-Token", "08bd658d-1f02-43e2-8f2e-640fc0fe14dc");

    xhr.send(data);
  }

    // alert for ticket sent status
    erroralert(didSucceed) {
      if(didSucceed) {
        Alert.alert(
         'Success!',
         'Ticket sent.',
         [
           {text: 'OK', onPress: () => this.setState({spinner: false})}
         ],
         { cancelable: false }
       )
       this.clearForm();
     } else {
       Alert.alert(
         'Error',
         'Ticket failed to send. Check network connection.',
         [
           {text: 'OK', onPress: () => this.setState({spinner: false})}
         ],
         { cancelable: false }
       )
     }
     this.setState({ sendDisable: false });
   }

  // send ticket
  onPressSend() {
    var value = this._formRef.getValue();
    var data = JSON.parse(this.state.appdata);
    if (value) { // if validation fails, value will be null
      this.setState({ sendDisable: true, spinner: true });
      for (i = 0; i < data.length; i++) {
        if (value.department === data[i].department & data[i].input === 'locationSel') {
          var loc = value.locationSel;
        } else if (value.department === data[i].department & data[i].input === 'locationTxt') {
          var loc = value.locationTxt;
        }
      }

      // resize image if present, and create form data
      if (value.image) {
        ImageResizer.createResizedImage(value.image, 640, 960, 'JPEG', 80)
          .then(({ uri }) => {
            var data = new FormData();
            var image = {
              uri: uri,
              type: 'image/jpeg',
              name: 'img.jpg',
            };
            data.append("image", image);
            data.append("department", value.department);
            data.append("description", value.description);
            data.append("location", loc);
            this.postTicket(data, this.erroralert);
          })
          .catch(err => {
            console.log(err);
            // return Alert.alert('Unable to resize the photo', 'Check the console for full the error message');
          });
      } else {
        var data = new FormData();
        data.append("department", value.department);
        data.append("description", value.description);
        data.append("location", loc);
        this.postTicket(data, this.erroralert);
      }

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
        var data = xhr.response;
        data.sort(function compare(a, b) {
          return b.date - a.date;
        });
        this.openTicketModal(data);
      } else {
        alert('Error retrieving tickets');
      }
    };

    xhr.open('GET', this.state.url + '/tickets');
    xhr.send();

  }

// modal functions
  openTicketModal(data) {
    this.setState({ticketModalVisible: true, dataSource: this.state.dataSource.cloneWithRows(data)});
  }

  closeTicketModal() {
    this.setState({ticketModalVisible: false});
  }

  convertDate(milli) {
    var date = new Date(milli);
    return date.toLocaleString();
  }

  openImageModal(imagePath) {
    if (imagePath) {
      var fileName = imagePath.replace('./images/', '');
      this.setState({imageURL: this.state.url + '/tickets/' + fileName}, function () {
        console.log(this.state.imageURL);
        this.setState({imageModalVisible: true});
      });
    } else {
      Toast.show('Image not submitted for this note');
    }
  }

  closeImageModal() {
    this.setState({imageModalVisible: false});
  }

  renderRow(rowData) {
    return (
      <View>
        <TouchableHighlight onPress={() => this.openImage(rowData.imagePath)}>
          <View style={styles.row}>
            <Text>{this.convertDate(rowData.date)}</Text>
            <Text>{rowData.department}</Text>
            <Text>{rowData.location}</Text>
            <Text>{rowData.description}</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  appContent() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Spinner
            visible={this.state.spinner}
            textContent={'Sending...'}
            textStyle={styles.spinnerTextStyle}
            cancelable={true}
          />
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
          <TouchableHighlight style={styles.button} onPress={this.onPressSend} underlayColor='#f78080' disabled={this.state.sendDisable}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.onPressOpen} underlayColor='#f78080'>
            <Text style={styles.buttonText}>View Active Notifications</Text>
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
                    <View>
                      <TouchableHighlight onPress={() => this.openImageModal(rowData.imagePath)}>
                        <View style={styles.row}>
                          <Text>{this.convertDate(rowData.date)}</Text>
                          <Text>Department: {rowData.department}</Text>
                          <Text>Location: {rowData.location}</Text>
                          <Text>Description: {rowData.description}</Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                  }
                />

              </View>
              <Text style={{paddingTop: 20}} />
              <Text style={{textAlign: 'center'}}>*Press an entry above to view image if available</Text>

              <TouchableHighlight style={styles.button} onPress={this.closeTicketModal} underlayColor='#f78080'>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableHighlight>
            </View>
            <Modal
                visible={this.state.imageModalVisible}
                animationType={'slide'}
                onRequestClose={() => this.closeImageModal()}
            >
              <View style={styles.modalContainer}>
                <View style={styles.innerContainer}>
                <ProgressImg
                  source={{uri: this.state.imageURL}}
                  indicator={Platform.OS === 'ios' ? Progress.Pie : Progress.Bar}
                  indicatorProps={{
                      size: 80,
                      borderWidth: 0,
                      color: 'rgba(150, 150, 150, 1)',
                      unfilledColor: 'rgba(200, 200, 200, 0.2)'
                  }}
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                  resizeMode={'contain'}
                  />
                </View>
                <Text style={{paddingTop: 20}} />
                <TouchableHighlight style={styles.button} onPress={this.closeImageModal} underlayColor='#f78080'>
                  <Text style={styles.buttonText}>Close Image</Text>
                </TouchableHighlight>
              </View>
            </Modal>
          </Modal>
          </View>
        </View>
      </ScrollView>
    );
  }

  loadScreen() {
    return (
      <View style={styles.loadScreen}>
        <Animatable.Image
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"

          style={styles.image}
          resizeMode='contain'
          source={require('./images/banner.png')}
        />
        <Text style={{paddingTop: 20}} />
        <Animatable.Text
          animation="slideInUp"
          iterationCount={1}
        >Loading</Animatable.Text>
      </View>
    );
  }

  submitPass(pass) {
    if (pass === 'uc' || pass === 'UC' || pass === 'uC' || pass === 'Uc') {
      AsyncStorage.setItem('pass', pass);
      this.setState({passValid:true});
    }
  }

  passScreen() {
    return (
      <View style={styles.loadScreen}>
        <TextInput
          style={{width:200, height:60, borderWidth:1, borderColor:"black"}}
          placeholder='Input password here'
          onChangeText={(passText) => this.setState({passText})}
          value={this.state.passText}>
        </TextInput>
        <TouchableHighlight style={styles.button} onPress={this.submitPass(this.state.passText)} underlayColor='#f78080'>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return (
      <View>
        {(this.state.loaded & this.state.passValid) ? this.appContent() : (!this.state.passValid ? this.passScreen() : this.loadScreen())}
      </View>
    );
  }
}
