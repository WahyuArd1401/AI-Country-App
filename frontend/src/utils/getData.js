import { gql } from "@apollo/client";

const GET_CONTINENTS_AND_COUNTRIES = gql`
  query {
    continents {
      code
      name
      countries {
        code
        name
        emoji
        currency
        languages {
          code
          name
        }
      }
    }
  }
`;

const GET_COUNTRY_DETAILS = gql`
  query GetCountryDetails($code: ID!) {
    country(code: $code) {
      code
      name
      emoji
      capital
      currency
      languages {
        name
      }
      continent {
        name
      }
    }
  }
`;

export { GET_CONTINENTS_AND_COUNTRIES, GET_COUNTRY_DETAILS };