import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

const filterData = [
  { id: "all", label: "All" },
  { id: "conference", label: "Conference" },
  { id: "workshop", label: "Workshop" },
  { id: "seminar", label: "Seminar" },
  { id: "meetup", label: "Meetup" },
];

const getImageForCategory = (category) => {
  switch (category) {
    case "conference":
      return require("../../assets/images/conference.png");
    case "workshop":
      return require("../../assets/images/workshop.png");
    case "seminar":
      return require("../../assets/images/seminar.png");
    case "meetup":
      return require("../../assets/images/meetup.png");
    default:
      return require("../../assets/images/default.png");
  }
};

const Home = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEvents, setExpandedEvents] = useState({});
  const { user } = useUser();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    user.update({ unsafeMetadata: { favorites: favorites } });
  }, [favorites])

  useEffect(() => {
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
    
    setFavorites(user?.unsafeMetadata?.favorites);
  }, []);

  useEffect(() => {
    const newEvents = events.filter(
      (event) =>
        (filter === "all" ? true : event.category === filter) &&
        (event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredEvents(newEvents);
  }, [filter, searchQuery, events]);

  const toggleDetails = (id) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLike = (id) => {
    if (favorites.includes(id)) {
      const filteredFavorites = favorites.filter((item) => item !== id)
      setFavorites(filteredFavorites)
    } else {
      setFavorites((prev) => [...prev, id])
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.eventCard}>
      <Image
        source={getImageForCategory(item.category)}
        style={styles.eventImage}
        resizeMode="cover"
      />
      <Text style={styles.eventTitle}>{item.name || "No name available"}</Text>
      {expandedEvents[item._id] && (
        <>
          <Text style={styles.eventDetails}>
            Category: {item.category || "No category"}
          </Text>
          <Text style={styles.eventDetails}>
            Start:{" "}
            {new Date(item.startDate).toLocaleString() || "No start date"}
          </Text>
          <Text style={styles.eventDetails}>
            End: {new Date(item.endDate).toLocaleString() || "No end date"}
          </Text>
          <Text style={styles.eventDescription}>
            {item.description || "No description available"}
          </Text>
        </>
      )}
      <View style={styles.cardActionContainer}>
        <TouchableOpacity
          style={styles.showDetailsButton}
          onPress={() => toggleDetails(item._id)}
        >
          <Text style={styles.showDetailsText}>
            {expandedEvents[item._id] ? "Hide Details" : "Show Details"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>handleLike(item._id)} style={styles.favoriteButton}>
          {user?.unsafeMetadata?.favorites?.includes(item._id) ? (
            <FontAwesome
              name="heart"
              color="#D22B2B"
              style={styles.favoriteIcon}
            />
          ) : (
            <FontAwesome5
              name="heart"
              color="#D22B2B"
              style={styles.favoriteIcon}
            />
          )}
        </TouchableOpacity>
      </View>
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
            {/* Başlık */}
            <Text style={styles.header}>Events</Text>
            {/* Filtre butonları */}
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
            {/* Arama çubuğu */}
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
  eventImage: {
    width: "100%",
    height: 70,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 10,
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
  showDetailsButton: {
    backgroundColor: "#1F2A44",
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  showDetailsText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cardActionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  favoriteButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  favoriteIcon: {
    fontSize: 25,
  },
});

export default Home;
