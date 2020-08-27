import LndHub from '../../../src/common/lightning/lndhub';

describe('Protocol parsing functions', () => {
  test('it should parse credentials string and return an object with user and pass', () => {
    const credentials = 'username:password';
    const expectedResult = { 
      username: 'username', 
      password: 'password',
    };

    expect(LndHub.parseCredentials(credentials)).toEqual(expectedResult);
  });

  test('it should parse the entire URI string and return an object containing the schema', () => {
    const uri = 'username:password@lndhub.test.com';
    const expectedResult = {
      host: 'lndhub.test.com',
      username: 'username',
      password: 'password',
    };

    expect(LndHub.parseProtocolSchema(uri)).toEqual(expectedResult);
  });
});