
// import { logout } from "@/src/AUTH/stores/AuthActions";


// const authHandler = async(dispatch, err) => {


//     if(!dispatch) return;
//     if(!err) return;
//     if(!err.response) return;
//     if(!err.response.data) return;

//     let error = err.response.data

//     if(error?.status?.status !== "401") return;

//     if(error?.status?.msg !== "No token, authorization denied" &&  error.status.msg !== "Token is not valid") return;

//      dispatch(await logout())

//   }; 

//   export default authHandler