import * as React from 'react';
import {
    SafeAreaView,
    ScrollView,
    Animated,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    View,
    FlatList
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { InsightHeaderViewModel, InsightViewModel } from './InsightViewModel';
import { InsightHeader } from './InsightHeader'
import { useRef, useEffect } from 'react';
import { Episode, PodCast } from '../home/Model';
import { useAppContextStore } from '../../context/AppContext';
import Icon from "react-native-dynamic-vector-icons";
import * as FileSystem from "expo-file-system";
import { useDownloadService } from '../../services/download/DownloadService';

import { decode } from 'html-entities';
// import StretchableHeader from 'react-native-stretchable-header';

const headerHeight = 150 * 2;
const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;


const InsightScreen = ({ route, navigation }) => {
    const { showPlayer, setShowPlayer, setPlayTrackNo } = useAppContextStore()
    const { podcast } = useAppContextStore()
    const headerInfo: InsightHeaderViewModel = { title: podcast?.title, showNotes: podcast?.description, artwork: podcast?.artwork }
 
    const getButton = (_item: Episode, index: number) => {
        // if (_item.isDownloading) {
        //     return <ActivityIndicator size="small" color="#FFFFFF" />;
        // } else 
        if (_item.isDownloaded) {
            return (
                <TouchableOpacity>
                    <Icon name="cloud-done-outline" size={24} color="white" type={'Ionicons'} />
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity>
                    <Icon name="cloud-outline" size={24} color="white" type={'Ionicons'} />
                </TouchableOpacity>
            );
        }
    };
    const onPressItem = (index: number) => {
        if (!showPlayer) {
            setShowPlayer(true);
        }
        setPlayTrackNo(index)
    }

    const renderEpisode = (episode: Episode, index: number) => {
        return (
            <View style={styles.listItem}>
                <TouchableOpacity
                    onPress={() => {
                        return onPressItem(index);
                    }}>
                    <Text style={styles.listItemText}>{episode.title}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "90%" }}>
                        <Text style={styles.listItemDuration}>{episode.duration}</Text>
                    </View>
                    <View style={{ width: "10%" }}>{getButton(episode, index)}</View>
                </View>
            </View>
        )
    }

    const renderHeader = () => {
        return(
            <View>
                <Text style={styles.text}>{podcast?.title}</Text>
                <Text style={styles.text}>{decode(podcast.description)}</Text>
            </View>
        )
    }

    const renderContentView = () => {
        return (
            <View>
                <FlatList
                //scrollEventThrottle={16}
                // contentContainerStyle={{ paddingTop: headerHeight+navbarHeight}}
                // onScroll={handleScroll}
                //ref={ref}
                // onMomentumScrollEnd={handleSnap}
                data={podcast?.episodes}
                renderItem={(item) => {
                    return renderEpisode(item.item, item.index) }
                }
                keyExtractor={(item, id) => id.toString()}
            >     
            </FlatList>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* <StretchableHeader
                headerImageHeight={250}
                headerImageSource={{ uri: podcast?.artwork }}
                contentView={renderContentView}
            /> */}
        </SafeAreaView>
        
        // <SafeAreaView style={styles.container}>
        //     <StatusBar />
            

           
        //     {/* <InsightHeader model={headerInfo} height={headerHeight} />
        //     <FlatList
        //         //scrollEventThrottle={16}
        //         // contentContainerStyle={{ paddingTop: headerHeight+navbarHeight}}
        //         // onScroll={handleScroll}
        //         //ref={ref}
        //         // onMomentumScrollEnd={handleSnap}
        //         data={podcast?.episodes}
        //         renderItem={(item) => {
        //             return renderEpisode(item.item, item.index) }
        //         }
        //         keyExtractor={(item, id) => id.toString()}
        //     > */}
               
        //     </FlatList>
        // </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        backgroundColor: '#1c1c1c',
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1,
    },
    container: {
        backgroundColor: "#000",
        flex: 1,
    },
    text: {
        marginLeft: 15,
        marginRight: 15,
        fontSize: 15,
        lineHeight: 24,
        color: "#fff",
    },
    list: {
        margin: 15,
        marginTop: 150,
        zIndex: -1
    },
    listItem: {
        padding: 15,
        borderTopWidth: 0.5,
        fontWeight: "normal",
        borderTopColor: "#ccc",
    },
    listItemText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    listItemDuration: {
        color: "#ccc",
        fontSize: 14,
        marginTop: 8,
    },
});

export { InsightScreen }