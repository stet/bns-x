import React, { memo, useCallback, useMemo } from 'react';
import type { BoxProps } from '@nelson-ui/react';
import { Stack, Box, Flex, SpaceBetween } from '@nelson-ui/react';
import { currentUserV1NameState, currentUserAddressNameStringsState } from '@store/names';
import type { ResponsiveVariant } from './text';
import { Text } from './text';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { Button } from '@components/button';
import { useRouter } from 'next/router';
import { useGradient } from '@common/hooks/use-gradient';
import { stxAddressAtom } from '@store/micro-stacks';
import { truncateMiddle } from '@common/utils';
import { BoxLink, Link, LinkText } from '@components/link';
import { styled } from '@common/theme';
import { usePunycode } from '@common/hooks/use-punycode';
import { useAccountPath } from '@common/hooks/use-account-path';

const StyledName = styled(Text, {
  // initial: {
  fontSize: '28px',
  lineHeight: '44px',
  // },
  '@bp1': {
    fontSize: '22px',
    lineHeight: '36px',
  },
});

const StyledEditBox = styled(Box, {
  display: 'block',
  '@bp1': {
    display: 'none',
  },
});

const StyledAvatar = styled(Box, {
  width: '86px',
  height: '86px',
  // '@bp1': {
  //   width: '40px',
  //   height: '40px',
  // },
});

export const ProfileRow: React.FC<{
  children?: React.ReactNode;
  v1?: boolean;
  name: string;
}> = ({ v1 = false, name }) => {
  const nameString = usePunycode(name);
  const router = useRouter();
  const gradient = useGradient(name);
  const upgradePath = useAccountPath('/upgrade');

  const upgrade = useCallback(async () => {
    await router.push(upgradePath);
  }, [router, upgradePath]);

  const namePath = useAccountPath(`/names/[name]`, { name });

  const manage = useCallback(async () => {
    await router.push(namePath);
  }, [router, namePath]);
  const stxAddress = useAtomValue(stxAddressAtom);

  return (
    <SpaceBetween isInline alignItems={'center'} width="100%" height="136px" px="29px">
      <Stack alignItems={'center'} isInline>
        <StyledAvatar
          borderRadius="50%"
          aspectRatio="1"
          maxWidth="86px"
          maxHeight="86px"
          backgroundImage={gradient}
          onClick={async () => {
            if (v1) {
              await upgrade();
            } else {
              await manage();
            }
          }}
        />
        <Stack spacing="6px">
          <StyledName variant="Heading035" color={'$text'}>
            {nameString}
          </StyledName>
          <div className="flex flex-row gap-[27px] h-[27px] items-baseline">
            <LinkText
              href={`https://explorer.stacks.co/address/${stxAddress ?? ''}`}
              target="_blank"
              variant="Body02"
              color={'$onSurface-text-subdued'}
            >
              {truncateMiddle(stxAddress || '')}
            </LinkText>
            <Text variant="Body02" height="20px" color={'$onSurface-text-subdued'}>
              {v1 ? 'BNS Core' : 'BNSx'}
            </Text>
          </div>
        </Stack>
      </Stack>
      <StyledEditBox>
        <Stack isInline>
          <BoxLink href={namePath}>
            <Button secondary={v1}>Edit</Button>
          </BoxLink>
          {v1 && (
            <Button
              onClick={upgrade}
              // secondary
              // backgroundColor="$dark-primary-action-primary"
              // color="$text-onPrimary"
            >
              Upgrade
            </Button>
          )}
        </Stack>
        {/* {v1 ? <Button onClick={upgrade}>Upgrade</Button> : <Button disabled>Edit</Button>} */}
      </StyledEditBox>
    </SpaceBetween>
  );
};

const Border: React.FC = () => {
  return (
    <Flex width="100%" px="29px" alignItems="center">
      <Box width="100%" height="1px" borderTop="1px solid $onSurface-border-subdued" />
    </Flex>
  );
};

export const Profile: React.FC<{ children?: React.ReactNode }> = () => {
  const allNames = useAtomValue(currentUserAddressNameStringsState);
  const v1Name = allNames.coreName;

  useEffect(() => {
    console.log('All names:', allNames);
  }, [allNames]);

  const rows = useMemo(() => {
    return (
      allNames?.bnsxNames.map((name, index) => {
        return (
          <Box key={`name-${name.id}`}>
            {index === 0 && <Border />}
            <ProfileRow name={name.name} />
            <Border />
          </Box>
        );
      }) ?? null
    );
  }, [allNames?.bnsxNames]);

  const noNames = useMemo(() => {
    return allNames.coreName === null && allNames.bnsxNames.length === 0;
  }, [allNames.coreName, allNames.bnsxNames.length]);

  const mintName = useCallback(() => {
    window.open('https://btc.us', '_blank');
  }, []);

  return (
    <>
      <Box flexGrow={1} />
      <Stack width="100%" spacing="0px">
        {noNames ? (
          <Stack spacing="0" alignContent="center" width="100%" textAlign="center">
            <Text width="100%" variant="Display02">
              No names here
            </Text>
            <Text width="100%" mt="15px" variant="Body02">
              Looks like this address doesn&apos;t own any BNS or BNSx names. Mint a name then come
              back.
            </Text>
            <Button type="big" onClick={mintName} mx="auto" mt="49px">
              Mint name
            </Button>
          </Stack>
        ) : (
          <>
            {v1Name !== null ? (
              <>
                <Border />
                <ProfileRow v1 name={v1Name} />
                {rows?.length === 0 && <Border />}
              </>
            ) : null}
            {rows}
            <Flex py="25px" justifyContent="center">
              <Text variant="Caption01">You can send many BNSx names to this address</Text>
            </Flex>
          </>
        )}
      </Stack>
      <Box flexGrow={1} />
    </>
  );
};
