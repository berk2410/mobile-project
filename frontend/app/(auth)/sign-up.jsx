import React, { useEffect, useState, useCallback } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setError('Unable to sign up. Please check your details and try again.');
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        setError('Verification failed. Please try again.');
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setError('Invalid verification code. Please try again.');
    }
  };

  useWarmUpBrowser();
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({ strategy: 'oauth_facebook' });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({ strategy: 'oauth_apple' });

  const onPressOAuth = useCallback(async (provider) => {
    try {
      const startOAuthFlow =
        provider === 'google' ? startGoogleOAuthFlow :
        provider === 'facebook' ? startFacebookOAuthFlow :
        startAppleOAuthFlow;

      const { createdSessionId } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/sign-up', { scheme: 'myapp' }),
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace('/(tabs)/home');
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, []);

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Verify Your Email</Text>
        <Text style={styles.subheader}>
          We've sent a verification code to your email. Please enter it below.
        </Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor="#aaa"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create an Account</Text>
      <Text style={styles.subheader}>Sign up to get started</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email Address"
        placeholderTextColor="#aaa"
        onChangeText={(email) => setEmailAddress(email)}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.oauthButton} onPress={() => onPressOAuth('google')}>
        <Image style={styles.oauthLogo} source={require('../../assets/images/google-logo.png')} />
        <Text style={styles.oauthText}>Sign up with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.oauthButton} onPress={() => onPressOAuth('facebook')}>
        <Image style={styles.oauthLogo} source={require('../../assets/images/facebook-logo.png')} />
        <Text style={styles.oauthText}>Sign up with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.oauthButton} onPress={() => onPressOAuth('apple')}>
        <Image style={styles.oauthLogo} source={require('../../assets/images/apple-logo.png')} />
        <Text style={styles.oauthText}>Sign up with Apple</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f8fc',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2b2d42',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 18,
    color: '#8d99ae',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    padding: 15,
    marginTop: 20,
    backgroundColor: '#2b2d42',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 15,
    marginTop: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    borderColor: '#dcdcdc',
    borderWidth: 1,
  },
  oauthLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  oauthText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#e63946',
    marginBottom: 15,
    textAlign: 'center',
  },
});
