import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useRouter } from 'expo-router';

const Profile = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editable, setEditable] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use Clerk's update method to update the user's profile
      await user.update({
        firstName,
        lastName,
      });
      setEditable(false); // Exit edit mode after successful update
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isLoaded) {
    return <ActivityIndicator size="large" color="#5D8A8E" style={styles.loadingIndicator} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please sign in to view your profile.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(home)')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      {/* Editable Form */}
      {editable ? (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdateProfile}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>First Name</Text>
            <Text style={styles.value}>{user?.firstName || 'No first name'}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Last Name</Text>
            <Text style={styles.value}>{user?.lastName || 'No last name'}</Text>
          </View>

          {/* Email Display */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.emailAddresses[0].emailAddress || 'No email available'}</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setEditable(true)}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={signOut}
      >
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F1F4F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3A3A3A',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#A1A8B1',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E0E4E8',
    width: 300,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: '#191970',
    fontWeight: 'bold',
  },
  button: {
    padding: 15,
    marginTop: 20,
    backgroundColor: '#1f2a44', // Adjusted to match your color scheme
    borderRadius: 8,
    alignItems: 'center',
    width: 300,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D3D4',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
});

export default Profile;
