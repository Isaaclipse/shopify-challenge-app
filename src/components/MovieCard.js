import React from 'react'
import '../App.css'


function MovieCard({ item, index, isButtonDisabled, addtoNominations, removeFromNomination}) {
    return (
        <li className="Card">
            <p className="header-sub">{item.Title}({item.Year})</p>
            {/* <img className="img" src={item.Poster}></img> */}
            {
                addtoNominations ?             
                <button disabled={isButtonDisabled(item)} onClick={()=> addtoNominations(item)}>Add to nominate</button>
                : 
                <button onClick={()=> removeFromNomination(index)}>Remove</button>
            }
        </li>
    )
}

export default MovieCard