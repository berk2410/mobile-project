import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successfulCreation, setSuccessfulCreation] = useState(false);

  const router = useRouter();
  const { signIn, setActive } = useSignIn();

  const onRequestReset = async () => {
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email
      });
      setSuccessfulCreation(true);
      setMessage('');
    } catch (err) {
      console.log(err.errors[0].message);
      if (err.errors[0].message === 'Identifier is invalid.') {
        setMessage('Lütfen geçerli bir e-posta girin');
      } else if (err.errors[0].message === "Couldn't find your account.") {
        setMessage('E-posta bulunamadı');
      } else {
        setMessage('Bir hata oluştu, lütfen tekrar deneyin');
      }
    }
  };

  const onReset = async () => {
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code,
        password: password
      });
      Alert.alert('Uyarı', 'Şifre başarıyla değiştirilmiştir', [
        { text: 'Tamam', onPress: () => router.replace('/(home)') }
      ]);
      await setActive({ session: result.createdSessionId });
    } catch (err) {
      if (err.errors[0].message === 'Enter code.') {
        setMessage('Lütfen kodu girin');
      } else if (err.errors[0].message === 'Enter password.') {
        setMessage('Lütfen yeni şifrenizi girin');
      } else if (err.errors[0].message === 'Identifier is invalid.' || err.errors[0].message === 'is incorrect') {
        setMessage('Geçersiz kod');
      } else {
        setMessage('Bir hata oluştu, lütfen tekrar deneyin');
      }
      console.log(err.errors[0].message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView style={styles.container}>
          <View>
            {!successfulCreation && (
              <>
                <View style={styles.instructionContainer}>
                  <Text style={styles.instructionText}>
                    Sıfırlama kodu için lütfen geçerli e-posta adresinizi girin
                  </Text>
                </View>
                <Text style={styles.message}>{message}</Text>
                <View style={styles.inputContainer}>
                  <Icon name="email" size={24} color="#FAF7F0" style={styles.icon} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="E-mail"
                    placeholderTextColor="#aaa"
                    style={styles.input}
                    keyboardType="email-address"
                  />
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={onRequestReset}>
                  <Text style={styles.loginButtonText}>Şifreyi Sıfırla</Text>
                </TouchableOpacity>
              </>
            )}
            {successfulCreation && (
              <>
                <View style={styles.instructionContainer}>
                  <Text style={styles.instructionText}>
                    {email} adresine kodu gönderdik
                  </Text>
                </View>
                <Text style={styles.message}>{message}</Text>
                <View style={styles.inputContainer}>
                  <Icon name="code-tags" size={24} color="#FAF7F0" style={styles.icon} />
                  <TextInput
                    value={code}
                    onChangeText={setCode}
                    placeholder="Kod"
                    placeholderTextColor="#aaa"
                    style={styles.input}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="lock" size={24} color="#FAF7F0" style={styles.icon} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Yeni Şifre"
                    placeholderTextColor="#aaa"
                    style={styles.input}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="#FAF7F0" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={onReset}>
                  <Text style={styles.loginButtonText}>Onayla</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fc',
    padding: 20,
  },
  instructionContainer: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#e63946',
    marginBottom: 15,
  },
  inputContainer: {
    width: 275,
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    position: 'relative',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingLeft: 40,
  },
  icon: {
    position: 'absolute',
    left: 10,
    top: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  loginButton: {
    width: 275,
    padding: 15,
    marginTop: 20,
    backgroundColor: '#2b2d42',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  loginButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

