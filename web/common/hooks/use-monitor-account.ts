import { microStacksStoreAtom, networkAtom, stxAddressAtom } from '@store/micro-stacks';
import { useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { hexToBytes } from 'micro-stacks/common';
import { c32address, StacksNetworkVersion } from 'micro-stacks/crypto';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

export function useMonitorAccount(primaryIndex?: number, pathAccountIndex?: number) {
  const router = useRouter();
  const stxAddress = useAtomValue(stxAddressAtom);

  const setAccount = useAtomCallback(
    useCallback((get, set, address: string) => {
      const store = get(microStacksStoreAtom);
      const network = get(networkAtom);

      store.setState(({ accounts }) => {
        const accountIndex = accounts?.findIndex(a => {
          const _address = c32address(
            network.isMainnet()
              ? StacksNetworkVersion.mainnetP2PKH
              : StacksNetworkVersion.testnetP2PKH,
            hexToBytes(a.address[1])
          );
          return address === _address;
        });

        if (accountIndex === -1) {
          return {};
        }

        console.log(`Setting account index ${accountIndex} for address ${address}`);

        return {
          currentAccountIndex: accountIndex,
        };
      });
    }, [])
  );

  const resetFromSSR = useAtomCallback(
    useCallback(
      get => {
        const store = get(microStacksStoreAtom);
        // const storeIndex = store.getState().currentAccountIndex;
        if (typeof pathAccountIndex !== 'undefined') {
          // if (pathAccountIndex !== storeIndex) {
          console.log('First load - setting index to path-based account', pathAccountIndex);
          store.setState({ currentAccountIndex: pathAccountIndex });
          // }
        } else if (typeof primaryIndex !== 'undefined') {
          console.log('First load - resetting index to primary', primaryIndex);
          store.setState({ currentAccountIndex: primaryIndex });
        }
        // if (typeof pathAccountIndex !== 'undefined' && pathAccountIndex !== storeIndex) {
        //   console.log('First load - setting index to path-based account', pathAccountIndex);
        //   store.setState({ currentAccountIndex: pathAccountIndex });
        // } else if (typeof primaryIndex !== 'undefined' && primaryIndex !== storeIndex) {
        //     console.log('First load - resetting index to primary', primaryIndex);
        //     store.setState({ currentAccountIndex: primaryIndex });
        // }
      },
      [primaryIndex, pathAccountIndex]
    )
  );

  useEffect(() => {
    void resetFromSSR();
  }, [resetFromSSR]);

  useEffect(() => {
    console.log(`Account changed to ${stxAddress ?? 'none'}`);
  }, [stxAddress]);

  useEffect(() => {
    const setAccountFromRoute = (url: string) => {
      if (url.startsWith('/accounts/')) {
        const address = url.split('/')[2];
        if (!address) return;
        void setAccount(address);
      } else {
        void resetFromSSR();
      }
    };

    setAccountFromRoute(router.pathname);

    router.events.on('routeChangeStart', setAccountFromRoute);

    return () => {
      router.events.off('routeChangeStart', setAccountFromRoute);
    };
  }, [router, setAccount, resetFromSSR]);
}