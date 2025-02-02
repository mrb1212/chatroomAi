import * as actions from '../types/chatTypes';

export interface ChatStateType {
    messages: any;
    rooms: any;
    selectedRoom: any;

    listMessagesStatus: string;
    listMessagesLoading: string;
    listMessagesData: any;
    listMessagesError: any;

    updateMessageStatus: string;
    updateMessageLoading: string;
    updateMessageError: any;

    listChatRoomsStatus: string;
    listChatRoomsLoading: string;
    listChatRoomsData: any;
    listChatRoomsError: any;

    updateChatRoomStatus: string;
    updateChatRoomLoading: string;
    updateChatRoomError: any;
}

const initialState: ChatStateType = {
    messages: [],
    rooms: [],
    selectedRoom: null,

    listMessagesStatus: "nothing",
    listMessagesLoading: "nothing",
    listMessagesData: {
        list: []
    },
    listMessagesError: {},

    updateMessageStatus: "nothing",
    updateMessageLoading: "nothing",
    updateMessageError: {},

    listChatRoomsStatus: "nothing",
    listChatRoomsLoading: "nothing",
    listChatRoomsData: {
        list: []
    },
    listChatRoomsError: {},

    updateChatRoomStatus: "nothing",
    updateChatRoomLoading: "nothing",
    updateChatRoomError: {}
};

export default function(state: ChatStateType = initialState, action: any): ChatStateType {
    switch (action.type) {
        // List Messages
        case actions.LIST_MESSAGES_REQUEST:
            return {
                ...state,
                listMessagesStatus: "REQUEST",
                listMessagesLoading: "sending"
            };
        case actions.LIST_MESSAGES_SUCCESS:
            return {
                ...state,
                listMessagesStatus: "SUCCESS",
                listMessagesLoading: "sent",
                listMessagesData: action.payload.data,
                messages: action.payload.data
            };
        case actions.LIST_MESSAGES_FAILURE:
            return {
                ...state,
                listMessagesStatus: "FAILURE",
                listMessagesLoading: "failed",
                listMessagesError: action.payload
            };
        case actions.LIST_MESSAGES_FINISH:
            return {
                ...state,
                listMessagesStatus: "nothing",
                listMessagesLoading: "nothing"
            };
        case actions.LIST_MESSAGES_CLEAR:
            return {
                ...state,
                listMessagesStatus: "nothing",
                listMessagesLoading: "nothing",
                listMessagesError: {},
                listMessagesData: {
                    list: []
                }
            };

        // Update Message
        case actions.UPDATE_MESSAGE_REQUEST:
            return {
                ...state,
                updateMessageStatus: "REQUEST",
                updateMessageLoading: "sending"
            };
        case actions.UPDATE_MESSAGE_SUCCESS:
            return {
                ...state,
                updateMessageStatus: "SUCCESS",
                updateMessageLoading: "sent",
            };
        case actions.UPDATE_MESSAGE_FAILURE:
            return {
                ...state,
                updateMessageStatus: "FAILURE",
                updateMessageLoading: "failed",
                updateMessageError: action.payload
            };
        case actions.UPDATE_MESSAGE_FINISH:
            return {
                ...state,
                updateMessageStatus: "nothing",
                updateMessageLoading: "nothing"
            };
        case actions.UPDATE_MESSAGE_CLEAR:
            return {
                ...state,
                updateMessageStatus: "nothing",
                updateMessageLoading: "nothing",
                updateMessageError: {}
            };

        // List Chat Rooms
        case actions.LIST_CHATROOMS_REQUEST:
            return {
                ...state,
                listChatRoomsStatus: "REQUEST",
                listChatRoomsLoading: "sending"
            };
        case actions.LIST_CHATROOMS_SUCCESS:
            return {
                ...state,
                listChatRoomsStatus: "SUCCESS",
                listChatRoomsLoading: "sent",
                listChatRoomsData: action.payload.data,
                rooms: action.payload.data
            };
        case actions.LIST_CHATROOMS_FAILURE:
            return {
                ...state,
                listChatRoomsStatus: "FAILURE",
                listChatRoomsLoading: "failed",
                listChatRoomsError: action.payload
            };
        case actions.LIST_CHATROOMS_FINISH:
            return {
                ...state,
                listChatRoomsStatus: "nothing",
                listChatRoomsLoading: "nothing"
            };
        case actions.LIST_CHATROOMS_CLEAR:
            return {
                ...state,
                listChatRoomsStatus: "nothing",
                listChatRoomsLoading: "nothing",
                listChatRoomsError: {},
                listChatRoomsData: {
                    list: []
                }
            };


        // Update Chat Room
        case actions.UPDATE_CHATROOM_REQUEST:
            return {
                ...state,
                updateChatRoomStatus: "REQUEST",
                updateChatRoomLoading: "sending"
            };
        case actions.UPDATE_CHATROOM_SUCCESS:
            return {
                ...state,
                updateChatRoomStatus: "SUCCESS",
                updateChatRoomLoading: "sent",
            };
        case actions.UPDATE_CHATROOM_FAILURE:
            return {
                ...state,
                updateChatRoomStatus: "FAILURE",
                updateChatRoomLoading: "failed",
                updateChatRoomError: action.payload
            };
        case actions.UPDATE_CHATROOM_FINISH:
            return {
                ...state,
                updateChatRoomStatus: "nothing",
                updateChatRoomLoading: "nothing"
            };
        case actions.UPDATE_CHATROOM_CLEAR:
            return {
                ...state,
                updateChatRoomStatus: "nothing",
                updateChatRoomLoading: "nothing",
                updateChatRoomError: {}
            };

        // Select Chat Room
        case actions.SELECT_CHATROOM:
            return {
                ...state,
                selectedRoom: action.payload
            };

        default:
            return state;
    }
}
