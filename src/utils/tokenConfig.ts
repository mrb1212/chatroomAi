const tokenConfig = (getState ?: any) => {

    var token = "";

    if(getState && getState().auth && getState().auth.token ){
      token = getState().auth.token;
    }
  
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
  
    if (token) {
      config.headers["x-auth-token"] = token;
    }
  
    return config;
  }; 

  export default tokenConfig