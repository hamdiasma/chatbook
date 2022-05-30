import { themeType } from "../type/types";

const initialState = false



const themeReducers = (state=initialState,action)=>{
    const {type,payload} = action
    switch (type) {
        case themeType.THEME:
           return payload
        default:
        return state;
    }
}

export default themeReducers