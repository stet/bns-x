import { BnsContractsClient } from '../src/index';

test('works for different environments', () => {
  process.env.NEXT_PUBLIC_NETWORK_KEY = '';
  const code = new BnsContractsClient('testnet').nameWrapperCode;

  expect(code.includes('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')).toBeFalsy();
});

test('works on mainnet', () => {
  process.env.NEXT_PUBLIC_NETWORK_KEY = '';

  const code = new BnsContractsClient('mainnet').nameWrapperCode;

  expect(code.includes('ST000')).toBeFalsy();
  expect(code.includes('SP000000000000000000002Q6VF78.bns')).toBeTruthy();
  expect(code.includes('SP000000000000000000002Q6VF78.bns.bns')).toBeFalsy();
  expect(code.includes('ST000000000000000000002AMW42H.bns')).toBeFalsy();
  expect(code.includes('SP1JTCR202ECC6333N7ZXD7MK7E3ZTEEE1MJ73C60')).toBeTruthy();
  expect(code.includes('withdraw-stx')).toBeTruthy();
});

test('validating name wrapper code', () => {
  const testnet = new BnsContractsClient('testnet');
  const mainnet = new BnsContractsClient('mainnet');
  const devnet = new BnsContractsClient('devnet');

  const testnetContract = testnet.nameWrapperCode;
  const mainnetValid = mainnet.isValidNameWrapper(testnetContract);

  expect(mainnetValid).toBeFalsy();

  expect(mainnet.isValidNameWrapper(mainnet.nameWrapperCode)).toBeTruthy();

  expect(testnet.isValidNameWrapper(devnet.nameWrapperCode)).toBeFalsy();
});
