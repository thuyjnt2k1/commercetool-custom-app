import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import FetchCustomerDetailsQuery from './fetch-customer-details.ctp.graphql';

export const useCustomerDetailsFetcher = (id) => {
  const { data, error, loading } = useMcQuery(FetchCustomerDetailsQuery, {
    variables: {
      id,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
    skip: !id,
  });

  return {
    customer: data?.customer,
    error,
    loading,
  };
};
