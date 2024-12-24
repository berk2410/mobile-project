import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
    } else {
      Alert.alert('Registration Successful', `Account created for ${email}!`);
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginButtonText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECEFF1',  // Soft Light Grayish Blue background
    padding: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '600',
    color: '#37474F',  // Charcoal Gray title
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 25,
    borderWidth: 1.5,
    borderColor: '#90A4AE',  // Soft Slate Blue border
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,  // Add subtle depth
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#FF7043',  // Coral Red button
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#FF7043',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,  // Add depth to the button
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 15,
  },
  loginButtonText: {
    color: '#37474F',  // Charcoal Gray for login button text
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});
