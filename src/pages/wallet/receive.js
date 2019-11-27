import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode-svg';
import Entypo from 'react-native-vector-icons/Entypo';
import flex from '../../assets/styles/layout.flex';
import color from '../../assets/styles/color.ts';

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    letterSpacing: 0.39,
    fontWeight: '900',
    color: '#000',
    marginBottom: 10,
  },
  sectionContainer: {
    marginTop: 10,
    marginHorizontal: 20,
    paddingBottom: 10,
  },
  input: {
    height: 50,
  },
  headerView: {
    position: 'absolute',
    width: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    top: 48,
    left: 55,
    color: '#FFF',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 37,
  },
  chevron: {
    color: '#FFF',
  },
  headImage: {
    position: 'absolute',
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  address: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    fontSize: 16,
    height: 40,
    paddingHorizontal: 10,
  },

  qrView: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    height: 330,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

const header = require('../../assets/images/misc/header.png');

export default class WalletReceive extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    componentDidMount() {}

    render() {
      const { navigation } = this.props;
      const { address } = navigation.state.params;
      const logo = navigation.state.params.icon;
      const qrSize = 200;
      const qrLogoSize = qrSize * 0.3;
      return (
        <View style={[flex.flex1]}>
          <View style={[{ height: 100 }]}>
            <Image source={header} style={styles.headImage} />
            <View style={styles.headerView}>
              <Text style={styles.headerTitle}>Receive BTC</Text>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.body}>
            <View style={[styles.sectionContainer, { paddingBottom: 20 }]}>
              <Text style={[styles.sectionTitle]}>Address</Text>
              <View style={styles.address}><Text>{address}</Text></View>
            </View>
            <View style={[styles.sectionContainer, styles.qrView]}>
              <QRCode
                value={address}
                logo={logo}
                logoMargin={5}
                size={qrSize}
                logoSize={qrLogoSize}
              />
            </View>
          </View>
        </View>
      );
    }
}

WalletReceive.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};