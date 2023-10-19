import { StyleSheet, Text, ScrollView, Dimensions } from 'react-native'
import React from 'react'
import { AudioContext } from '../context/AudioProvider'
import { LayoutProvider, RecyclerListView } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from './OptionModal';

const AudioList = () => {
    // const contextType = AudioContext;
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

    const rowRenderer = (type, item) => <AudioListItem
        title={item.filename}
        duration={item.duration}
        onOptionPress={() => console.log(item, type)}>

    </AudioListItem>

    return <AudioContext.Consumer>
        {({ dataProvider }) => {
            return <>
                <RecyclerListView
                    dataProvider={dataProvider}
                    layoutProvider={layoutProvider}
                    rowRenderer={rowRenderer}>
                </RecyclerListView>
                <OptionModal visible={false}/>
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