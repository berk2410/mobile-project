import React from "react";
import MapView from "react-native-maps";
import { StyleSheet, View } from "react-native";

const startLocation = {
  latitude: 39.91215817758095,
  longitude: 41.26383178239818,
  latitudeDelta: 2,
  longitudeDelta: 2,
};

export default function App() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={startLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
