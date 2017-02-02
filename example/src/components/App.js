import React, {Component} from 'react';
import {AsyncStorage, Button, TextInput, View} from 'react-native';

import twitter, {auth} from 'react-native-twitter';

import Footer from './Footer';
import Page from './Page';
import Timeline from './Timeline';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: false,
      tokens: {
        consumerKey: '',
        consumerSecret: '',
        accessToken: '',
        accessTokenSecret: '',
      },
      twitter: null,
    };
  }
  componentDidMount() {
    AsyncStorage.getItem('tokens')
      .then((tokens) => {
        if (tokens) {
          this.handleTokens(JSON.parse(tokens));
        }
      });
  }
  handleTokens(tokens) {
    this.setState({
      authorized: true,
      tokens,
      twitter: twitter(tokens),
    });
  }
  render() {
    return this.state.authorized ?
      <View style={{flex: 1}}>
        <Page title="home" main={<Timeline twitter={this.state.twitter} />} />
        <Footer twitter={this.state.twitter} />
      </View> :
      <View>
        <TextInput
          placeholder="Consumer Key"
          onChangeText={(consumerKey) => {
            this.setState({tokens: {...this.state.tokens, consumerKey}});
          }}
        />
        <TextInput
          placeholder="Consumer Secret"
          onChangeText={(consumerSecret) => {
            this.setState({tokens: {...this.state.tokens, consumerSecret}});
          }}
        />
        <Button
          onPress={() => {
            auth(this.state.tokens, 'rnte://auth')
              .then(({accessToken, accessTokenSecret}) => {
                const tokens = {...this.state.tokens, accessToken, accessTokenSecret};
                this.handleTokens(tokens);
                AsyncStorage.setItem('tokens', JSON.stringify(tokens));
              });
          }}
          title="auth"
        />
      </View>;
  }
}

export default App;
