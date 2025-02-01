import { SAMPLE_ACTION } from '../actions';

const initialState = {};

const sampleReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case SAMPLE_ACTION:
            return { ...state, data: action.payload };
        default:
            return state;
    }
};

export default sampleReducer;