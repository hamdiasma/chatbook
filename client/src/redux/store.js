import {createStore,applyMiddleware} from "redux"
import thunk from "redux-thunk"
import {composeWithDevTools} from "redux-devtools-extension"
import rootReducers from "./reducers/index"
import {Provider} from "react-redux"



const initailState ={}
const middleware = [thunk]


const store =  createStore(
    rootReducers,
    initailState,
    composeWithDevTools(applyMiddleware(...middleware))
)


const DataProvider =({children})=> {
return(
     <Provider store={store}>
     {children}
    </Provider>
    )
}


export default DataProvider