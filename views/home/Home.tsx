import * as React from 'react';
import { View, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { EndPoint } from '../../services/network/Endpoint';
import { HttpMethod } from '../../services/network/Http_methods';
import { useNetworkService } from '../../services/network/NetworkService';
import { PodCast } from './Model';
import { InsightViewModel } from '../insight/InsightViewModel'
import { useAppContextStore } from '../../context/AppContext';
import { useEffect } from 'react';
import * as FileSystem from "expo-file-system";

const HomeScreen = ({ navigation }) => {

  const configUrl = () => {
    var endpoint = new EndPoint({ path: 'app.json', queries: [] });
    return endpoint.url();
  };
  const { data } = useNetworkService<PodCast[]>(configUrl(), HttpMethod.get, null);
  const {setPodcast } = useAppContextStore()

  

  const renderPodCast = (item) => (
    <TouchableOpacity
      style={styles.listitem}
      onPress={() => {
        let selectedItem:PodCast = item.item;
        setPodcast(selectedItem)
        return navigation.navigate("Insight")
      }}

    >
      <Image style={styles.image} source={{ uri: item.item.artwork }} />
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={(item) => {
          var modifiedItem = item.item;
          var newEpisodes = [];
          modifiedItem.episodes &&
            modifiedItem.episodes.forEach((episode) => {
              var uid =
                episode.podcast_id.toString() + "-" + episode.id.toString();
              var newEpisode = { ...episode, uid: uid};
              newEpisodes.push(newEpisode);
            });
          modifiedItem.episodes = newEpisodes;
          var newItem = item;
          newItem.item = modifiedItem;
          return renderPodCast(newItem);
        }}
        keyExtractor={(item, id) => id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
  },
  list: {
    margin: 10,
  },
  listitem: {
    height: 230,
    margin: 10,
    position: "relative",
  },
  image: {
    height: "100%",
    borderRadius: 10,
  },
  text: {
    textShadowColor: "rgba(51,51,51,0.31)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    position: "absolute",
    padding: 15,
    fontSize: 20,
    color: "#fff",
  },
});

export { HomeScreen };

