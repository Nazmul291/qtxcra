export const customerList = `#graphql
  query CustomerList {
    customers(first: 50) {
      nodes {
        id
      }
    }
  }`

export const customerByEmail = `#graphql
  query CustomerByEmail($email: String!) {
    customers(first: 1, query: $email) {
      nodes {
        id
        metafield(namespace:"member", key:"isMember"){
          namespace
          key
          value
        }
      }
    }
  }`
