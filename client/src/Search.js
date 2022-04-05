import { Context } from "./Store";
import Nav from "./Nav";
import "./styles/Search.css";
import { Navigate,Link } from "react-router-dom";
import { Fragment, useEffect, useState, useContext } from "react";

const Search = () => {
  const [state, setState] = useContext(Context);
  const [searchquery, getSearchQuery] = useState("");
  const [booklist, getBooklist] = useState({});
  useEffect(() => {
  }, [booklist]);
  if (state.name === "") {
    return <Navigate to="/" replace />;
  }
  const handlesubmit = async () => {
    const res = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({
		token:state.authtoken,
        query: searchquery,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
		  if(res.status==401){
				  setState({
						  authtoken:"",
						  name:"",
						  email:"",
						  image:""
				  })

		  }
    const data = await res.json();
    getBooklist(data);
    getSearchQuery("");
  };
  const bookcardsShow = () => {
    if (JSON.stringify({}) !== JSON.stringify(booklist)) {
      return booklist.items.map((elem) => {
        return (
          <div className="bookcard" key={elem.id}>
            <div className="img-container">
              <img
					  src={elem.volumeInfo.imageLinks?elem.volumeInfo.imageLinks.thumbnail:"https://books.google.co.in/googlebooks/images/no_cover_thumb.gif"}
                alt=""
              />
            </div>
            <div className="bookcard-detail">
              <div className="bookcard-title">{elem.volumeInfo.title}</div>
              <div className="bookcard-author">
                By:{" "}
                <span className="bookcard-author-span">{elem.volumeInfo.authors[0]}</span>
              </div>
              <div className="bookcard-rating">
                Average Rating: <span className="bookcard-rating-span">{elem.volumeInfo.averageRating}</span>
                <span className="bookcard-rating-spantwo">/5</span>
              </div>
					<Link to={"/detail/"+elem.id} className="bookcard-button">More</Link>
            </div>
          </div>
        );
      });
    }
  };

  return (
    <Fragment>
      <Nav />

      <div className="search-container">
        <h1>Search Books</h1>
        <div className="search-input-container">
          <input
            className="search-input"
            type="text"
            name="query"
            value={searchquery}
            onChange={(e) => {
              getSearchQuery(e.target.value);
            }}
          />
          <span className="search-button" onClick={handlesubmit}>
            Search
          </span>

        </div>
        <div className="booklist-container">
				{bookcardsShow()}
        </div>
      </div>
    </Fragment>
  );
};
export default Search;
