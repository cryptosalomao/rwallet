import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import RNSecureStorage from 'rn-secure-storage';
import _ from 'lodash';

const KEY_WALLETS = 'WALLETS';
const KEY_PRICES = 'PRICE';
const SECURE_KEY_PASSCODE = 'PASSCODE';
const SECURE_KEY_PHRASE_PREFIX = 'PHRASE_';
const SECURE_KEY_PRIVATE_KEY_PREFIX = 'PRIVATE_KEY_';
const KEY_DAPPS = 'DAPPS';
const KEY_DAPP_TYPES = 'DAPPTYPES';
const ADVERTISEMENTS = 'ADVERTISEMENTS';
const KEY_RECENT_DAPPS = 'RECENTDAPPS';
const IS_SHOW_RNS_FEATURE = 'isShowRnsFeature';
const RNS_REGISTERING_SUBDOMAINS = 'rnsRegisteringSubdomains';
const USE_TRANSACTION_FALLBACK_ADDRESSES = 'useTransactionFallbackAddress';
const STORAGE_VERSION = 'storageVersion';
const UPDATE_VERSION_INFO = 'updateVersionInfo';

class RNStorage {
  constructor() {
    this.instance = new Storage({
      // maximum capacity, default 1000
      size: 9000,
      // Use AsyncStorage for RN apps, or window.localStorage for web apps.
      // If storageBackend is not set, data will be lost after reload.
      storageBackend: AsyncStorage,
      // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
      // can be null, which means never expire.
      defaultExpires: 1000 * 60 * 60 * 24 * 365,
      // cache data in the memory. default is true.
      enableCache: true,
    });

    this.secureInstance = RNSecureStorage;

    this.remove = this.remove.bind(this);
  }

  /**
   *
   * @param {string} key
   * @param {*} data
   * @param {*} id
   * @param {number|null} expires
   * @returns {Promise}
   */
  save(key, data, expires) {
    return this.instance.save({
      key, data, expires,
    });
  }

  /**
   * Load data in Storage by params, for example { key: "settings" }
   * @param {object} params { key: "" }
   */
  async load(params) {
    return this.instance.load(params)
      .catch((err) => {
      // any exception including data not found goes to catch()
        switch (err.name) {
          case 'NotFoundError':
            return null;
          case 'ExpiredError':
          // TODO: figure out what we actually want to do to this case
            return null;
          default:
            return null;
        }
      });
  }

  /**
   *
   * @param {string} key
   * @param {*} id
   * @returns {Promise}
   */
  getLocalItem(key, id) {
    return this.instance.load({
      key, id: id || undefined, autoSync: false, syncInBackground: false,
    });
  }


  /**
   *
   * @param {string} key
   * @param {*} syncParams
   * @param {*} id
   * @returns {Promise}
   */
  getAsyncItem(key, syncParams, id) {
    return this.instance.load({
      key,
      id: id || undefined,
      // autoSync (default: true) means if data is not found or has expired,
      // then invoke the corresponding sync method
      autoSync: true,
      // syncInBackground (default: true) means if data expired,
      // return the outdated data first while invoking the sync method.
      // If syncInBackground is set to false, and there is expired data,
      // it will wait for the new data and return only after the sync completed.
      // (This, of course, is slower)
      syncInBackground: false,
      syncParams: { ...syncParams },
    });
  }

  /**
   *
   * @param {string} key
   * @param {*} id
   * @returns {Promise}
   */
  removeId(key, id) {
    // const that = this;

    if (id) {
      return this.instance.remove({
        key,
        id,
      });
    }

    // // Get storage Ids by key
    // const ids = await this.getIdsForKey(key);

    // // Push all remove promise into an array and handle parallelly
    // const promises = ids.map((storageId) => that.instance.remove({ key, storageId }));

    // return Promise.all(promises);
    return null;
  }

  /**
   * Remove all key values from the Storage instance
   * @returns {Promise}
   */
  remove(key) {
    return this.instance.remove({ key });
  }

  /**
   *
   * @param {string} key
   * @returns {Promise} Array of string
   */
  getIdsForKey(key) {
    return this.instance.getIdsForKey(key);
  }

  /**
   * Set value of a key from RNSecureStorage
   * @param {string} key
   * @param {string} value
   */
  static secureSet(key, value) {
    return RNSecureStorage.set(key, value, {});
  }

  /**
   * Return value of a key from RNSecureStorage
   * null if not found or failed
   * @param {string} key
   */
  static secureGet(key) {
    return RNSecureStorage.exists(key)
      .then((isKeyExists) => {
        if (isKeyExists) {
          return RNSecureStorage.get(key);
        }

        return Promise.resolve(null);
      })
      .catch((err) => {
        console.error('RNStorage.secureGet', err);
        return Promise.resolve(null);
      });
  }

  /**
   * Set Wallets using normal storage
   * @param {string} id Key local Id
   * @param {string} phrase String of Mnemonic Phrase
   */
  setWallets(json) {
    return this.save(KEY_WALLETS, json);
  }

  /**
   * Return Wallets json data from normal storage; null if not found or failed
   * @param {string} id Key local Id
   */
  getWallets() {
    return this.load({ key: KEY_WALLETS });
  }

  /**
   * Set price using normal storage
   * @param {string} id Key local Id
   * @param {string} phrase String of price json
   */
  setPrices = (json) => this.save(KEY_PRICES, json)

  /**
   * Return price json data from normal storage; null if not found or failed
   * @param {string} id Key local Id
   */
  getPrices = () => this.load({ key: KEY_PRICES })

  /**
   * Set Passcode using secure storage
   * @param {string} passcode String of Passcode
   */
  setPasscode = (passcode) => RNStorage.secureSet(SECURE_KEY_PASSCODE, passcode)

  /**
   * Return Passcode from secure storage; null if not found or failed
   */
  getPasscode = () => RNStorage.secureGet(SECURE_KEY_PASSCODE)

  /**
   * Set dapps using normal storage
   * @param {string} id Key local id
   * @param {string} dapps all active dapps
   */
  setDapps = (dapps) => this.save(KEY_DAPPS, dapps)

  /**
   * Return dapps from nomal storage; null if not found or failed
   * @param {string} id Key local id
   */
  getDapps = () => this.load({ key: KEY_DAPPS })

  /**
   * Set dapp types using normal storage
   * @param {string} id Key local id
   * @param {string} dappTypes all active dapp types
   */
  setDappTypes = (dappTypes) => this.save(KEY_DAPP_TYPES, dappTypes)

  /**
   * Return dapp types from nomal storage; null if not found or failed
   * @param {string} id Key local id
   */
  getDappTypes = () => this.load({ key: KEY_DAPP_TYPES })

  /**
   * Set advertisements using normal storage
   * @param {string} id Key local id
   * @param {string} ads all active advertisements
   */
  setAdvertisements = (ads) => this.save(ADVERTISEMENTS, ads)

  /**
   * Return advertisements from nomal storage; null if not found or failed
   * @param {string} id Key local id
   */
  getAdvertisements = () => this.load({ key: ADVERTISEMENTS })

  /**
   * Set recent dapps using normal storage
   * @param {string} id Key local id
   * @param {string} recentDapps recent dapps
   */
  setRecentDapps = (recentDapps) => this.save(KEY_RECENT_DAPPS, recentDapps)

  /**
   * Return recent dapps from nomal storage; null if not found or failed
   * @param {string} id Key local id
   */
  getRecentDapps = () => this.load({ key: KEY_RECENT_DAPPS })

  /**
   * Set Mnemonic Phrase using secure storage
   * @param {string} id Key local Id
   * @param {string} phrase String of Mnemonic Phrase
   */
  setMnemonicPhrase = (id, phrase) => RNStorage.secureSet(`${SECURE_KEY_PHRASE_PREFIX}${id}`, phrase)

  /**
   * Return Mnemonic Phrase from secure storage; null if not found or failed
   * @param {string} id Key local Id
   */
  getMnemonicPhrase = (id) => RNStorage.secureGet(`${SECURE_KEY_PHRASE_PREFIX}${id}`)

  setPrivateKey = (id, symbol, type, privateKey) => RNStorage.secureSet(`${SECURE_KEY_PRIVATE_KEY_PREFIX}${id}_${symbol}_${type}`, privateKey)

  getPrivateKey = (id, symbol, type) => RNStorage.secureGet(`${SECURE_KEY_PRIVATE_KEY_PREFIX}${id}_${symbol}_${type}`)

  async getIsShowRnsFeature() {
    const isShowRnsFeature = await this.load({ key: IS_SHOW_RNS_FEATURE });
    return isShowRnsFeature || false;
  }

  setIsShowRnsFeature() {
    return this.save(IS_SHOW_RNS_FEATURE, true);
  }

  getRnsRegisteringSubdomains() {
    return this.load({ key: RNS_REGISTERING_SUBDOMAINS });
  }

  setRnsRegisteringSubdomains(records) {
    return this.save(RNS_REGISTERING_SUBDOMAINS, records);
  }

  clearRnsRegisteringSubdomains() {
    this.remove(RNS_REGISTERING_SUBDOMAINS);
  }

  getUseTransactionFallbackAddresses() {
    return this.load({ key: USE_TRANSACTION_FALLBACK_ADDRESSES });
  }

  setUseTransactionFallback(addresses) {
    this.save(USE_TRANSACTION_FALLBACK_ADDRESSES, addresses);
  }

  /**
   * add address to transaction fallback address list
   * @param {*} address
   */
  async addUseTransactionFallbackAddress(address) {
    let addresses = await this.load({ key: USE_TRANSACTION_FALLBACK_ADDRESSES });
    if (_.isNull(addresses)) {
      addresses = [];
    }
    const foundAddress = _.find(addresses, (item) => address === item);
    if (foundAddress) {
      return;
    }
    addresses.push(address);
    await this.save(USE_TRANSACTION_FALLBACK_ADDRESSES, addresses);
  }

  /**
   * remove address from transaction fallback address list
   * @param {*} address
   */
  async removeUseTransactionFallbackAddress(address) {
    const addresses = await this.load({ key: USE_TRANSACTION_FALLBACK_ADDRESSES });
    if (_.isEmpty(addresses)) {
      return;
    }
    _.remove(addresses, (item) => address === item);
    await this.save(USE_TRANSACTION_FALLBACK_ADDRESSES, addresses);
  }

  /**
   * check if the address is in the transaction fallback address list
   * @param {*} address
   */
  async isUseTransactionFallbackAddress(address) {
    const addresses = await this.load({ key: USE_TRANSACTION_FALLBACK_ADDRESSES });
    if (_.isEmpty(addresses)) {
      return false;
    }
    const foundAddress = _.find(addresses, (item) => address === item);
    return !!foundAddress;
  }

  setStorageVersion = async (version) => {
    await this.save(STORAGE_VERSION, version);
  }

  getStorageVersion = async () => this.load({ key: STORAGE_VERSION })

  /**
   * Get update version info that is fetched from server.
   */
  getUpdateVersionInfo = async () => {
    const updateVersionInfo = await this.load({ key: UPDATE_VERSION_INFO });
    return updateVersionInfo;
  }

  setUpdateVersionInfo = async (versionInfo) => {
    await this.save(UPDATE_VERSION_INFO, versionInfo);
  }
}

export default new RNStorage();
