import React, { PureComponent } from 'react';
import {
  Image as RNImage, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: color.grayF2,
  },
});

export default class Image extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoadedEnd: false,
    };
  }

  render() {
    const { isLoadedEnd } = this.state;
    const { style, source } = this.props;
    return (
      <RNImage
        source={source}
        style={[style, isLoadedEnd ? {} : styles.placeholder]}
        onLoadEnd={() => {
          this.setState({ isLoadedEnd: true });
        }}
      />
    );
  }
}

Image.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  source: PropTypes.object.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Image.defaultProps = {
  style: null,
};
