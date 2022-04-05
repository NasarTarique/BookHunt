import { GoogleLogout } from "react-google-login";
import {Context,initialState} from './Store';
import {useContext} from 'react';
const clientID =
  "459246397163-jtf744jqrab926pq1fiuek7c8fi8vjst.apps.googleusercontent.com";

function Logout() {
		const [state,setState] = useContext(Context);
		const logout = (elem) =>{
				setState(initialState);
		}
		const onfailure = (err) =>{
				console.log(err)
		}
  return (
    <div className="logout-container">
      <GoogleLogout
		clientId={clientID}
        buttonText="logout"
        onLogoutSuccess={logout}
      ></GoogleLogout>
    </div>
  );
}

export default Logout;
