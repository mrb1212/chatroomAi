const tokenConfig = (getState ?: any) => {

    var token = "";

    if (getState && getState().auth && getState().auth.token) { // Check if getState exists and token exists
      token = getState().auth.token; // Retrieve the token from the Redux state
  }
  
    const config = {
      headers: {
          "content-type": "application/json", // Set content type header
      },
  };

  if (token) { // Add x-auth-token header if token exists
      config.headers["x-auth-token"] = token;
  }

  
    return config; // Return the config object
  }; 

  export default tokenConfig
