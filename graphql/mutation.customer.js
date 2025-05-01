export const createCustomer =`#graphql
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      userErrors {
        field
        message
      }
      customer {
        id
      }
    }
  }`

export const updateCustomer=`#graphql
  mutation updateCustomerMetafields($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
      }
      userErrors {
        message
        field
      }
    }
  }`

export const customerSendAccountInviteEmail=`#graphql
  mutation CustomerSendAccountInviteEmail($customerId: ID!) {
    customerSendAccountInviteEmail(customerId: $customerId) {
      customer {
        id
      }
      userErrors {
        field
        message
      }
    }
  }`