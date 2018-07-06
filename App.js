import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import {createStore} from 'redux';
import reducer from './reducer';
import {Provider} from 'react-redux';
import AppMain from './AppMain'


let store = createStore(reducer);

export default class App extends React.Component{
    render () {
    return (
    <Provider store={store}>
        <AppMain />
    </Provider>);}
}