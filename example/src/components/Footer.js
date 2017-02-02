import React, {Component, PropTypes} from 'react';
import {Button, StyleSheet, TextInput, View} from 'react-native';

const styles = StyleSheet.create({
  footer: {
    height: 48,
    flexDirection: 'row',
  },
  input: {
    flex: 1,
  },
});

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }
  render() {
    return (
      <View style={styles.footer} >
        <TextInput
          maxLength={140}
          onChangeText={(text) => {this.setState({text});}}
          style={styles.input}
          value={this.state.text}
        />
        <Button
          onPress={() => {
            this.props.twitter.rest.post('statuses/update', {status: this.state.text})
              .catch(console.warn);
            this.setState({text: ''});
          }}
          title="submit"
        />
      </View>
    );
  }
}

Footer.propTypes = {
  twitter: PropTypes.object.isRequired,
};

export default Footer;
