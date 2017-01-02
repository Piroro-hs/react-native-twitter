import React, {Component} from 'react';
import {AppRegistry, Button, Text, TextInput, View} from 'react-native';

import {auth} from 'react-native-twitter';

export default class RNTExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consumerKey: '',
      consumerSecret: '',
      accessToken: '',
      accessTokenSecret: '',
      id: '',
      name: '',
    };
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="Consumer Key"
          onChangeText={(consumerKey) => {this.setState({consumerKey});}}
        />
        <TextInput
          placeholder="Consumer Secret"
          onChangeText={(consumerSecret) => {this.setState({consumerSecret});}}
        />
        <Button
          onPress={() => {
            auth(this.state.consumerKey, this.state.consumerSecret, 'rnte://auth')
              .then((data) => {this.setState(data);});
          }}
          title="auth"
        />
        <Text>{`consumerKey: ${this.state.consumerKey}`}</Text>
        <Text>{`consumerSecret: ${this.state.consumerSecret}`}</Text>
        <Text>{`accessToken: ${this.state.accessToken}`}</Text>
        <Text>{`accessTokenSecret: ${this.state.accessTokenSecret}`}</Text>
        <Text>{`id: ${this.state.id}`}</Text>
        <Text>{`name: ${this.state.name}`}</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent('RNTExample', () => RNTExample);
