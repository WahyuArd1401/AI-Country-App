import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { GET_CONTINENTS_AND_COUNTRIES } from '../utils/getData';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function ContinentDropdown({ selectedContinent, setSelectedContinent }) {
  const { loading, error, data } = useQuery(GET_CONTINENTS_AND_COUNTRIES);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const continents = data.continents;

  return (
    <FormControl fullWidth>
      <InputLabel>🌍 Select a Continent</InputLabel>
      <Select
        value={selectedContinent}
        onChange={(e) => setSelectedContinent(e.target.value)}
      >
        <MenuItem value="">🌍 All Countries</MenuItem>
        {continents.map((continent) => (
          <MenuItem key={continent.code} value={continent.code}>
            {continent.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

ContinentDropdown.propTypes = {
  selectedContinent: PropTypes.string.isRequired,
  setSelectedContinent: PropTypes.func.isRequired,
};

export default ContinentDropdown