import React from 'react';
import {
  StyleSheet, View, TextInput, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  textInput: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    fontSize: 15,
    height: 40,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  searchBar: {
    width: '87%',
    height: 28,
    marginTop: 14,
    backgroundColor: color.wildSand,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 15,
  },
  searchIcon: {
    width: 16,
    height: 16,
    resizeMode: 'cover',
  },
});

const search = require('../../../assets/images/icon/search.png');

export default function SearchInput({
  placeholder, placeholderTextColor, onChangeText, onSubmit, style,
}) {
  return (
    <View style={styles.searchBar}>
      <Image style={styles.searchIcon} source={search} />
      <TextInput
        style={style}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
      />
    </View>
  );
}
SearchInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  placeholderTextColor: PropTypes.string,
  onChangeText: PropTypes.func,
  onSubmit: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

SearchInput.defaultProps = {
  placeholderTextColor: null,
  onChangeText: () => null,
  onSubmit: () => null,
  style: null,
};
