import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import './App.css'

const GET_CATEGORIES = gql`
  query {
    categories
  }
`;

const GET_RANDOM_JOKE = gql`
  query RandomJoke($category: String!) {
    randomJoke(category: $category) {
      value
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { loading: jokeLoading, error: jokeError, data: jokeData } = useQuery(GET_RANDOM_JOKE, {
    variables: { category: selectedCategory },
    skip: !selectedCategory,
  });

  if (loading || jokeLoading) return <p className='loadingTxt'>Loading...</p>;
  if (error || jokeError) return <p>Error: {error ? error.message : jokeError.message}</p>;

  return (
    <div className='bigContainer'>
      <h1>Chuck Norris Jokes</h1>
      <div className='bigCategoryContainer'>
        <div className='categoryContainer'>
          <h2>Choose a category</h2>
          <div className='buttonList'>
            {data.categories.map((category) => (
              <button className='categoryButton' key={category} onClick={() => setSelectedCategory(category)}>
                {category}
              </button>
            ))}
          </div>
        </div>
        {selectedCategory && (
          <div className='categoryContainer'>
            <h2>{selectedCategory} Joke</h2>
            {jokeData?.randomJoke?.value ? <p>{jokeData.randomJoke.value}</p> : <p>No joke available for this category.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
