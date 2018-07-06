import {connect} from 'react-redux';
import MainScreen from './main'
import {bindActionCreators} from 'redux';
import {actionCreators as myActions} from '../../reducer';

function mapStateToProps(state){
    const {news, index} = state;
    return {news, index};
}

function mapDispatchToProps(dispatch){
    return{
        updateNewsString : bindActionCreators(myActions.updateNewsString, dispatch),
        indexChange : bindActionCreators(myActions.indexChange, dispatch),
        loadAddress : bindActionCreators(myActions.ldAddress,dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(MainScreen);