import newsData from "./newsData";


//import

//actions

const UPDATE_NEWS_STRING = 'UPDATE_NEWS_STRING';
const INDEX_CHANGE = 'INDEX_CHANGE';
const LOAD_ADDRESS = 'LOAD_ADDRESS';

//action creators

function updateNewsString(changedNewsData, index) {
    return {
        type: UPDATE_NEWS_STRING,
        changedNewsData: changedNewsData,
        index: index,
    };
}

function indexChange(index) {
    return { type: INDEX_CHANGE, index: index };
}

function ldAddress(text){
    return {type:LOAD_ADDRESS, text:text};
}

//reducer

const initialState = {
    news: [new newsData("https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Comfort_Fit_-_03_-_Sorry.mp3",'not Loaded!'),],
    index: 0,
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_NEWS_STRING:
            return changeNewsString(state, action.changedNewsData, action.index);
        case INDEX_CHANGE:
            return changeIndex(state, action.index);
        case LOAD_ADDRESS:
            return loadAddress(state, action.text);
        default:
            return state;
    }
}

//reducer func
function changeNewsString(state, changedNewsData, index) {
    prevState = state;
    prevState.news[index] = changedNewsData;
    return {
        ...state,
        news: prevState.news,
    };
}

function changeIndex(state, index) {
    return {
        ...state,
        index: index,
    }
}

function loadAddress(state, news){
    if(state.news !== news && news !== undefined ){return {
        ...state,
        news:news,
    }}else{
        return state;
    }
}

//export action creators
const actionCreators = { updateNewsString, indexChange, ldAddress };
export { actionCreators };
export default reducer; 