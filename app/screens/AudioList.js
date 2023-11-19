import React, { Component } from 'react'
import { StyleSheet, Text, ScrollView, Dimensions, ToastAndroid } from 'react-native';
import AudioListItem from '../components/AudioListItem';
import { AudioContext } from '../context/AudioProvider';
import { LayoutProvider, RecyclerListView } from 'recyclerlistview';
import OptionModal from './OptionModal';
import { Audio } from 'expo-av';
import { pause, play, playNext, resume } from '../misc/audioController';

export default class AudioList extends Component {
    static contextType = AudioContext;
    constructor(props) {
        super(props)

        this.state = {
            optionModalVisible: false
        }
    }

    layoutProvider = new LayoutProvider((i) => 'audio', (type, dim) => {
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

    handlePlaybackStatusUpdate = async (playbackStatus) => {
        if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
            this.context.updateState(this.context, {
                playbackPosition: playbackStatus.positionMillis,
                playbackDuration: playbackStatus.durationMillis
            });
        }

        if (playbackStatus.didJustFinish) {
            const nextAudioIndex = this.context.currentAudioIndex + 1;
            // no next audio to play
            if (nextAudioIndex >= this.context.totalAudioCount) {
                await this.context.playbackObj.unloadAsync();
                return this.context.updateState(this.context, {
                    soundObj: null,
                    currentAudio: this.context.audioFiles[0],
                    isPlaying: false,
                    currentAudioIndex: 0,
                    playbackPosition: null,
                    playbackDuration: null,
                });
            }
            // else select next audio
            const nextAudio = this.context.audioFiles[nextAudioIndex];
            const soundObj = await playNext(this.context.playbackObj, nextAudio.uri);

            return this.context.updateState(this.context, {
                soundObj: soundObj,
                currentAudio: nextAudio,
                isPlaying: true,
                currentAudioIndex: nextAudioIndex
            });
        }

        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
            // The player has just finished playing and will stop. Maybe you want to play something else?
            const { updateState, isPlaying } = this.context;
            console.log("finished: ", playbackStatus);
            return updateState(this.context, {
                isPlaying: false
            });
        }

    }

    handleAudioPress = async (audio) => {
        try {
            const { audioFiles, playbackObj, soundObj, currentAudio, updateState, isPlaying } = this.context;

            // play for the first time
            if (soundObj === null) {
                console.log('playing audio: ', audio.filename);
                const playbackObj = new Audio.Sound();
                const soundObj = await play(playbackObj, audio.uri);
                const currentAudioIndex = audioFiles.indexOf(audio);
                console.log('playing: ', audio.filename);

                playbackObj.setOnPlaybackStatusUpdate(this.handlePlaybackStatusUpdate);

                return updateState(this.context, {
                    currentAudio: audio,
                    isPlaying: true,
                    playbackObj,
                    soundObj,
                    currentAudioIndex
                });
            }

            // pause if already playing
            if (soundObj?.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
                console.log('stopped: ', audio.filename);
                const soundObj = await pause(playbackObj);

                return updateState(this.context, {
                    soundObj: soundObj,
                    isPlaying: false
                });
            }

            // resume
            if (currentAudio?.id === audio.id && soundObj.isLoaded && !soundObj.isPlaying) {
                console.log('resuming: ', audio.filename);
                const soundObj = await resume(playbackObj);

                return updateState(this.context, {
                    soundObj: soundObj,
                    isPlaying: true,
                });
            }

            // select another
            if (soundObj.isLoaded && currentAudio.id !== audio.id) {
                const soundObj = await playNext(playbackObj, audio.uri);
                const currentAudioIndex = audioFiles.indexOf(audio);
                console.log('track changed: ', audio.filename);

                return updateState(this.context, {
                    soundObj: soundObj,
                    currentAudio: audio,
                    isPlaying: true,
                    currentAudioIndex
                });
            }
        } catch (error) {
            console.log(error.message);
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        }
    }

    rowRenderer = (type, item, index, extendedState) => {
        const { updateState } = this.context;

        return <AudioListItem
            title={item.filename}
            duration={item.duration}
            onAudioPress={() => this.handleAudioPress(item)}
            onOptionPress={() => {
                this.setState((prevState) => {
                    return { ...prevState, optionModalVisible: true }
                });
                updateState(this.context, {
                    currentAudio: item
                });
            }}
            // onOptionPress={() => this.setState((prevState) => {
            //     return {
            //         ...prevState,
            //         currentAudio: item,
            //         optionModalVisible: true
            //     }
            // })}
            isPlaying={extendedState.isPlaying}
            activeListItem={this.context.currentAudioIndex === index}
        >
        </AudioListItem>
    }

    onClose = () => this.setState((prevState) => {
        return {
            ...prevState,
            optionModalVisible: false,
        }
    })

    onPressPlayBtn = () => console.log('Playing audio')

    onPressAddToPlayListBtn = () => console.log('Added to the playlist')

    render() {
        return <AudioContext.Consumer>
            {({ dataProvider, isPlaying, currentAudio }) => {
                return <>
                    <RecyclerListView
                        dataProvider={dataProvider}
                        layoutProvider={this.layoutProvider}
                        rowRenderer={this.rowRenderer}
                        extendedState={{ isPlaying }}>
                    </RecyclerListView>
                    <OptionModal
                        visible={this.state.optionModalVisible}
                        currentAudio={currentAudio}
                        onClose={this.onClose}
                        optionsBtns={{ onPressPlayBtn: this.onPressPlayBtn, onPressAddToPlayListBtn: this.onPressAddToPlayListBtn }}
                    />
                </>
            }}
        </AudioContext.Consumer>
    }
}
