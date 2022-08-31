import { useEffect, useState } from 'react';
import { getAllData, getData } from './utils/data';
import './App.css';
import Card from './components/Card/Card';
import Navbar from './components/Navbar/Navbar';

function App() {
  const baseURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState('');
  const [prevURL, setPrevURL] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      let res = await getAllData(baseURL);
      loadData(res.results);
      setNextURL(res.next);
      setPrevURL(res.previous);
      setLoading(false);
    };
    fetchData();
  }, []);

  const loadData = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getData(pokemon.url)
        return pokemonRecord;
      })
      );
    setPokemonData(_pokemonData);
  };

  const handlePrev = async () => {
    if (!prevURL) return;

    setLoading(true);
    let data = await getAllData(prevURL);
    await loadData(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  }

  const handleNext = async () => {
    setLoading(true);
    let data = await getAllData(nextURL);
    await loadData(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  }


  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ロード中</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={pokemon.name} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button onClick={handlePrev}>前へ</button>
              <button onClick={handleNext}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
