/* eslint-disable @typescript-eslint/no-empty-function */
import React, { Suspense, useMemo } from 'react';
import { SpaceBetween, Stack } from '@nelson-ui/react';
import { Text } from '../text';
import { useAuth } from '@micro-stacks/react';
import { HeaderLink } from '@components/layout/header';
import { styled } from '@common/theme';
import { useAtomValue } from 'jotai';
import { isMainnetState } from '@store/index';

const FooterContainer = styled(SpaceBetween, {
  flexDirection: 'row',
  alignItems: 'center',
  '@bp1': {
    flexDirection: 'column',
    pt: '10px',
    alignItems: 'flex-start',
    gap: '0',
    // alignItems: '',
  },
  variants: {
    outer: {
      true: {
        '@bp1': {
          pl: '29px',
          gap: '10px !important',
        },
      },
    },
  },
});

export const Footer: React.FC<{ children?: React.ReactNode }> = () => {
  const year = useMemo(() => {
    return new Date().getFullYear();
  }, []);
  const isMainnet = useAtomValue(isMainnetState);
  return (
    <FooterContainer
      // isInline
      width="100%"
      maxWidth="1120px"
      pt="25px"
      pb="45px"
      pl="17px"
      pr="29px"
      alignItems="center"
      outer
    >
      <FooterContainer spacing="8px">
        <HeaderLink onClick={() => {}} href="#" color="$onSurface-text-subdued">
          Discord
        </HeaderLink>
        <HeaderLink onClick={() => {}} href="#" color="$onSurface-text-subdued">
          Twitter
        </HeaderLink>
        <HeaderLink onClick={() => {}} href="#" color="$onSurface-text-subdued">
          Docs
        </HeaderLink>
        {/* <HeaderLink onClick={() => {}} href="#" color="$onSurface-text-subdued">
            Mint BNS names
          </HeaderLink> */}
        {!isMainnet && (
          <HeaderLink href="/faucet" color="$onSurface-text-subdued">
            Testnet faucet
          </HeaderLink>
        )}
      </FooterContainer>
      <Text variant="Body01" color="$onSurface-text-dim">
        © {year} dots.so
      </Text>
    </FooterContainer>
  );
};
