import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import FetchCustomersQuery from './fetch-customers.ctp.graphql';

export const useCustomersFetcher = ({ page, perPage, tableSorting }) => {
  const { data, error, loading } = useMcQuery(FetchCustomersQuery, {
    variables: {
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: tableSorting ? [`${tableSorting.value.key} ${tableSorting.value.order}`] : undefined,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    customersPaginatedResult: data?.customers,
    error,
    loading,
  };
};
