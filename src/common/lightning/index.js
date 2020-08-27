import _ from 'lodash';
import lndhub from './lndhub';

export default class Lightning {
  constructor({url}) {
    this.applicationProtocol = this.parseUrlScheme(url);
  }

  static parseProtocolSchema(url) {

  }
}