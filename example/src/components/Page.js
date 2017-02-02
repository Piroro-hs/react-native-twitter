import React, {PropTypes} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#EFEFEF',
    // backgroundColor: '#ECEFF1',
    flex: 1,
  },
  title: {
    height: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.12)',
    marginBottom: 12,
  },
  titleText: {
    textAlign: 'center',
  },
});

const Page = ({title, main}) =>
  <View style={styles.page}>
    <View style={styles.title}>
      <Text style={styles.titleText}>
        {title}
      </Text>
    </View>
    {main}
  </View>;

Page.propTypes = {
  title: PropTypes.string.isRequired,
  main: PropTypes.node.isRequired,
};

export default Page;
