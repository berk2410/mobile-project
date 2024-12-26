import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useCallback } from 'react';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({ strategy: 'oauth_facebook' });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({ strategy: 'oauth_apple' });

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        setError('Additional steps required to complete sign-in.');
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setError('Invalid email or password. Please try again.');
    }
  }, [isLoaded, emailAddress, password]);

  const onPressOAuth = useCallback(async (provider) => {
    try {
      const startOAuthFlow =
        provider === 'google' ? startGoogleOAuthFlow :
        provider === 'facebook' ? startFacebookOAuthFlow :
        startAppleOAuthFlow;

      const { createdSessionId } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/sign-in', { scheme: 'myapp' }),
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace('/');
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, [startGoogleOAuthFlow, startFacebookOAuthFlow, startAppleOAuthFlow]);

  const onForgotPasswordPress = () => {
    // Redirect to forgot password screen or flow
    router.navigate('/fpassword');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back!</Text>
      <Text style={styles.subheader}>Sign in to your account</Text>

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
        onChangeText={(pass) => setPassword(pass)}
      />
      <TouchableOpacity style={styles.button} onPress={onSignInPress}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Forgot Password Button */}
      <TouchableOpacity onPress={onForgotPasswordPress}>
        <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
      </TouchableOpacity>

      {/* OAuth Buttons */}
      <TouchableOpacity style={styles.oauthButton} onPress={() => onPressOAuth('google')}>
        <Image style={styles.oauthLogo} source={require('../../assets/images/google-logo.png')} />
        <Text style={styles.oauthText}>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.oauthButton} onPress={() => onPressOAuth('facebook')}>
        <Image style={styles.oauthLogo} source={require('../../assets/images/facebook-logo.png')} />
        <Text style={styles.oauthText}>Sign in with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.oauthButton} onPress={() => onPressOAuth('apple')}>
        <Image style={styles.oauthLogo} source={require('../../assets/images/apple-logo.png')} />
        <Text style={styles.oauthText}>Sign in with Apple</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <Link href="/sign-up" style={styles.link}>
          <Text style={styles.linkText}>Sign up</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F1F4F9', // Updated background color to match design
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2b2d42', // Matching your header color
    marginBottom: 10,
  },
  subheader: {
    fontSize: 18,
    color: '#8d99ae', // Soft color for subheader
    marginBottom: 30,
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
    backgroundColor: '#1f2a44', // Updated button color
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff', // White text on button
    fontWeight: 'bold',
  },
  errorText: {
    color: '#e63946', // Red color for error
    marginBottom: 15,
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#8d99ae',
  },
  link: {
    marginLeft: 5,
  },
  linkText: {
    fontSize: 14,
    color: '#2b2d42', // Consistent link color
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#1F2A44', // Same as link and sign-in button
    fontWeight: 'bold',
    marginTop: 10,
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
});
