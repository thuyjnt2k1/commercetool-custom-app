import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { DOMAINS } from '@commercetools-frontend/constants';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';
import FlatButton from '@commercetools-uikit/flat-button';
import { AngleLeftIcon } from '@commercetools-uikit/icons';
import SelectField from '@commercetools-uikit/select-field';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { useCustomerDetailsFetcher } from '../../hooks/use-customer-details-fetcher';
import { useCustomerDetailsUpdater } from '../../hooks/use-customer-details-updater';
import messages from './messages';

const SALE_TYPE_OPTIONS = [
  { value: 'B2B', label: 'B2B' },
  { value: 'B2C', label: 'B2C' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Wholesale', label: 'Wholesale' },
];

const CustomerDetailsView = (props) => {
  const intl = useIntl();
  const history = useHistory();
  const showNotification = useShowNotification();
  const customerId = props.match.params.id;

  const { customer, error, loading } = useCustomerDetailsFetcher(customerId);
  const { execute: updateCustomerDetails, loading: isUpdating } = useCustomerDetailsUpdater();

  if (error) {
    return <Text.Body>Error loading customer details.</Text.Body>;
  }

  if (loading || !customer) {
    return <Text.Body>Loading...</Text.Body>;
  }

  // Find the custom field 'sale_type' if it exists
  const customFieldsRaw = customer.custom?.customFieldsRaw || [];
  const saleTypeField = customFieldsRaw.find((f) => f.name === 'sale_type');
  const initialSaleType = saleTypeField ? saleTypeField.value : '';

  const handleSubmit = async (values, formikHelpers) => {
    try {
      const actions = [
        {
          setCustomType: {
            type: {
              key: 'customer-custom-type',
              typeId: 'type',
            },
            fields: [
              {
                name: 'sale_type',
                value: `"${values.saleType}"`,
              },
            ],
          },
        },
      ];

      // Note: If type is already set, we could just use setCustomField. 
      // But setCustomType with fields is safer if it's the first time.
      const updateActions = [
        {
          setCustomField: {
            name: 'sale_type',
            value: `"${values.saleType}"`,
          }
        }
      ];

      // If the customer has no custom type set yet, we should use setCustomType.
      // We will just try setCustomType to be safe.
      const actionToUse = customer.custom ? updateActions : actions;

      await updateCustomerDetails({
        id: customer.id,
        version: customer.version,
        actions: actionToUse,
      });

      showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.updateSuccess),
      });
      formikHelpers.resetForm({ values });
    } catch (err) {
      showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.updateError),
      });
    }
  };

  return (
    <Spacings.Inset scale="m">
      <Spacings.Stack scale="l">
        <Spacings.Inline alignItems="center">
          <FlatButton
            icon={<AngleLeftIcon />}
            label={intl.formatMessage(messages.backToCustomers)}
            onClick={() => history.push(`/` + props.match.url.split('/')[1] + `/customers`)}
          />
        </Spacings.Inline>

        <Text.Headline as="h2" intlMessage={messages.title} />

        <Spacings.Stack scale="m">
          <Text.Body isBold>{customer.firstName} {customer.lastName}</Text.Body>
          <Text.Body>{customer.email}</Text.Body>
        </Spacings.Stack>

        <Formik
          initialValues={{ saleType: initialSaleType }}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {(formikProps) => (
            <Spacings.Stack scale="m">
              <SelectField
                title={intl.formatMessage(messages.saleTypeLabel)}
                name="saleType"
                options={SALE_TYPE_OPTIONS}
                value={formikProps.values.saleType}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                isDisabled={formikProps.isSubmitting || isUpdating}
                placeholder={intl.formatMessage(messages.saleTypePlaceholder)}
              />

              <Spacings.Inline>
                <PrimaryButton
                  label={intl.formatMessage(messages.save)}
                  onClick={formikProps.handleSubmit}
                  isDisabled={formikProps.isSubmitting || isUpdating || !formikProps.dirty}
                />
              </Spacings.Inline>
            </Spacings.Stack>
          )}
        </Formik>
      </Spacings.Stack>
    </Spacings.Inset>
  );
};

CustomerDetailsView.displayName = 'CustomerDetailsView';
CustomerDetailsView.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CustomerDetailsView;
