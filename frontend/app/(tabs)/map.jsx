import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import axios from "axios";

const startLocation = {
  latitude: 39.91215817758095,
  longitude: 41.26383178239818,
  latitudeDelta: 2,
  longitudeDelta: 2,
};

export default function Map() {
  const [events, setEvents] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null); // Seçili marker
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/event/get-all-events") // IP adresini düzenle
      .then((response) => {
        setEvents(response.data.events); // Gelen veriyi state'e ata
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Etkinlik verileri yüklenemedi.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#5D8A8E"
        style={styles.loadingIndicator}
      />
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={startLocation}
        onPress={() => setSelectedMarker(null)} // Haritaya tıklanınca seçimi temizle
      >
        {events.map((event) => (
          <Marker
            key={event._id}
            coordinate={{
              latitude: event.location.latitude,
              longitude: event.location.longitude,
            }}
            title={event.name}
            description={event.description}
            onPress={() => setSelectedMarker(event._id)} // Marker'a tıklanınca seçili yap
          >
            {selectedMarker === event._id && (
              <View style={styles.calloutView}>
                <Text style={styles.calloutTitle}>{event.name}</Text>
                <Text>{event.description}</Text>
              </View>
            )}
          </Marker>
        ))}
      </MapView>
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
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  calloutView: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  calloutTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});
