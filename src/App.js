import axios from 'axios'
import {
    useState,
    useCallback,
    useEffect
} from 'react'
import _ from "lodash";
import ls from 'local-storage';

// Styles
import './App.css';

// Components
import MovieCard from './components/MovieCard';

function App() {

    // States
    const [searchQuery, setSearchQuery] = useState('')
    const [resultData, setResultData] = useState([])
    const [nominations, setNominations] = useState([])

    //   
    const sendQuery = async query => {
        let data = await axios.get(`http://www.omdbapi.com/?s=${query}&apikey=263d22d8`)
        setResultData(data.data.Search)
    };

    const delayedQuery = useCallback(_.debounce(q => sendQuery(q), 500), []);

    // Handles
    const handleSearchQuery = (e) => {
        setSearchQuery(e.target.value)
        delayedQuery(e.target.value)
    }

    const addtoNominations = (item) => {
        if (!nominations || nominations.length === 0) {
          setNominations([item])

          // adding to localStorage
          ls.set('nominations', [item]);
        } else {
          let newNominations = [...nominations, item]
          setNominations([...nominations, item])

          // adding to localStorage
          ls.set('nominations', newNominations);
        }
    }

    const removeFromNomination = (index) => {
        let array = [...nominations]

        if (index !== -1) {
            array.splice(index, 1);
            setNominations(array);
        }
    }

    // Logic Handles
    const isButtonDisabled = (item) => {
        return nominations && (nominations.includes(item) || nominations.length >= 5)
    }

    useEffect(() => {
        let myNominations = ls.get('nominations');
        setNominations(myNominations)
    }, [])
  
  return (
    <div className="app-body">
      <div className="sub-body">
      <h1 className="header-main" >The Shoppies</h1>
      
      {/* TODO: MAKE COMPONENT */}
      <div className="input-body">
        <input 
          className="input-field"
          label="Search for movies..."
          value={searchQuery}
          placeholder="🔎  Search for movies..."
          onChange={handleSearchQuery}
        />
      </div>

      {
        searchQuery ?
        <div className="header-sub-body">
          <h1 className="header-sub">Results for "{searchQuery}"</h1>
        </div> 
      :
      null
      }

      <div className="body-components">
      <ul className="ul-right">
        {
          resultData ? 
          resultData.map((item, index) => {
            return (
              <li>
                <MovieCard 
                  key={index}
                  index={index}
                  item={item}  
                  isButtonDisabled={isButtonDisabled}
                  addtoNominations={addtoNominations}
                />
              </li>
            )
          }) 
          :
          <div>
            No Data to show
          </div> 
        }
      </ul>

      <hr></hr>

      <ul className="ul-left">
        {
          !nominations ? 
          <div>
            No Data to show
          </div> :
          nominations.map((item, index) => {
            return (
              <li>
                <MovieCard 
                  key={index}
                  index={index}
                  item={item}  
                  isButtonDisabled={isButtonDisabled}
                  removeFromNomination={removeFromNomination}
                />
              </li>
            )
          })
        }
        {
          (nominations!==null && nominations.length > 4) ?         
            <div>
              <h1>Cant add anymore stuff....</h1>
              <h1>Nomination limit is 5 per user</h1>
            </div> 
        : null
        }
      </ul>
      </div>
      
      </div>

    </div>
  );
}

export default App;