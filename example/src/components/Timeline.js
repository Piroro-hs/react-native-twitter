import React, {Component, PropTypes} from 'react';
import {ListView, Text, StyleSheet} from 'react-native';

// import Tweet from './Tweet';

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    };
  }
  componentDidMount() {
    let tweets = [];
    this.props.twitter.stream('user')
      .on('data', (data) => {
        if (data.text) {
          tweets = [`${data.user.name} / @${data.user.screen_name}\n${data.text}`].concat(tweets);
          this.setState({dataSource: this.state.dataSource.cloneWithRows(tweets)});
        }
      })
      .on('error', console.warn);
  }
  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={rowData => <Text>{rowData}</Text>}
      />
    );
  }
}

Timeline.propTypes = {
  twitter: PropTypes.object.isRequired,
};

export default Timeline;
