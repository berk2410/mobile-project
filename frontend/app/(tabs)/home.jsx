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
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
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
    backgroundColor: '#f7f8fc',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2b2d42',
    marginBottom: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    color: '#e63946',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 16,
    color: '#444',
    marginTop: 8,
  },
  reloadButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2b2d42',
    borderRadius: 8,
    alignItems: 'center',
  },
  reloadButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Home;
