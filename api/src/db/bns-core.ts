import type { StacksDb } from '@db';
import { getNetwork } from '~/constants';
import { DbQueryTag, dbQuerySummary, observeQuery } from '~/metrics';

export function getBnsSmartContractId(): string {
  const network = getNetwork();
  return network.isMainnet()
    ? 'SP000000000000000000002Q6VF78.bns::names'
    : 'ST000000000000000000002AMW42H.bns::names';
}

export async function fetchNameByAddressCore(db: StacksDb, address: string) {
  const done = observeQuery(DbQueryTag.NAME_BY_ADDRESS);
  const names = await db.names.findFirst({
    select: {
      name: true,
    },
    where: {
      address,
      status: {
        not: 'name-revoke',
      },
      canonical: true,
      microblock_canonical: true,
    },
    orderBy: [
      { registered_at: 'desc' },
      { microblock_sequence: 'desc' },
      { tx_index: 'desc' },
      { event_index: 'desc' },
    ],
  });
  done();
  return names?.name ?? null;
}

export async function fetchSubdomainsByAddress(db: StacksDb, address: string) {
  const done = observeQuery(DbQueryTag.SUBDOMAIN_BY_ADDRESS);
  const result = await db.subdomains.findFirst({
    where: {
      owner: address,
      canonical: true,
      microblock_canonical: true,
    },
    select: {
      fully_qualified_subdomain: true,
    },
    orderBy: {
      fully_qualified_subdomain: 'asc',
    },
  });
  done();
  return result?.fully_qualified_subdomain ?? null;
}

export async function fetchCoreNameByAddress(db: StacksDb, address: string) {
  const name = await fetchNameByAddressCore(db, address);
  if (name !== null) return name;
  return fetchSubdomainsByAddress(db, address);
}
