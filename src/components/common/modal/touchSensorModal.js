import React, { Component } from 'react';
import {
  View, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import * as Animatable from 'react-native-animatable';
import color from '../../../assets/styles/color';
import Loc from '../misc/loc';
import { strings } from '../../../common/i18n';
import common from '../../../common/common';
import CONSTANTS from '../../../common/constants.json';
import { DEVICE } from '../../../common/info';

const { BIOMETRY_TYPES } = CONSTANTS;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: color.transparent,
  },
  panel: {
    marginHorizontal: 25,
    alignItems: 'center',
    backgroundColor: color.component.touchSensorModal.panel.backgroundColor,
    borderRadius: 5,
    paddingTop: 30,
    paddingBottom: 55,
  },
  scanView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: color.component.touchSensorModal.color,
    fontFamily: 'Avenir-Book',
    fontSize: 30,
  },
  finger: {
    marginTop: 20,
    marginBottom: 10,
  },
  touchToVerify: {
    fontFamily: 'Avenir-Heavy',
    color: color.black,
    marginBottom: 17,
  },
  passcode: {},
  passcodeText: {
    color: color.text.warning,
    fontFamily: 'Avenir-Heavy',
    fontSize: 17,
  },
  errView: {
    paddingHorizontal: 20,
  },
  errText: {
    marginTop: 10,
    color: color.red,
    textAlign: 'center',
    lineHeight: 20,
  },
  cancelView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  cancelText: {
    fontFamily: 'Avenir-Heavy',
    color: color.text.link,
    fontSize: 17,
  },
});

const finger = require('../../../assets/images/misc/finger.png');
const face = require('../../../assets/images/misc/face.png');

export default class TouchSensorModal extends Component {
  constructor(props) {
    super(props);
    this.onCancelPress = this.onCancelPress.bind(this);
    this.onUsePasscodePress = this.onUsePasscodePress.bind(this);
    this.onIconPressed = this.onIconPressed.bind(this);
    this.requestScan = this.requestScan.bind(this);
    this.state = { errorMessage: null, biometryType: null };
  }

  async componentDidMount() {
    const biometryType = await common.getBiometryType();
    this.setState({ biometryType });
    this.requestScan();
  }

  componentWillUnmount = () => {
    FingerprintScanner.release();
  }

  onIconPressed() {
    this.setState({ errorMessage: null });
    this.requestScan();
  }

  onUsePasscodePress() {
    const {
      hideFingerprintModal, fingerprintUsePasscode, fingerprintCallback, fingerprintFallback,
    } = this.props;
    if (fingerprintUsePasscode) {
      fingerprintUsePasscode(fingerprintCallback, fingerprintFallback);
      hideFingerprintModal();
    }
  }

  onCancelPress() {
    const { hideFingerprintModal, fingerprintFallback } = this.props;
    if (fingerprintFallback) {
      fingerprintFallback();
      hideFingerprintModal();
    }
  }

  startShow = () => {}

  getBiometryText = (biometryType, key) => {
    const prefix = 'modal.touchSensor';
    const type = {
      [BIOMETRY_TYPES.FACE_ID]: 'faceID',
      [BIOMETRY_TYPES.TOUCH_ID]: 'fingerprint',
      [BIOMETRY_TYPES.Biometrics]: 'biometrics',
    };
    const biometricText = `${prefix}.${type[biometryType]}.${key}`;
    return biometricText;
  }

  requestScan() {
    const { biometryType } = this.state;
    const { hideFingerprintModal, fingerprintCallback } = this.props;
    const onAttempt = (error) => {
      console.log(`onAttempt: ${error}`);
      const errorMessage = this.getBiometryText(biometryType, 'notMatch');
      this.setState({ errorMessage }, () => this.errView.shake(800));
    };
    const params = {
      onAttempt,
      description: strings(this.getBiometryText(biometryType, 'nativeNote')),
      fallbackEnabled: false,
      cancelButton: strings('button.cancel'),
    };
    FingerprintScanner.authenticate(params).then(() => {
      this.setState({ errorMessage: null });
      if (fingerprintCallback) {
        fingerprintCallback();
      }
      hideFingerprintModal();
    }).catch((error) => {
      console.log(`FingerprintScanner, error, name: ${error.name}, message: ${error.message}, biometric: ${error.biometric}`);
      // If it fails, you need to call FingerprintScanner.release. Otherwise, the callback will not be executed when FingerprintScanner.authenticate is called again on Android.
      if (DEVICE.android) {
        FingerprintScanner.release();
      }
      // If error.name is UserCancel, errorMessage is null
      // If error.name is AuthenticationFailed or FingerprintScannerNotSupported,
      // user have tried five times, system have stoped fingerprint verification.
      // We should let user use passcode.
      // If error.name is others, let user try again.
      switch (error.name) {
        case 'UserCancel':
          this.setState({ errorMessage: null });
          break;
        case 'AuthenticationFailed':
        case 'FingerprintScannerNotSupported':
          this.setState({ errorMessage: 'modal.touchSensor.failedAndTryPasscode' }, () => this.errView.shake(800));
          break;
        default:
          this.setState({ errorMessage: 'modal.touchSensor.failedAndTryAgain' }, () => this.errView.shake(800));
      }
    });
  }

  renderModal() {
    const { fingerprintPasscodeDisabled, fingerprintFallback } = this.props;
    const { errorMessage, biometryType } = this.state;
    const titleText = this.getBiometryText(biometryType, 'title');
    const touchToVerifyText = this.getBiometryText(biometryType, 'touchToVerify');
    const icon = biometryType === BIOMETRY_TYPES.FACE_ID ? face : finger;
    return (
      <View style={styles.container}>
        <View style={styles.panel}>
          <Loc style={[styles.title]} text={titleText} />
          <Animatable.View ref={(ref) => { this.errView = ref; }} useNativeDriver style={styles.errView}>
            { errorMessage && (
              <Loc style={[styles.errText]} text={errorMessage} />
            )}
          </Animatable.View>
          <TouchableOpacity
            style={styles.finger}
            onPress={this.onIconPressed}
          >
            <Image source={icon} />
          </TouchableOpacity>
          <Loc style={[styles.touchToVerify]} text={touchToVerifyText} />

          {
            !fingerprintPasscodeDisabled && (
              <TouchableOpacity
                style={styles.passcode}
                onPress={this.onUsePasscodePress}
              >
                <Loc style={[styles.passcodeText]} text="modal.touchSensor.usePasscode" />
              </TouchableOpacity>
            )
          }
          {
            fingerprintFallback && (
              <TouchableOpacity style={[styles.cancelView]} onPress={this.onCancelPress}>
                <Loc style={[styles.cancelText]} text="button.cancel" />
              </TouchableOpacity>
            )
          }
        </View>
      </View>
    );
  }

  render() {
    // render only if isShowFingerprintModal is true.
    const { isShowFingerprintModal } = this.props;
    return isShowFingerprintModal ? this.renderModal() : null;
  }
}

TouchSensorModal.propTypes = {
  isShowFingerprintModal: PropTypes.bool.isRequired,
  hideFingerprintModal: PropTypes.func.isRequired,
  fingerprintPasscodeDisabled: PropTypes.bool,
  fingerprintCallback: PropTypes.func,
  fingerprintFallback: PropTypes.func,
  fingerprintUsePasscode: PropTypes.func,
};

TouchSensorModal.defaultProps = {
  fingerprintPasscodeDisabled: false,
  fingerprintCallback: null,
  fingerprintFallback: null,
  fingerprintUsePasscode: null,
};
