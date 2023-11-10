import React, { Component } from 'react'
import { StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import AudioListItem from '../components/AudioListItem';
import { AudioContext } from '../context/AudioProvider';
import { LayoutProvider, RecyclerListView } from 'recyclerlistview';
import OptionModal from './OptionModal';
import { Audio } from 'expo-av';
import { pause, play, resume } from '../misc/audioController';

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

    handleAudioPress = async (audio) => {
        const { audioFiles, dataProvider, playbackObj, soundObj, currentItem, updateState } = this.context;
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
            //         currentItem: audio,
            //     }
            // });
            return updateState(this.context, {
                playbackObj: playbackObj,
                soundObj: soundObj,
                currentItem: audio,
            });
        }
        // pause if already playing
        console.log('isPlaying:', soundObj?.isLoaded && soundObj.isPlaying);
        if (soundObj?.isLoaded && soundObj.isPlaying) {
            console.log('already played');
            const soundObj = await pause(playbackObj);
            // return setState((prevState) => {
            //     return {
            //         ...prevState,
            //         soundObj: soundObj
            //     }
            // });
            return updateState(this.context, {
                playbackObj: playbackObj,
                soundObj: soundObj,
                currentItem: audio,
            });
        }
        // resume
        if (currentItem?.id === audio.id && soundObj.isLoaded && !soundObj.isPlaying) {
            console.log('resuming: ', audio.filename);
            const soundObj = await resume(playbackObj);
            // return setState((prevState) => {
            //     return {
            //         ...prevState,
            //         soundObj: soundObj
            //     }
            // });
            return updateState(this.context, {
                playbackObj: playbackObj,
                soundObj: soundObj,
                currentItem: audio,
            });
        }
    }

    rowRenderer = (type, item) => <AudioListItem
        title={item.filename}
        duration={item.duration}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => this.setState((prevState) => {
            return {
                ...prevState,
                currentItem: item,
                optionModalVisible: true
            }
        })}>
    </AudioListItem>

    onClose = () => setState((prevState) => {
        return {
            ...prevState,
            optionModalVisible: false,
        }
    })

    onPressPlayBtn = () => console.log('Playing audio')

    onPressAddToPlayListBtn = () => console.log('Added to the playlist')

    render() {
        return <AudioContext.Consumer>
            {({ dataProvider }) => {
                return <>
                    <RecyclerListView
                        dataProvider={dataProvider}
                        layoutProvider={this.layoutProvider}
                        rowRenderer={this.rowRenderer}>
                    </RecyclerListView>
                    <OptionModal
                        visible={this.state.optionModalVisible}
                        currentItem={this.currentItem}
                        onClose={this.onClose}
                        optionsBtns={{ onPressPlayBtn: this.onPressPlayBtn, onPressAddToPlayListBtn: this.onPressAddToPlayListBtn }}
                    />
                </>
            }}
        </AudioContext.Consumer>
    }
}
