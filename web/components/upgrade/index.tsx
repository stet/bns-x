import React, { useCallback } from 'react';
import { Box, Flex, SpaceBetween, Stack, Grid } from '@nelson-ui/react';
import { Text } from '../text';
import { Button } from '../button';

import { currentUserV1NameState } from '../../common/store/names';
import { useAtomCallback, useAtomValue } from 'jotai/utils';
import { Link } from '../link';
// import { MigrateFinalizeStep } from './finalize';
import { DeployStep } from '@components/migrate-old/deploy';
import { contractsState, txReceiptState, useReadOnly } from '@store/index';
import {
  migrateNameAtom,
  migrateTxidAtom,
  wrapperContractIdAtom,
  wrapperDeployTxidAtom,
  wrapperSignatureAtom,
} from '@store/migration';
import { MigrateDone } from '@components/migrate-old/done';
import { NameCard } from '@components/name-card';
import { useEffect } from 'react';
import { useDeployWrapper } from '@common/hooks/use-deploy-wrapper';
import { UpgradeOverview } from '@components/upgrade/overview';
import { UpgradeSteps } from '@components/upgrade/steps';

export const Upgrade: React.FC = () => {
  const deployTxid = useAtomValue(wrapperDeployTxidAtom);
  const v1Name = useAtomValue(currentUserV1NameState);
  const migrateTxid = useAtomValue(migrateTxidAtom);
  const name = useAtomValue(migrateNameAtom);

  const cacheName = useAtomCallback(
    useCallback((get, set, name: string) => {
      set(migrateNameAtom, name);
    }, [])
  );

  useEffect(() => {
    if (v1Name?.combined) {
      cacheName(v1Name?.combined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v1Name?.combined]);

  if (v1Name === null && !name) {
    return (
      <Stack>
        <Text variant="Heading03">You don&apos;t have a name!</Text>
        <Text variant="Body01">
          Head over to the <Link href="/faucet">faucet</Link> to get one.
        </Text>
      </Stack>
    );
  }

  if (deployTxid) {
    return <UpgradeSteps />;
  }

  return <UpgradeOverview />;
};