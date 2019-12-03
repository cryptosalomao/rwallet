/** Actions related to Wallet functions */

const actions = {
  // Constants definition
  GET_WALLETS: 'GET_WALLETS',
  GET_WALLETS_RESULT: 'GET_WALLETS_RESULT',
  GET_PRICE: 'GET_PRICE',
  GET_PRICE_RESULT: 'GET_PRICE_RESULT',
  SET_WALLET_MANAGER: 'SET_WALLET_MANAGER',

  // Functions definition
  getWallets: () => ({
    type: actions.GET_WALLETS,
  }),
  getPrice: (symbols, currencies, currency) => {
    console.log('actions::getPrice is called.', symbols, currencies, currency);
    return {
      type: actions.GET_PRICE,
      payload: {
        symbols,
        currencies,
      },
      currency,
    };
  },
};

export default actions;