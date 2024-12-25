import {
  View,
  Text,
  FlatList,
  Button,
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
  const [filteredEvents, setFilteredEvents] = useState([events]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch event data
    axios
      .get("http://localhost:3001/event/get-all-events") // Replace localhost with your IP if needed
      .then((response) => {
        setEvents(response.data.events); // Use 'events' from the response
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
      filter === "all" ? event : event.category === filter
    );
    setFilteredEvents(newEvents);
  }, [filter, events]);

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
      <Text style={styles.header}>Upcoming Events</Text>
      {/* Wrapping the buttons in a ScrollView with no scrollbar */}
      <ScrollView
        horizontal
        style={styles.filterContainer}
        showsHorizontalScrollIndicator={false} // Hide the horizontal scrollbar
        contentContainerStyle={styles.filterContent}
      >
        {filterData.map((data) => (
          <TouchableOpacity
            key={data.id}
            style={[
              styles.filterButton,
              filter === data.id ? styles.selectedButton : null, // Highlight selected button
            ]}
            onPress={() => setFilter(data.id)}
          >
            <Text style={styles.filterButtonText}>{data.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={filteredEvents}
        renderItem={renderItem}
        keyExtractor={(item) => item._id} // Use the unique _id field
        contentContainerStyle={styles.flatListContainer} // Add spacing to the list
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F1F4F9", // A clean, light gray background
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#3A3A3A", // Dark gray for the header
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Roboto",
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    color: "#E74C3C", // Bright red for error messages
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  eventCard: {
    backgroundColor: "#FFFFFF", // Clean white card
    borderRadius: 12,
    marginBottom: 20,
    padding: 18,
    shadowColor: "#A1A8B1", // Soft shadow color for card depth
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#E0E4E8", // Light gray border for a clean look
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50", // Dark blue for title
    marginBottom: 8,
    fontFamily: "Roboto",
  },
  eventDetails: {
    fontSize: 16,
    color: "#7F8C8D", // Muted gray-blue for event details
    marginBottom: 6,
    fontFamily: "Roboto",
  },
  eventDescription: {
    fontSize: 16,
    color: "#4A4A4A", // Darker gray for description
    marginTop: 12,
    fontFamily: "Roboto",
    lineHeight: 24,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 20,
    paddingHorizontal: 5,
    paddingBottom: 15, // Add padding bottom to avoid touching the next section
  },
  filterContent: {
    paddingVertical: 10,
  },
  filterButton: {
    backgroundColor: "#5D8A8E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginHorizontal: 5,
    elevation: 4, // Button shadow effect
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#1F2A44", // Dark blue for selected button
    elevation: 6, // Stronger shadow for selected button
  },
  filterButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  flatListContainer: {
    paddingBottom: 20, // Ensure the events list has some space at the bottom
  },
});

export default Home;