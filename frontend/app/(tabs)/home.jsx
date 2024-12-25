import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch event data
    axios.get('http://localhost:3001/event/get-all-events') // Replace localhost with your IP if needed
      .then(response => {
        setEvents(response.data.events); // Use 'events' from the response
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError('An error occurred while fetching events.');
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.name || 'No name available'}</Text>
      <Text style={styles.eventDetails}>Category: {item.category || 'No category'}</Text>
      <Text style={styles.eventDetails}>Start: {new Date(item.startDate).toLocaleString() || 'No start date'}</Text>
      <Text style={styles.eventDetails}>End: {new Date(item.endDate).toLocaleString() || 'No end date'}</Text>
      <Text style={styles.eventDescription}>{item.description || 'No description available'}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#5D8A8E" style={styles.loadingIndicator} />;
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
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item._id} // Use the unique _id field
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F1F4F9', // A clean, light gray background
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3A3A3A', // Dark gray for the header
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    color: '#E74C3C', // Bright red for error messages
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  eventCard: {
    backgroundColor: '#FFFFFF', // Clean white card
    borderRadius: 12,
    marginBottom: 20,
    padding: 18,
    shadowColor: '#A1A8B1', // Soft shadow color for card depth
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E0E4E8', // Light gray border for a clean look
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50', // Dark blue for title
    marginBottom: 8,
    fontFamily: 'Roboto',
  },
  eventDetails: {
    fontSize: 16,
    color: '#7F8C8D', // Muted gray-blue for event details
    marginBottom: 6,
    fontFamily: 'Roboto',
  },
  eventDescription: {
    fontSize: 16,
    color: '#4A4A4A', // Darker gray for description
    marginTop: 12,
    fontFamily: 'Roboto',
    lineHeight: 24,
  },
  reloadButton: {
    marginTop: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#1F2A44', // Deep blue button
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#1F2A44',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  reloadButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    textTransform: 'uppercase',
  },
});

export default Home;
