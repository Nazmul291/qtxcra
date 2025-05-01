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
        email
        firstName
        lastName
      }
    }
  }`
