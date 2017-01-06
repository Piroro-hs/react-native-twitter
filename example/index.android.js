import React, {Component} from 'react';
import {AppRegistry, Button, Text, TextInput, View} from 'react-native';

import twitter, {auth} from 'react-native-twitter';

export default class RNTExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consumerKey: '',
      consumerSecret: '',
      id: '',
      name: '',
      streamData: '',
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
            auth({
              consumerKey: this.state.consumerKey,
              consumerSecret: this.state.consumerSecret,
            }, 'rnte://auth')
              .then(({accessToken, accessTokenSecret, id, name}) => {
                this.setState({id, name});
                const {stream} = twitter({
                  consumerKey: this.state.consumerKey,
                  consumerSecret: this.state.consumerSecret,
                  accessToken,
                  accessTokenSecret,
                });
                const user = stream('user');
                user.on('data', (data) => {this.setState({streamData: JSON.stringify(data)});});
                user.on('error', (e) => {this.setState({streamData: e});});
              });
          }}
          title="auth"
        />
        <Text>{`id: ${this.state.id}`}</Text>
        <Text>{`name: ${this.state.name}`}</Text>
        <Text selectable={true}>{this.state.streamData}</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent('RNTExample', () => RNTExample);
