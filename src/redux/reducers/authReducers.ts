import * as actions from '../types/authTypes';

const isServer = typeof window === "undefined";

export interface initTypes {
    token ?: any
    isAuthenticated : boolean
    isLoading : any
    user : any
    error : any

    otpSendStatus : string
    otpSendLoading : string
    otpSendError : any

    otpRegisterStatus : string
    otpRegisterLoading : string
    otpRegisterError : any

    updateAuthUserStatus : string
    updateAuthUserLoading : string
    updateAuthUserError : any

    infoAuthUserStatus : string
    infoAuthUserLoading : string
    infoAuthUserError : any

    checkRAuthStatus : string
    checkRAuthLoading : string
    checkRAuthError : any
}

const initialstate : initTypes = {
    token: !isServer ? localStorage.getItem('chatroomToken') : "" ,
    isAuthenticated : false ,
    isLoading : true ,
    user : {},
    error : {},

    otpSendStatus : "nothing",
    otpSendLoading : "nothing",
    otpSendError : {},

    otpRegisterStatus : "nothing",
    otpRegisterLoading : "nothing",
    otpRegisterError : {},

    updateAuthUserStatus : "nothing",
    updateAuthUserLoading : "nothing",
    updateAuthUserError : {},

    infoAuthUserStatus : "nothing",
    infoAuthUserLoading : "nothing",
    infoAuthUserError : {},

    checkRAuthStatus : "nothing",
    checkRAuthLoading : "nothing",
    checkRAuthError : {}
};

export default function (state: initTypes = initialstate , action: any) : initTypes {
    switch (action.type) {
        // ...existing code...
        case actions.SEND_OTP_REQUEST:
            return {
                ...state,
                otpSendStatus : "REQUEST",
                otpSendLoading : "sending",
            }
        case actions.SEND_OTP_SUCCESS:
            return {
                ...state,
                otpSendStatus : "SUCCESS",
                otpSendLoading : "sent"
            }
        case actions.SEND_OTP_FAILURE:
            return {
                ...state,
                otpSendStatus : "FAILURE",
                otpSendLoading : "failed",
                otpSendError : action.payload
            }
        case actions.SEND_OTP_FINISH:
            return {
                ...state,
                otpSendStatus : "nothing",
                otpSendLoading : "nothing"
            }
        case actions.SEND_OTP_CLEAR:
            return {
                ...state,
                otpSendStatus : "nothing",
                otpSendLoading : "nothing",
                otpSendError : {}
            }
        // ...existing code...
        case actions.REGISTER_OTP_REQUEST:
            return {
                ...state,
                otpRegisterStatus : "REQUEST",
                otpRegisterLoading : "loading",
            }
        case actions.REGISTER_OTP_SUCCESS:
            localStorage.setItem('chatroomToken' ,action.payload.data.jwtToken)
            return {
                ...state,
                otpRegisterStatus : "SUCCESS",
                otpRegisterLoading : "done",
                token : action.payload.data.jwtToken,
                isAuthenticated : true ,
                user : action.payload.data.user
            }
        case actions.REGISTER_OTP_FAILURE:
            localStorage.removeItem('chatroomToken');
            return {
                ...state,
                otpRegisterStatus : "FAILURE",
                otpRegisterLoading : "failed",
                otpRegisterError : action.payload,
                isAuthenticated : false ,
                token : null ,
                user : null ,
            }
        case actions.REGISTER_OTP_FINISH:
            return {
                ...state,
                otpRegisterStatus : "nothing",
                otpRegisterLoading : "nothing"
            }
        case actions.REGISTER_OTP_CLEAR:
            return {
                ...state,
                otpRegisterStatus : "nothing",
                otpRegisterLoading : "nothing",
                otpRegisterError : {}
            }
        // ...existing code...
        case actions.UPDATE_AUTHUSER_REQUEST: 
            return {
                ...state,
                updateAuthUserStatus : "REQUEST",
                updateAuthUserLoading : "loading",
            }
        case actions.UPDATE_AUTHUSER_SUCCESS:
            return {
                ...state,
                updateAuthUserStatus : "SUCCESS",
                updateAuthUserLoading : "done",
                user : action.payload.data,
                isAuthenticated : true ,
                isLoading : false ,
                error : {}
            }
        case actions.UPDATE_AUTHUSER_FAILURE: 
            return {
                ...state,
                updateAuthUserStatus : "FAILURE",
                updateAuthUserLoading : "failed",
                updateAuthUserError :  action.payload,
            }
        case actions.UPDATE_AUTHUSER_FINISH: 
            return {
                ...state,
                updateAuthUserStatus : "nothing",
                updateAuthUserLoading : "nothing"
            }
        case actions.UPDATE_AUTHUSER_CLEAR: 
            return {
                ...state,
                updateAuthUserStatus : "nothing",
                updateAuthUserLoading : "nothing",
                updateAuthUserError : {}
            }
        // ...existing code...
        case actions.INFO_AUTHUSER_REQUEST:
            return {
                ...state ,
                isLoading : true,
                infoAuthUserStatus : "REQUEST",
                infoAuthUserLoading : "loading",
            };
        case actions.INFO_AUTHUSER_SUCCESS:
            return{
                ...state,
                isAuthenticated : true ,
                isLoading : false ,
                user : action.payload.data,
                infoAuthUserStatus : "SUCCESS",
                infoAuthUserLoading : "loaded",
            }
        case actions.INFO_AUTHUSER_FAILURE:
            localStorage.removeItem('chatroomToken');
            return{
                ...state,
                isAuthenticated : false ,
                isLoading : false ,
                user : null,
                token : null ,
                infoAuthUserStatus : "FAILURE",
                infoAuthUserLoading : "failed",
                infoAuthUserError :  action.payload,
            }
        case actions.INFO_AUTHUSER_FINISH:
            return{
                ...state,
                infoAuthUserStatus : "nothing",
                infoAuthUserLoading : "nohing",
            }
        case actions.LOGIN_USER_SUCCESS : 
        case actions.REGISTER_USER_SUCCESS : 
            localStorage.setItem('chatroomToken' ,action.payload.data.token)
            return {
                ...state ,
                ...action.payload.data,
                isAuthenticated : true ,
                isLoading : false,
                error : {}
            };
        case actions.LOGIN_USER_FAILURE :
        case actions.LOGOUT_USER_SUCCESS:
        case actions.REGISTER_USER_FAILURE:
            localStorage.removeItem('chatroomToken');
            return {
                ...state,
                token : null ,
                user : null ,
                isAuthenticated : false ,
                isLoading : false ,
                error : action.payload ? action.payload.data ? action.payload.data : {}  : {}
            }
        // ...existing code...
        case actions.CHECK_RAUTH_REQUEST : 
            return {
                ...state,
                isLoading : true,
                checkRAuthStatus : "REQUEST",
                checkRAuthLoading : "loading",
            }
        case actions.CHECK_RAUTH_SUCCESS : 
            localStorage.setItem('chatroomToken' ,action.payload.data.jwtToken)
            return {
                ...state,
                token : action.payload.data.jwtToken,
                isLoading : false,
                isAuthenticated : true ,
                user : action.payload.data.user,
                checkRAuthStatus : "SUCCESS",
                checkRAuthLoading : "done",
            }
        case actions.CHECK_RAUTH_FAILURE: 
            localStorage.removeItem('chatroomToken');
            return {
                ...state,
                isLoading : false,
                token : null ,
                user : null ,
                isAuthenticated : false ,
                checkRAuthStatus : "FAILURE",
                checkRAuthLoading : "done",
            }
        case actions.CHECK_RAUTH_FINISH : 
            return {
                ...state,
                checkRAuthStatus : "nothing",
                checkRAuthLoading : "nothing",
            }
        default :
            return state ;
    }
}
