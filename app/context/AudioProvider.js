import React, { useEffect, createContext, useState, Component } from 'react'
import * as MediaLibrary from 'expo-media-library'
import { StyleSheet, Alert, View, Text } from 'react-native'
import { DataProvider } from 'recyclerlistview';

export const AudioContext = createContext();
export default class AudioProvider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            audioFiles: [],
            permissionError: false,
            dataProvider: new DataProvider((r1, r2) => r1 !== r2),
            playbackObj: null,
            soundObj: null,
            currentAudio: {},
            isPlaying: false,
            currentAudioIndex: null,
            playbackPosition: null,
            playbackDuration: null,
        }
        this.totalAudioCount = 0;
    }

    getAudioFiles = async () => {
        try {
            const { dataProvider, audioFiles } = this.state;
            // console.log({data:this.state});
            let media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });
            // media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', first: media.totalCount });
            // media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', first: 20, sortBy:['modificationTime'] });
            media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', first: 20 });
            // this.totalAudioCount = media.totalCount;
            this.totalAudioCount = parseInt(media.assets.length | 0);

            console.log('Total audio files:', media.assets.length);

            this.setState((prevState) => {
                return {
                    ...prevState,
                    audioFiles: [...media.assets],
                    dataProvider: dataProvider.cloneWithRows([...media.assets])
                }
            });
            // this.setState((prevState) => { return { ...prevState, audioFiles: [...media.assets] } });
        } catch (err) {
            console.log(err.message);
        }
    }

    permissionAlert = async () => {
        Alert.alert("Permission Required", "Need storage permission to read audio files!", [
            {
                text: 'Allow Access',
                onPress: () => getPermissions()
            },
            {
                text: 'Cancel',
                // onPress: () => permissionAlert()
            }
        ]);
    }


    getPermissions = async () => {
        // {
        //     "canAskAgain": true,
        //     "expires": "never",
        //     "granted": false,
        //     "status": "undetermined"
        // }
        const permisson = await MediaLibrary.getPermissionsAsync();
        if (permisson.granted) {
            // read all media files
            this.getAudioFiles();
        }

        if (!permisson.granted && !permisson.canAskAgain) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    permissionError: true
                }
            })
        }

        if (!permisson.granted && permisson.canAskAgain) {
            const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();

            if (status === 'denied' && canAskAgain) {
                // show alert that app can't work without storage read permission
                permissionAlert();
            }

            if (status === 'denied' && !canAskAgain) {
                // show alert that app can't work without storage read permission
                permissionAlert();
                this.setState((prevState) => {
                    return {
                        ...prevState,
                        permissionError: true
                    }
                })
            }

            if (status === 'granted') {
                // read all media files
                this.getAudioFiles();
            }

        }

        // console.log(permisson);
    }

    // useEffect(() => {
    //     getPermissions()
    // }, []);
    componentDidMount() {
        this.getPermissions();
    }

    updateState = (prevState = {}, newState = {}) => {
        this.setState({ ...prevState, ...newState });
    }
    
    loadPreviousAudio = async () => {
        // TODO: load audio from AsyncStorage
        let previousAudio = await AsyncStorage.getItem('previousAudio');
        let currentAudio;
        let currentAudioIndex;

        if (previousAudio === null) {
            currentAudio = this.state.audioFiles[0];
            currentAudioIndex = 0;
        } else {
            previousAudio = JSON.parse(previousAudio);
            currentAudio = previousAudio.audio;
            currentAudioIndex = previousAudio.index;
        }
    }

    render() {
        const { audioFiles, dataProvider, permissionError, playbackObj, soundObj, currentAudio, isPlaying, currentAudioIndex, playbackPosition, playbackDuration} = this.state;

        return permissionError ?
            <View style={styles.container}>
                <Text style={styles.alert}>This app won't work without storage permission!</Text>
            </View> :
            <AudioContext.Provider value={{
                audioFiles,
                dataProvider,
                playbackObj,
                soundObj,
                currentAudio,
                isPlaying,
                currentAudioIndex,
                totalAudioCount: this.totalAudioCount,
                playbackPosition: playbackPosition,
                playbackDuration: playbackDuration,
                updateState: this.updateState,
            }}>
                {this.props.children}
            </AudioContext.Provider>
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alert: {
        color: '#f00',
        fontSize: 20,
        fontWeight: 'bold'
    }
})