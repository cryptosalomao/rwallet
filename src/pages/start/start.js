import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, Image, StyleSheet, Text,
} from 'react-native';
import _ from 'lodash';
import VersionNumber from 'react-native-version-number';

import { connect } from 'react-redux';
import Button from '../../components/common/button/button';
import SafeAreaView from '../../components/common/misc/safe.area.view';
import color from '../../assets/styles/color';
import screenHelper from '../../common/screenHelper';

const logo = require('../../assets/images/icon/logo.png');

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    position: 'absolute',
    top: '25%',
  },
  buttonView: {
    position: 'absolute',
    bottom: screenHelper.bottomButtonMargin,
  },
  versionText: {
    color: color.midGrey,
    fontFamily: 'Avenir-Black',
    fontSize: 16,
    fontWeight: '500',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

class StartPage extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      version: '',
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { wallets, navigation, isInitFromStorageDone } = nextProps;
    if (isInitFromStorageDone && !_.isEmpty(wallets)) {
      navigation.navigate('PrimaryTabNavigator');
    }
    return null;
  }

  async componentDidMount() {
    const version = VersionNumber.appVersion;
    this.setState({ version });
  }

  render() {
    const { navigation, wallets, isInitFromStorageDone } = this.props;
    const { version } = this.state;
    return (
      <SafeAreaView style={[styles.page]}>
        <View style={styles.logo}>
          <Image source={logo} />
        </View>
        {isInitFromStorageDone && _.isEmpty(wallets) && (
        <View style={styles.buttonView}>
          <Button text="page.start.start.button" onPress={() => navigation.navigate('TermsPage')} />
        </View>
        )}
        <Text style={styles.versionText}>{`version: ${version}`}</Text>
      </SafeAreaView>
    );
  }
}

StartPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  wallets: PropTypes.arrayOf(PropTypes.object),
  isInitFromStorageDone: PropTypes.bool.isRequired,
};

StartPage.defaultProps = {
  wallets: undefined,
};

const mapStateToProps = (state) => ({
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
  isInitFromStorageDone: state.App.get('isInitFromStorageDone'),
});

export default connect(mapStateToProps, null)(StartPage);
