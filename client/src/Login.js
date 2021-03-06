import { GoogleLogin } from "react-google-login";
import './styles/Login.css'
import { useContext, useEffect } from "react";
import { Context } from "./Store";
import { Navigate } from "react-router-dom";

const clientID =
  "459246397163-l240nuqjgncqhardmec4qgc0ne8d1ece.apps.googleusercontent.com";

const Login = () => {
  const [state, setState] = useContext(Context);
				if(state.name!==""){
					return 	<Navigate to="search" replace/>
								
				}
  const onSuccess = async (googlelogin) => {
    const res = await fetch("/login", {
      method: "POST",
      body: JSON.stringify({
        token: googlelogin.tokenId,
        name: googlelogin.profileObj.name,
        email: googlelogin.profileObj.email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setState({
      authtoken: data.token.token,
      name: data.token.name,
      email: data.token.email,
    });
  };
  const onFailure = (res) => {
    console.log("login failed : ");
  };
  return (
    <div className="login-container">
			<h1 className="Login-title">Book<span className="spanone">H</span><span className="spantwo">u</span><span className="spanthree">n</span><span className="spanfour">t</span></h1>
      <GoogleLogin
        clientId={clientID}
        buttonText="Login"
		onFailure={onFailure}
	    onSuccess={onSuccess}
      />
    </div>
  );
};

export default Login;
