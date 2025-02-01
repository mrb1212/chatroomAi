import { combineReducers } from "redux";

import AuthReducers from "../reducers/authReducers";
import ChatReducers from "../reducers/chatReducers";




const reducer = combineReducers({
    auth : AuthReducers,
    chat : ChatReducers
});

export default reducer;
