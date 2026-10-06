import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';
import DataTable from '@commercetools-uikit/data-table';
import { Pagination } from '@commercetools-uikit/pagination';
import {
  usePaginationState,
  useDataTableSortingState,
} from '@commercetools-uikit/hooks';
import { useCustomersFetcher } from '../../hooks/use-customers-fetcher';
import messages from './messages';

const columns = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'companyName', label: 'Company Name' },
];

const CustomersView = () => {
  const intl = useIntl();
  const history = useHistory();
  const match = useRouteMatch();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'email', order: 'asc' });

  const { customersPaginatedResult, error, loading } = useCustomersFetcher({
    page,
    perPage,
    tableSorting,
  });

  const translatedColumns = columns.map((column) => ({
    key: column.key,
    label: intl.formatMessage(
      messages[`column${column.key.charAt(0).toUpperCase() + column.key.slice(1)}`]
    ),
    isSortable: true,
  }));

  if (error) {
    return (
      <Text.Body intlMessage={{ id: 'Customers.error', defaultMessage: 'Error loading customers.' }} />
    );
  }

  return (
    <Spacings.Stack scale="m">
      <Text.Headline as="h2" intlMessage={messages.title} />

      {loading ? (
        <Text.Body>Loading...</Text.Body>
      ) : (
        <Spacings.Stack scale="m">
          <DataTable
            isCondensed
            columns={translatedColumns}
            rows={customersPaginatedResult?.results || []}
            itemRenderer={(row, column) => row[column.key] || ''}
            sortedBy={tableSorting.value.key}
            sortDirection={tableSorting.value.order}
            onSortChange={tableSorting.onChange}
            onRowClick={(row) => history.push(`${match.url}/${row.id}`)}
          />

          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={customersPaginatedResult?.total || 0}
          />
        </Spacings.Stack>
      )}
    </Spacings.Stack>
  );
};

CustomersView.displayName = 'CustomersView';

export default CustomersView;
