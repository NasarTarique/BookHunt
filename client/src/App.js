import Store  from './Store';
import Search from './Search';
import Bookdetail from './Bookdetail'
import Login from './Login';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


function App() {
  return (
		  <BrowserRouter>
		  <Store>
				  <Routes>
						  <Route index element={<Login />}/>
						  <Route path="/search" element={<Search />}/>
						  <Route path="/detail/:id" element={<Bookdetail />}/>
				  </Routes>
		  </Store>
		  </BrowserRouter>
  )
}

export default App;
