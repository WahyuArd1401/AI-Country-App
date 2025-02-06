import { gql } from "@apollo/client";

const GET_CONTINENTS_AND_COUNTRIES = gql`
  query {
    continents {
      code
      name
      countries {
        code
        name
        capital
        emoji
        currency
        native
        languages {
          code
          name
        }
      }
    }
  }
`;

export { GET_CONTINENTS_AND_COUNTRIES };