import axios from "axios";
import * as actions from './../types/chatTypes';
import { Chat_Endpoint } from '@/src/config';
import tokenConfig from "@/src/utils/tokenConfig";

// Messages Actions
export const ListMessages = async (data?: any) => async(dispatch, getState) => {
    const param = data;
    
    dispatch({
        type: actions.LIST_MESSAGES_REQUEST
    });

    await axios.post(`${Chat_Endpoint}/messages/list`, param, tokenConfig(getState))
        .then(async (res) => {
            dispatch({
                type: actions.LIST_MESSAGES_SUCCESS,
                payload: res.data
            });
        })
        .catch(async (err) => {
            dispatch({
                type: actions.LIST_MESSAGES_FAILURE,
                payload: err.response ? err.response.data : err,
            });
        });

    dispatch({
        type: actions.LIST_MESSAGES_FINISH,
    });
};

export const updateMessage = async (data) => async (dispatch, getState) => {
    const param = data;
    
    dispatch({
        type: actions.UPDATE_MESSAGE_REQUEST
    });
    
    await axios.post(`${Chat_Endpoint}/messages/update`, param, tokenConfig(getState))
        .then(async(res) => {
            dispatch({
                type: actions.UPDATE_MESSAGE_SUCCESS,
                payload: res.data
            });
            dispatch(await ListMessages());
        })
        .catch((err) => {
            dispatch({
                type: actions.UPDATE_MESSAGE_FAILURE,
                payload: err.response ? err.response.data : err,
            });
        });

    dispatch({
        type: actions.UPDATE_MESSAGE_FINISH,
    });
};

// Chat Rooms Actions
export const ListChatRooms = async (data?: any) => async(dispatch, getState) => {
    const param = data;
    
    dispatch({
        type: actions.LIST_CHATROOMS_REQUEST
    });

    await axios.post(`${Chat_Endpoint}/rooms/list`, param, tokenConfig(getState))
        .then(async (res) => {
            dispatch({
                type: actions.LIST_CHATROOMS_SUCCESS,
                payload: res.data
            });
        })
        .catch(async (err) => {
            dispatch({
                type: actions.LIST_CHATROOMS_FAILURE,
                payload: err.response ? err.response.data : err,
            });
        });

    dispatch({
        type: actions.LIST_CHATROOMS_FINISH,
    });
};

export const updateChatRoom = async (data) => async (dispatch, getState) => {
    const param = data;
    
    dispatch({
        type: actions.UPDATE_CHATROOM_REQUEST
    });
    
    await axios.post(`${Chat_Endpoint}/rooms/update`, param, tokenConfig(getState))
        .then(async(res) => {
            dispatch({
                type: actions.UPDATE_CHATROOM_SUCCESS,
                payload: res.data
            });
            dispatch(await ListChatRooms());
        })
        .catch((err) => {
            dispatch({
                type: actions.UPDATE_CHATROOM_FAILURE,
                payload: err.response ? err.response.data : err,
            });
        });

    dispatch({
        type: actions.UPDATE_CHATROOM_FINISH,
    });
};

// Selected Chat Room Action
export const selectChatRoom = (room) => ({
    type: actions.SELECT_CHATROOM,
    payload: room
});
