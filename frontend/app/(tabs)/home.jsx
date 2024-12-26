import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";

const filterData = [
  { id: "all", label: "All" },
  { id: "conference", label: "Conference" },
  { id: "workshop", label: "Workshop" },
  { id: "seminar", label: "Seminar" },
  { id: "meetup", label: "Meetup" },
];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch event data
    axios
      .get("http://localhost:3001/event/get-all-events")
      .then((response) => {
        setEvents(response.data.events);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("An error occurred while fetching events.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const newEvents = events.filter((event) =>
      (filter === "all" ? true : event.category === filter) &&
      (event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredEvents(newEvents);
  }, [filter, searchQuery, events]);

  const renderItem = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.name || "No name available"}</Text>
      <Text style={styles.eventDetails}>
        Category: {item.category || "No category"}
      </Text>
      <Text style={styles.eventDetails}>
        Start: {new Date(item.startDate).toLocaleString() || "No start date"}
      </Text>
      <Text style={styles.eventDetails}>
        End: {new Date(item.endDate).toLocaleString() || "No end date"}
      </Text>
      <Text style={styles.eventDescription}>
        {item.description || "No description available"}
      </Text>
    </View>
  );

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

  if (events.length === 0) {
    return <Text style={styles.errorText}>No events available</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredEvents}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.flatListContainer}
        ListHeaderComponent={
          <>
            {/* Header title */}
            <Text style={styles.header}>Events</Text>
            {/* Filter buttons */}
            <ScrollView
              horizontal
              style={styles.filterContainer}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContent}
            >
              {filterData.map((data) => (
                <TouchableOpacity
                  key={data.id}
                  style={[
                    styles.filterButton,
                    filter === data.id ? styles.selectedButton : null,
                  ]}
                  onPress={() => setFilter(data.id)}
                >
                  <Text style={styles.filterButtonText}>{data.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {/* Search bar */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search events by name or description..."
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events found.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F1F4F9",
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#3A3A3A",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Roboto",
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    color: "#E74C3C",
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  eventCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 20,
    padding: 18,
    shadowColor: "#A1A8B1",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#E0E4E8",
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
    fontFamily: "Roboto",
  },
  eventDetails: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 6,
    fontFamily: "Roboto",
  },
  eventDescription: {
    fontSize: 16,
    color: "#4A4A4A",
    marginTop: 12,
    fontFamily: "Roboto",
    lineHeight: 24,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 20,
    paddingHorizontal: 5,
    paddingBottom: 15,
  },
  filterContent: {
    paddingVertical: 10,
  },
  filterButton: {
    backgroundColor: "#1F2A44",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginHorizontal: 5,
    elevation: 4,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#5D8A8E",
    elevation: 6,
  },
  filterButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchInput: {
    height: 45,
    borderColor: "#D0D3D4",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#7F8C8D",
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
});

export default Home;
