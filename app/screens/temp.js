import { StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import React, { useContext, useState } from 'react';
import { AudioContext } from '../context/AudioProvider';
import { LayoutProvider, RecyclerListView } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
// import Screen from '../components/Screen';
import OptionModal from './OptionModal';
import { Audio } from 'expo-av';
import { msToHMS } from '../utils/formatTime';
import { pause, play, resume } from '../misc/audioController';

const AudioList = () => {
    // const audioContext = useContext(AudioContext);
    const audioContext = AudioContext;
    const { dataProvider, soundObj, playbackObj, currentAudio, updateState } = useContext(AudioContext);
    // console.log({dataProvider, soundObj, playbackObj, currentAudio, updateState})
    const [state, setState] = useState({
        optionModalVisible: false,
    });
    // return <Text>{console.log('here', contextType)}</Text>
    // return <ScrollView>
    //     {
    //         contextType._currentValue.audioFiles.map(
    //             (file, itr) =>
    //                 <Text key={'audioList-' + itr} style={styles.listItem}>{(itr + 1) + ') ' + file.filename}</Text>
    //         )
    //     }
    // </ScrollView>

    const layoutProvider = new LayoutProvider((i) => 'audio', (type, dim) => {
        switch (type) {
            case 'audio':
                dim.width = Dimensions.get('window').width;
                dim.height = 70;
                break;
            default:
                dim.width = 0;
                dim.height = 0;
                break;
        }
    });

    const handleAudioPress = async (audio) => {
        // const { soundObj, playbackObj, currentAudio, updateState } = audioContext;
        // console.log(audioContext);
        // play for the first time
        if (soundObj === null) {
            console.log('playing audio: ', audio.filename);
            const playbackObj = new Audio.Sound();
            const soundObj = await play(playbackObj, audio.uri);
            console.log('soundObj: ', soundObj);
            // return setState((prevState) => {
            //     return {
            //         ...prevState,
            //         playbackObj: playbackObj,
            //         soundObj: soundObj,
            //         currentAudio: audio,
            //     }
            // });
            return updateState(audioContext, {
                playbackObj: playbackObj,
                soundObj: soundObj,
                currentAudio: audio,
            });
        }
        // pause if already playing
        if (soundObj?.isLoaded && soundObj.isPlaying) {
            console.log('already played');
            const soundObj = await pause(playbackObj);
            console.log('soundObj: ', soundObj);
            // return setState((prevState) => {
            //     return {
            //         ...prevState,
            //         soundObj: soundObj
            //     }
            // });
            return updateState(audioContext, {
                playbackObj: playbackObj,
                soundObj: soundObj,
                currentAudio: audio,
            });
        }
        // resume
        if (currentAudio?.id === audio.id && soundObj.isLoaded && !soundObj.isPlaying) {
            console.log('resuming: ', audio.filename, "playable duration: ", msToHMS(audio.playableDurationMillis), 'positionAt: ', msToHMS(audio.positionMillis));
            const soundObj = await resume(playbackObj);
            // return setState((prevState) => {
            //     return {
            //         ...prevState,
            //         soundObj: soundObj
            //     }
            // });
            return updateState(audioContext, {
                playbackObj: playbackObj,
                soundObj: soundObj,
                currentAudio: audio,
            });
        }
    }

    const rowRenderer = (type, item) => <AudioListItem
        title={item.filename}
        duration={item.duration}
        onAudioPress={() => handleAudioPress(item)}
        onOptionPress={() => setState((prevState) => {
            return {
                ...prevState,
                currentAudio: item,
                optionModalVisible: true
            }
        })}>

    </AudioListItem>

    const onClose = () => setState((prevState) => {
        return {
            ...prevState,
            optionModalVisible: false,
        }
    })

    const onPressPlayBtn = () => console.log('Playing audio')

    const onPressAddToPlayListBtn = () => console.log('Added to the playlist')

    // return <>
    //     <RecyclerListView
    //         dataProvider={dataProvider}
    //         layoutProvider={layoutProvider}
    //         rowRenderer={rowRenderer}>
    //     </RecyclerListView>
    //     <OptionModal
    //         visible={state.optionModalVisible}
    //         currentAudio={currentAudio}
    //         onClose={onClose}
    //         optionsBtns={{ onPressPlayBtn, onPressAddToPlayListBtn }}
    //     />
    // </>

    return <AudioContext.Consumer>
        {({ dataProvider }) => {
            return <>
                <RecyclerListView
                    dataProvider={dataProvider}
                    layoutProvider={layoutProvider}
                    rowRenderer={rowRenderer}>
                </RecyclerListView>
                <OptionModal
                    visible={state.optionModalVisible}
                    currentAudio={currentAudio}
                    onClose={onClose}
                    optionsBtns={{ onPressPlayBtn, onPressAddToPlayListBtn }}
                />
            </>
        }}
    </AudioContext.Consumer>

}

export default AudioList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listItem: { padding: 10, borderBottomColor: '#f00', borderBottomWidth: 2 }
})