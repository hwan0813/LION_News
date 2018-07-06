import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient, Audio, Font } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import Slider from 'react-native-slider';
import newsData from '../../newsData';

const LOADING_STRING = '데이터 로딩중...';
const LOAD_INTERVAL = 30;



class MainScreen extends Component {

    constructor(props) {
        super(props);
        this.playbackInstance = null;
        this.isSeeking = false;
        this.shouldPlayAtEndOfSeek = false;
        this.state = {
            firstLoaded:false,
            isPlaying: false,
            fontLoaded: false,
            rate: 1.0,
            volume: 1.0,
            playbackInstanceName: LOADING_STRING,
            playbackInstanceDuration: null,
            playbackInstancePosition: null,
            isLoading: true,
            shouldPlay: false,
            isBuffering: false,
        };
    }

    componentDidMount() {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            shouldDuckAndroid: true,
        });
        (async () => {
            await Font.loadAsync({

            });
            this.setState({ fontLoaded: true });
        })();

        this.loadingAudio(false);
    }

    async loadingAudio(playing) {
        if (this.playbackInstance != null) {
            await this.playbackInstance.unloadAsync();
            this.playbackInstance.setOnPlaybackStatusUpdate(null);
            this.playbackInstance = null;
        }
        primaryNews = this.props.news[this.props.index];
        console.log(primaryNews);
        if(primaryNews.nString !== "not Loaded!"){
            this.firstLoaded = true;
        }
        const source = { uri:primaryNews.uri };
        const initialStatus = {
            shouldPlay: playing,
            rate: this.state.rate,
            volume: this.state.volume,
        };
        const { sound, status } = await Audio.Sound.create(source, initialStatus, this.OnPlaybackStatusUpdate);
        this.playbackInstance = sound;
        this.updateScreenForLoading(false);
    }

    updateScreenForLoading(isLoading) {
        if (isLoading) {
            this.setState({
                isPlaying: false,
                playbackInstanceName: LOADING_STRING,
                playbackInstanceDuration: null,
                playbackInstancePosition: null,
                isLoading: true,
            });
        } else if (!this.firstLoaded){
            this.loadingAudio(false);
        }
        else {
            now = new Date();
            this.setState({
                playbackInstanceName: `${now.getHours()}시 ${Math.floor((now.getMinutes())/LOAD_INTERVAL)*LOAD_INTERVAL}분 뉴스`,
                isLoading: false,
            });
        }
    }

    OnPlaybackStatusUpdate = status => {
        if (status.isLoaded) {
            this.setState({
                playbackInstancePosition: status.positionMillis,
                playbackInstanceDuration: status.durationMillis,
                shouldPlay: status.shouldPlay,
                isPlaying: status.isPlaying,
                isBuffering: status.isBuffering,
                rate: status.rate,
                volume: status.volume,
            });
            if(status.didJustFinish){
                this.advanceIndex(true);
                this.updatePlaybackInstanceForIndex(true);
                this.props.appForceUpdate();
            }
        } else {
            if (status.error) {
                console.log(`FATAL PLAYER ERROR: ${status.error}`);
            }
        }
    }

    advanceIndex(forward){
        this.props.indexChange((this.props.index+(forward?1:this.props.news.length-1))%this.props.news.length)
    }

    async updatePlaybackInstanceForIndex(playing){
        this.updateScreenForLoading(true);
        this.loadingAudio(playing);
    }

    onPlayPausePressed = () => {
        if (this.playbackInstance != null) {
            if (this.state.isPlaying) {
                this.playbackInstance.pauseAsync();
            } else {
                this.playbackInstance.playAsync();
            }
        }
    }

    onStopPressed = () => {
        if (this.playbackInstance != null) {
            this.playbackInstance.stopAsync();
        }
    }

    onForwardPressed = () => {
        if(this.playbackInstance != null){
            this.advanceIndex(true);
            this.updatePlaybackInstanceForIndex(this.state.shouldPlay);
            this.props.appForceUpdate();
        }
    }

    onBackPressed = () => {
        if(this.playbackInstance != null){
            this.advanceIndex(false);
            this.updatePlaybackInstanceForIndex(this.state.shouldPlay);
            this.props.appForceUpdate();
        }
    }

    onVolumeSliderChange = Value => {
        if (this.playbackInstance != null) {
            this.playbackInstance.setVolumeAsync(value);
        }
    }

    onSeekSliderChange = Value => {
        if (this.playbackInstance != null && !this.isSeeking) {
            this.isSeeking = true;
            this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
            this.playbackInstance.pauseAsync();
        }
    };

    onSeekSliderComplete = async Value => {
        if (this.playbackInstance != null) {
            this.isSeeking = false;
            const seekPosition = Value * this.state.playbackInstanceDuration;
            if (this.shouldPlayAtEndOfSeek) {
                this.playbackInstance.playFromPositionAsync(seekPosition);
            } else {
                this.playbackInstance.setPositionAsync(seekPosition);
            }
        }
    }

    getSeekSliderPostion() {
        if (this.playbackInstance != null &&
            this.state.playbackInstancePosition != null &&
            this.state.playbackInstanceDuration != null) {
            return (this.state.playbackInstancePosition / this.state.playbackInstanceDuration);
        } else {
            return 0;
        }
    }

    getMMSSFromMillis(millis) {
        const seconds = Math.floor((millis / 1000) % 60);
        const minutes = Math.floor((millis / 1000) / 60);

        const padZero = (num) => {
            return ('0' + num.toString()).slice(-2)
        }

        return `${padZero(minutes)}:${padZero(seconds)}`;
    }

    getTimeStamp() {
        if (this.playbackInstance != null &&
            this.state.playbackInstancePosition != null &&
            this.state.playbackInstanceDuration != null) {
            result = {position:this.getMMSSFromMillis(this.state.playbackInstancePosition),
                 end:this.getMMSSFromMillis(this.state.playbackInstanceDuration)};
        }else{
            result = {position:'00:00', end:'00:00'};
        }
        return result;
    }

    render() {
        const { isPlaying, fontLoaded, isLoading, playbackInstanceName } = this.state;
        const {isSmall, isExpanded, indexChange} = this.props;
        const {position, end} = this.getTimeStamp();
        return ((!fontLoaded) ? <View /> :
            <LinearGradient style={styles.container} 
            colors={(!isExpanded)?['#00000050','#00000050']:['#FCFFF5', '#D1DBBD', '#91AA9D', '#3E606F', '#193441']}>
                {isSmall?null:<View><TouchableOpacity onPressOut={this.props.shrinkFunc} style={{paddingTop:StatusBar.currentHeight}}>
                    <FontAwesome name={'chevron-left'} style={[styles.button,styles.shrinkButton]} size={10} color={'white'}/>
                    </TouchableOpacity></View>}
                {isSmall?null:
                <View style={[styles.titleContainer,(isSmall?null:{flex:2})]}>
                    <Text style={styles.titleText}>{playbackInstanceName}</Text>
                </View>}
                <View style={(isSmall?styles.titleWithButtonContainer:{flex:2})}>
                    {isSmall?<Text style={styles.smallTitleText}>{playbackInstanceName}</Text>:null}
                    <View style={[styles.buttonContainer,(isSmall?{paddingRight:10}:{flex:2})]}>
                        <TouchableOpacity style={styles.button} onPressOut={this.onBackPressed}>
                            <FontAwesome style={isSmall?null:styles.button}
                            name={'backward'} size={isSmall?15:80} color={'white'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPressOut={this.onPlayPausePressed}>
                            <FontAwesome style={isSmall?null:styles.button}
                            name={(!isPlaying) ? 'play' : 'pause'} size={isSmall?15:80} color={'white'} />
                        </TouchableOpacity>
                        {isPlaying ? <TouchableOpacity style={isSmall?null:styles.button} onPressOut={this.onStopPressed}>
                            <FontAwesome name={'stop'} size={isSmall?15:80} color={'white'} />
                        </TouchableOpacity> : null}
                        <TouchableOpacity style={styles.button} onPressOut={this.onForwardPressed}>
                            <FontAwesome style={isSmall?null:styles.button}
                            name={'forward'} size={isSmall?15:80} color={'white'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.TimeAndSliderContainer,{flex:(isSmall?1:0)}]}>
                    <Text style={isSmall?styles.smallTimeStamp:styles.TimeStamp}>{position}</Text>
                    <View style={styles.progressContainer}>
                        <Slider style={{ alignSelf: 'stretch'}} value={this.getSeekSliderPostion()}
                            onValueChange={this.onSeekSliderChange}
                            onSlidingComplete={this.onSeekSliderComplete}/>
                    </View>
                    <Text style={isSmall?styles.smallTimeStamp:styles.TimeStamp}>{end}</Text>
                </View>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText:{
        fontSize: 40,
        color: 'white'
    },
    smallTitleText:{
        paddingLeft:10,
        fontSize: 15,
        color:'white',
    },
    titleWithButtonContainer:{
        justifyContent:'space-between',
        alignItems: 'center',
        flexDirection:'row',
        flex:1,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    button: {
        padding: 20,
    },
    shrinkButton:{
        backgroundColor:'#00000050',
        alignSelf:'baseline',
    },
    progressContainer: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    TimeAndSliderContainer: {
        flex:1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    TimeStamp: {
        fontSize: 20,
        padding:10,
        color: 'white',
    },
    smallTimeStamp:{
        fontSize:10,
        padding:5,
        color:'white',
    }
});
export default MainScreen;