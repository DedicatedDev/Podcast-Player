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

import { useEffect } from 'react';
import { Episode } from '../home/Model';
import { useAppContextStore } from '../../context/AppContext';
import Icon from "react-native-dynamic-vector-icons";
import { LogBox } from 'react-native';

import { decode } from 'html-entities';
import StretchyHeader from '../components/StretchyHeader';
import { DownloadProgress } from '../../services/download/DownloadModel';
import '../../utils/extensions/extension+Number'
// import StretchableHeader from 'react-native-stretchable-header';

const headerHeight = 150 * 2;
const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;


const InsightScreen = ({ route, navigation }) => {
    const { showPlayer, setShowPlayer, setPlayTrackNo } = useAppContextStore()
    const { podcast } = useAppContextStore()

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, [])

    const getButton = (_item: Episode) => {
        switch (_item.isDownloaded) {
            case DownloadProgress.downloaded:
                return (
                    <TouchableOpacity>
                        <Icon name="cloud-done-outline" size={24} color="white" type={'Ionicons'} />
                    </TouchableOpacity>
                );
                break;
            case DownloadProgress.downloading:
                return <ActivityIndicator size="small" color="#FFFFFF" />;
            default:
                return (
                    <TouchableOpacity>
                        <Icon name="cloud-outline" size={24} color="white" type={'Ionicons'} />
                    </TouchableOpacity>
                );
                break;
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
                        <Text style={styles.listItemDuration}>{parseFloat(episode.duration)}</Text>
                    </View>
                    <View style={{ width: "10%" }}>{getButton(episode)}</View>
                </View>
            </View>
        )
    }

    const renderHeader = () => {
        return (
            <View
                style={{
                    paddingBottom: 15
                }}
            >
                <Text style={styles.title}>{podcast?.title}</Text>
                <Text style={styles.text}>{decode(podcast?.description)}</Text>
            </View>
        )
    }

    const renderContentView = () => {

        return (
            <View
                style={{ zIndex: -1, flex: -1 }}
            >
                {renderHeader()}
                <FlatList

                    data={podcast?.episodes}
                    renderItem={(item) => {
                        return renderEpisode(item.item, item.index)
                    }
                    }
                    keyExtractor={(item, id) => id.toString()}
                />
            </View>
        )


    }

    return (
        <StretchyHeader
            headerImageHeight={380}
            headerImageSource={{ uri: podcast?.artwork }}
            contentView={renderContentView()}
        />
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
    title: {
        margin: 15,
        fontSize: 26,
        marginTop: 25,
        fontWeight: "bold",
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