import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import PropTypes from 'prop-types';

import { strings } from '../../common/i18n';

import BasePageGereral from '../base/base.page.general';
import Button from '../../components/common/button/button';
import Header from '../../components/headers/header';

import color from '../../assets/styles/color.ts';
import presetStyles from '../../assets/styles/style';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  credentialsSection: {
    marginTop: 17,
    paddingBottom: 17,
    marginBottom: 10,
  },
  credentialsTitle: {
    marginBottom: 14,
    fontFamily: 'Avenir-Roman',
    fontSize: 16,
  },
  credentialsView: {
    borderBottomColor: '#bbb',
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: color.component.input.backgroundColor,
    borderColor: color.component.input.borderColor,
    borderRadius: 4,
    borderStyle: 'solid',
  },
  credentialsDescription: {
    marginTop: 20,
    fontFamily: 'Avenir-Roman',
    fontSize: 14,
  },
  input: {
    height: 60,
    borderWidth: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

class AddLightningCredentials extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
  }

  render() {
    const { navigation } = this.props;

    const bottomButton = (<Button text="lightning.configureCredentials.connect" />);
    return (
      <BasePageGereral
        isSafeView
        hasBottomBtn={false}
        hasLoader={false}
        headerComponent={
          <Header
            onBackButtonPress={ () => navigation.goBack() }
            title="lightning.configureCredentials.pageTitle" 
          />
        }
        customBottomButton={bottomButton}
      >
        <View style={styles.body}>
          <View style={styles.credentialsSection}>
            <View>
              <Text style={styles.credentialsTitle}>
                { strings("lightning.configureCredentials.pageDescription") }
              </Text>
            </View>
            <View style={styles.credentialsView}>
              <TextInput
                autoFocus
                style={[presetStyles.textInput, styles.input]}
              />
            </View>
            <View>
              <Text style={styles.credentialsDescription}>
                Formatos suportados: LndHub - LndConnect
              </Text>
            </View>
          </View>
        </View>
      </BasePageGereral>
    );
  }
}

AddLightningCredentials.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language')
});

export default connect(mapStateToProps)(AddLightningCredentials);