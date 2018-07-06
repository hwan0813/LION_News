import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation, Platform, UIManager, StatusBar } from 'react-native';
import {Updates, DangerZone} from 'expo';
import MainScreen from './components/music';
import {ScrollView} from 'react-native-gesture-handler';
import TopBar from './components/topBar';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actionCreators as myActions} from './reducer';
import * as firebase from 'firebase';
import newsData from "./newsData";


//firebase intialization
const firebaseConfig = {
    apiKey: "AIzaSyCtX4VVoDQ-ny6kv8b9r0lmbDnZmDWmNxQ",
    authDomain: "news-app-f9fb0.firebaseapp.com",
    databaseURL: "https://news-app-f9fb0.firebaseio.com",
    projectId: "news-app-f9fb0",
    storageBucket: "news-app-f9fb0.appspot.com",
    messagingSenderId: "796681339799"
};
    

const { Lottie } = DangerZone;

class AppMain extends React.Component {
  state = {
    isSmall:true,
    isExpanded:false,
    animation:null,
  }

  constructor(){
    super();
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    firebase.initializeApp(firebaseConfig);
    console.log("setting database...");
    firebase.database().ref('/').on('value',(snapshot) => {
      if(snapshot.val().newsData!==undefined){
        console.log("calling database...");
        var loadedNewsData = new Array();
        nsData = snapshot.val().newsData;
        for (i=0;i<2;i++){
        loadedNewsData.push(new newsData(nsData[i].uri,nsData[i].title));}
        this.props.loadAddress(loadedNewsData);
        this.forceUpdate();
      }
    });
  }

  componentWillMount() {
    json = require('./assets/aispeech_mic.json');
    this.setState({
      animation:json
    });
  }

  componentDidMount(){
    if(Updates.checkForUpdateAsync().isAvailable){
      Expo.Updates.reload();
    }
    this.animation.play();
    
  }

  render() {
    const {isSmall, isExpanded} = this.state;
    const {news, index} = this.props;
    return (
      <View style={styles.container}>
        {(!isExpanded)?
        <View style={styles.list}>
          <View style={styles.topBar}></View>
          <View style={styles.mainView}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>오늘의 뉴스</Text>
            </View>
            <View style={styles.lottieContainer}>
              <Lottie
              ref = {animation =>{this.animation = animation;}}
              source={this.state.animation}
              style={styles.lottieAnim}
              />
            </View>
            <View style={styles.newsStringContainer}>
              <Text style={styles.newsString}></Text>
            </View>
          </View>
        </View>:null}
        <TouchableOpacity style={styles.musicContainer} onPress={this.expandMusicbar} activeOpacity={1.0}>
          <MainScreen isSmall={isSmall} isExpanded={isExpanded} shrinkFunc={this.shrinkMusicbar} appForceUpdate={this.appForceUpdate}/>
        </TouchableOpacity>
      </View>
    );
  }

  expandMusicbar = () => {
    if(this.state.isSmall){
      LayoutAnimation.configureNext(CustomLayoutEase);
      this.setState({isExpanded:true,isSmall:false});
    }
  }

  shrinkMusicbar = () => {
    if(!this.state.isSmall){
      LayoutAnimation.configureNext(CustomLayoutEase);
      this.setState({isExpanded:false,isSmall:true});
    }
  }

  _playAnimation = () => {
    if (!this.state.animation) {
      this._loadAnimationAsync();
    } else {
      this.animation.reset();
    }
  }

  appForceUpdate = () => {
    this.forceUpdate()
  }
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
  },
  list:{
    flex:11,
    ...Platform.select({
      android:{
        paddingTop:StatusBar.currentHeight,
      }
    })
  },
  topBar:{
    flex:1,
    backgroundColor:'red',
  },
  mainView:{
    flex:10,
  },
  titleContainer:{
    flex:2,
    backgroundColor:'yellow',
    justifyContent:'center',
    alignItems:'center',
  },
  titleText:{
    fontSize:50,
  },
  lottieContainer:{
    flex:7,
    backgroundColor:'lightblue',
  },
  lottieAnim:{
    flex:1,
  },
  newsStringContainer:{
    flex:1,
    backgroundColor:'lightblue',
    justifyContent:'center',
    alignItems:'center',
  },
  newsString:{
    fontSize:20,
  },
  musicContainer:{
    flex:1,
  },
});


var CustomLayoutEase = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};


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

export default connect(mapStateToProps,mapDispatchToProps)(AppMain);