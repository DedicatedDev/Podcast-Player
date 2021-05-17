import { decode } from 'html-entities';
import * as React from 'react'
import {View,Text, Image, StyleSheet } from 'react-native';
import { InsightHeaderViewModel } from './InsightViewModel';
interface Props {
    height:number,
    model:InsightHeaderViewModel
}
const InsightHeader = (props:Props) => {
    return (
        <View style={{height:props.height}}>
            <Image style={styles.image} source = {{uri:props.model.artwork}}></Image>
            <Text style={styles.text}>{props.model.title}</Text>
            <Text style={styles.text}>{decode(props.model.showNotes)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
  },
  image: {
    height: 250,
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
});

export {InsightHeader};