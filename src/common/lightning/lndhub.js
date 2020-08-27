import axios from 'axios';
import _ from 'lodash';

export default class LndHub {
  constructor(host) {
    this.host = host;
    this.api = this.createApiInstance();
  }

  buildApiHeaders() {

  }

  createApiInstance() {
    const baseApi = axios.create({
      baseURL: this.host,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });

    return baseApi;
  }

  authenticate() {

  }

  async createInvoice(amount, memo = null) {
    const data = { amount, memo };

    const request = await this.api.post('/addinvoice', data);
  }

  async payInvoice(invoice) {
    const data = { invoice };

    const request = await this.api.post('/payinvoice', data);
  }

  async fetchInvoices() {
    const request = await this.api.get('/gettxs');
  }

  async fetchUserInvoices() {
    const request = await this.api.get('/getuserinvoices');
  }

  async fetchBalance() {
    const request = await this.api.get('/balance');
  }

  static parseProtocolSchema(url) {
    const [credentials, host] = _.split(url, '@');
    const { username, password } = this.parseCredentials(credentials);

    const schema = {
      username,
      password,
      host,
    };

    return schema;
  }
  
  static parseCredentials(credentials) {
    const [username, password] = _.split(credentials, ':');

    const parsedCredentials = {
      username,
      password,
    };

    return parsedCredentials;
  }
}