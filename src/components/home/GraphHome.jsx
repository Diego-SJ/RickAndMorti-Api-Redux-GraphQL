import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import Card from '../card/Card';

const GraphHome = () => {
  const [chars, setChars] = useState([]);

  const query = gql`
    {
      characters {
        results {
          id
          name
          image
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(query);

  useEffect(() => {
    if (data && !loading && !error) {
      setChars([...data.characters.results]);
    }
  }, [data, error, loading]);

  const nextChar = () => {
    chars.shift();
    setChars([...chars]);
  }

  if (loading) return <h2>Cargando...</h2>;

  return <Card leftClick={nextChar} {...chars[0]} />;
};

export default GraphHome;
