import React, { Component } from 'react';
import t from 'tcomb-form-native'
import ImageFactory from 'react-native-image-picker-form'

class Form extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Form
        ref={(ref) => this._formRef=ref}
        type={this.state.type}
        value={this.state.value}
        options={this.state.options}
        onChange={this.onChange}
      />
    )
  }
  }
}
