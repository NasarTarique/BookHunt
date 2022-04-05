import Nav from './Nav';
import './styles/Bookdetail.css'
import { Fragment, useEffect, useState, useContext } from "react";
import { Navigate,useParams } from "react-router-dom";
import { Context } from "./Store";

const Bookdetail = ()=>{
		const {id} = useParams()
		const [state, setState] = useContext(Context);
		const [bookdata, setBookdata] = useState({})
		useEffect(()=>{
				fetch("/api/detail/"+id,{
						headers:{
								Authorization:`Bearer ${state.authtoken}`
						}
				})
						.then(response=>{
								if(response.status===401){
										console.log("Not Authenticated")
										setState({
												authtoken:"",
												email:"",
												name:""
										})
										return {}

								}
								return response.json()

						})				.then(data=>{
								setBookdata(data)
								console.log(data)
						})
				
		},[])
  if (state.name === "") {
    return <Navigate to="/" replace />;
  }
		const getAuthors = (list)=>{
				let authors = "";
				for(let i=0;i<list.length;i++){
						authors = list[i]+"  "
				}

				return authors;


		}

		const showCategories = (vol)=>{
				if(vol.categories){
						let categories = "";
						vol.categories.map(elem=>{
								categories+= elem + " , "
						})
						return(
										<div className="categories">Categories : <span className="categoriesspan">{categories}</span></div>

						) 

				}

		}

		const showBook = ()=>{
				if(JSON.stringify({})!=JSON.stringify(bookdata)){
						const vol=bookdata.item.volumeInfo;
						return (
						<div className="bookdetail-container">
								<div className="bookdetail-imgcontainer">
										<img src={vol.imageLinks?vol.imageLinks.thumbnail:""} alt="" />
								</div>
								<div className="bookdetail">
										<div className="booktitle">{vol.title}</div>
										<div className="authors">By : <span className="authorsspan">{getAuthors(vol.authors)}</span></div>
										<div className="rating">Average Rating : <span className="ratingspan">{vol.averageRating}</span><span className="ratingspantwo">/5</span></div>
										<div className="ratedby">Rated By :<span className="ratedbyspan">{vol.ratingsCount}</span></div>
										<div className="pages">Pages : <span className="pagespan">{vol.pageCount}</span></div>
										<div className="publisher">Publisher : <span className="publisherspan">{vol.publisher}</span></div>
										{showCategories(vol)}
										<div className="language">Language : <span className="languagespan">{vol.language}</span></div>
										<div className="description">Description:<br></br><span className="descriptionspan" dangerouslySetInnerHTML={{ __html: vol.description }}></span></div>
								</div>
						</div>

						)

				}
		}

		return(
				<Fragment>
						<Nav />
						{showBook()}

				</Fragment>

		)

}

export default Bookdetail;
