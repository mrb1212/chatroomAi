import axios from "axios";
import * as actions from '../types/authTypes';
import tokenConfig from "@/src/utils/tokenConfig";
import {AUTHS_OPT, HRS_USERS, AUTHS_auth, AUTHS_SAuth_RAuth} from '@/src/config'


interface sendOtpTypes  {
    phoneNumber : string
}

export const sendOtp = async (data : sendOtpTypes) => async(dispatch, getState) => {
    const param = data
    
    dispatch({
        type : actions.SEND_OTP_REQUEST
    })

    await axios.post(`${AUTHS_OPT}/sendRegisterOtp`, param, tokenConfig())

    .then(async (res) => {
        dispatch({
            type : actions.SEND_OTP_SUCCESS
        })
    })

    .catch(async (err)=> {
        dispatch({
            type : actions.SEND_OTP_FAILURE,
            payload : err.response ? err.response.data : err,
        })
    })

    dispatch({
        type: actions.SEND_OTP_FINISH, 
    });
}

interface otpRegisterTypes  {
    phoneNumber : string,
    otpCode  : string
}

export const otpRegister = async (data : otpRegisterTypes) => async(dispatch, getState) => {
    const param = data
    
    await dispatch({
        type : actions.REGISTER_OTP_REQUEST
    })

    await axios.post(`${AUTHS_OPT}/checkRegisterOtp`, param, tokenConfig())
    .then(async (res) => {
        await dispatch({
            type : actions.REGISTER_OTP_SUCCESS,
            payload : res.data
        })
        dispatch(await loadUser())
    })
    .catch(async (err)=> {
        await dispatch({
            type : actions.REGISTER_OTP_FAILURE,
            payload : err.response ? err.response.data : err,
        })
    })

    dispatch({
        type: actions.REGISTER_OTP_FINISH, 
    });
}

export interface updateTypes  {
    mode ?: "INS" | "UPD" | "DEL",
    firstName : string,
    lastName : string
}

export const update = async (data) => async (dispatch, getState) => {
    const param = data
    const mode = data.mode
    const payload : Partial<updateTypes> = {...data}
    delete payload.mode
    
    dispatch({
        type : actions.UPDATE_AUTHUSER_REQUEST
    })
    
    await axios.post(`${HRS_USERS}/updateFirstStep`, param, tokenConfig(getState))
    .then( async(res) => {
        dispatch({
            type : actions.UPDATE_AUTHUSER_SUCCESS,
            payload : payload,
        })
        dispatch(await loadUser())
    }).catch((err)=> {
        dispatch({
            type: actions.UPDATE_AUTHUSER_FAILURE,
            payload : err.response ? err.response.data : err,
        });
    })
    dispatch({
        type: actions.UPDATE_AUTHUSER_FINISH, 
    });
}

export const updateAuthUser = async (data) => async (dispatch, getState) => {
    const param = data
    const mode = data.mode
    const payload  = {...data}
    delete payload.mode
    
    dispatch({
        type : actions.UPDATE_AUTHUSER_REQUEST
    })
    
    await axios.post(`${HRS_USERS}/update`, param, tokenConfig(getState))
    .then( async(res) => {
        dispatch({
            type : actions.UPDATE_AUTHUSER_SUCCESS,
            payload : res.data,
        })
    }).catch((err)=> {
        dispatch({
            type: actions.UPDATE_AUTHUSER_FAILURE,
            payload : err.response ? err.response.data : err,
        });
    })
    dispatch({
        type: actions.UPDATE_AUTHUSER_FINISH, 
    });
}

export const loadUser = async() => async(dispatch, getState) => {
    dispatch({ type: actions.INFO_AUTHUSER_REQUEST });

    await axios
    .post(`${AUTHS_auth}/infoAuthUser`,{},tokenConfig(getState))
    .then((res) =>{
        dispatch({
            type: actions.INFO_AUTHUSER_SUCCESS,
            payload: res.data,
        })
    })
    .catch((err) => {
        dispatch({
            type: actions.INFO_AUTHUSER_FAILURE,
            payload : err.response ? err.response.data : err,
        });
    });

    dispatch({
        type: actions.INFO_AUTHUSER_FINISH, 
    });
};

export const logout = async() => async(dispatch, getState) => {
    dispatch({
        type: actions.LOGOUT_USER_SUCCESS
    })
};

export const RemoteLogin = async(data) => async(dispatch, getState) => {
    dispatch({ type: actions.CHECK_RAUTH_REQUEST });

    await axios
    .post(`${AUTHS_SAuth_RAuth}/checkToken`,data, tokenConfig(getState))
    .then((res) =>{
        dispatch({
            type: actions.CHECK_RAUTH_SUCCESS,
            payload: res.data,
        })
    })
    .catch((err) => {
        dispatch({
            type: actions.CHECK_RAUTH_FAILURE,
            payload : err.response ? err.response.data : err,
        });
    });

    dispatch({
        type: actions.CHECK_RAUTH_FINISH, 
    });
};

export const checkToken = async(data) => async(dispatch, getState) => {
    var URLToken = data.token

    var stepOneStatus = "REQUEST"
    var stepOnePayload : any

    var stepTwoStatus = "REQUEST"

    dispatch({ type: actions.INFO_AUTHUSER_REQUEST });

    await axios
    .post(`${AUTHS_auth}/infoAuthUser`,{},tokenConfig(getState))
    .then((res) =>{
        stepOneStatus = "SUCCESS"
        stepOnePayload = res.data

        dispatch({
            type: actions.INFO_AUTHUSER_SUCCESS,
            payload: res.data,
        })
    })
    .catch((err) => {
        stepOneStatus = "FAILURE"
    });

    if(URLToken && stepOneStatus !== "SUCCESS"){
        dispatch({ type: actions.CHECK_RAUTH_REQUEST });

        await axios
        .post(`${AUTHS_SAuth_RAuth}/checkToken`,{token : URLToken}, tokenConfig(getState))
        .then((res) =>{
            stepTwoStatus = "SUCCESS"
            dispatch({
                type: actions.CHECK_RAUTH_SUCCESS,
                payload: res.data,
            })
        })
        .catch((err) => {
            stepTwoStatus = "FAILURE"
            dispatch({
                type: actions.CHECK_RAUTH_FAILURE,
                payload : err.response ? err.response.data : err,
            });
        });

        dispatch({
            type: actions.CHECK_RAUTH_FINISH, 
        });
    } 

    if(stepOneStatus === "FAILURE" && stepTwoStatus !== "SUCCESS"){
        dispatch({
            type: actions.INFO_AUTHUSER_FAILURE
        })
    }

    dispatch({
        type: actions.INFO_AUTHUSER_FINISH, 
    });
}
