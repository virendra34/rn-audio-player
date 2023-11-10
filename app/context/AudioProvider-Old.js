import React, { useEffect, createContext, useState } from 'react'
import * as MediaLibrary from 'expo-media-library'
import { StyleSheet, Alert, View, Text } from 'react-native'
import { DataProvider } from 'recyclerlistview';

export const AudioContext = createContext();
const AudioProvider = ({ children }) => {

    const [audioFilesData, setAudioFilesData] = useState({
        audioFiles: [],
        permissionError: false,
        dataProvider: new DataProvider((r1, r2) => r1 !== r2),
        playbackObj: null,
        soundObj: null,
        currentItem: {},
    });

    const getAudioFiles = async () => {
        try {
            const { dataProvider, audioFiles } = audioFilesData;
            let media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });
            // media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', first: media.totalCount });
            // media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', first: 20, sortBy:['modificationTime'] });
            media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', first: 20 });
            console.log('Total audio files:', media.assets.length);

            setAudioFilesData((prevState) => {
                return {
                    ...prevState,
                    audioFiles: [...media.assets],
                    dataProvider: dataProvider.cloneWithRows([...media.assets])
                }
            });
            // setAudioFilesData((prevState) => { return { ...prevState, audioFiles: [...media.assets] } });
        } catch (err) {
            console.log(err.message);
        }
    }

    const permissionAlert = async () => {
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


    const getPermissions = async () => {
        // {
        //     "canAskAgain": true,
        //     "expires": "never",
        //     "granted": false,
        //     "status": "undetermined"
        // }
        const permisson = await MediaLibrary.getPermissionsAsync();
        if (permisson.granted) {
            // read all media files
            getAudioFiles();
        }

        if (!permisson.granted && !permisson.canAskAgain) {
            setAudioFilesData((prevState) => {
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
                setAudioFilesData((prevState) => {
                    return {
                        ...prevState,
                        permissionError: true
                    }
                })
            }

            if (status === 'granted') {
                // read all media files
                getAudioFiles();
            }

        }

        // console.log(permisson);
    }

    useEffect(() => {
        getPermissions()
    }, []);

    const updateState = (prevState = {}, newState = {}) => {
        setAudioFilesData({ ...prevState, ...newState });
    }
    // const updateState = (prevState = {}, newState = {}) => {
    //     setAudioFilesData({ ...prevState, "_currentValue": { ...prevState._currentValue, ...newState } });
    // }

    const { audioFiles, dataProvider, permissionError, playbackObj, soundObj, currentItem } = audioFilesData;
    return permissionError ?
        <View style={styles.container}>
            <Text style={styles.alert}>This app won't work without storage permission!</Text>
        </View> :
        <AudioContext.Provider value={{ audioFiles, dataProvider, playbackObj, soundObj, currentItem, updateState: updateState }}>
            {children}
        </AudioContext.Provider>

}

export default AudioProvider

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