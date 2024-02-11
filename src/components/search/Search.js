import React from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { useState } from "react";
import axios from "axios";
import { API_KEY, GEO_API_URL } from "../../api";

const Search = ({ onSearchChange }) => {
  const [search, setSearch] = useState(null);

  const handleOnChange = (searchData) => {
    setSearch(searchData);
    onSearchChange(searchData);
  };

  const loadOptions = async (inputValue) => {
    try {
      const response = await axios.get(`${GEO_API_URL}/cities`, {
        params: {
          minPopulation: 1000000,
          namePrefix: inputValue,
        },
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      });

      return {
        options: response.data.data.map((city) => ({
          value: `${city.latitude} ${city.longitude}`,
          label: `${city.name}, ${city.countryCode}`,
        })),
      };
    } catch (error) {
      console.error("Error fetching city data:", error);
      return { options: [] }; // Return empty options array in case of an error
    }
  };

  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600}
      // {/* prevents user from sending multiple request if by mistake he presses the enter button more than once
      // in less than 6ms time duration */}
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
      // the loadoptions method gives suggestion according to whatever input we type i.e if
      // we searching for mumbai by the time we type mum it will automatically give city names starting with mum
    ></AsyncPaginate>
  );
};

export default Search;
