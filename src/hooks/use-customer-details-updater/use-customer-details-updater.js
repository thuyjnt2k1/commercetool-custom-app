import { useMcMutation } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import UpdateCustomerDetailsMutation from './update-customer-details.ctp.graphql';

export const useCustomerDetailsUpdater = () => {
  const [updateCustomerDetails, { loading }] = useMcMutation(
    UpdateCustomerDetailsMutation
  );

  const execute = async ({ id, version, actions }) => {
    try {
      return await updateCustomerDetails({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          id,
          version,
          actions,
        },
      });
    } catch (graphQlResponse) {
      throw graphQlResponse;
    }
  };

  return {
    loading,
    execute,
  };
};
