import { SignedIn, SignedOut, useUser, useAuth } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SignedIn>
        <View style={styles.containerHello}>
          <Text style={styles.header}>Welcome!</Text>
          <Text style={styles.subheader}>
            Hello,{" "}
            <Text style={styles.highlight}>{user?.firstName}</Text>
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(tabs)/map")}
          >
            <Text style={styles.buttonText}>Go to Map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button} // Styled similarly
            onPress={() => {
              signOut();
            }}
          >
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </SignedIn>
      <SignedOut>
        <Text style={styles.header}>Welcome!</Text>
        <Text style={styles.subheader}>
          Please sign in or sign up to continue.
        </Text>
        <TouchableOpacity style={styles.button}>
          <Link href="/(auth)/sign-in" style={styles.link}>
            <Text style={styles.buttonText}>Sign In</Text>
          </Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Link href="/(auth)/sign-up" style={styles.link}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </Link>
        </TouchableOpacity>
      </SignedOut>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F1F4F9", // Updated background to match your color scheme
  },
  containerHello: {
    flex: 1,
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'column',
    padding: 20,
    backgroundColor: "#F1F4F9", // Consistent background color
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2b2d42", // Color to match your design
    marginBottom: 10,
  },
  subheader: {
    fontSize: 18,
    color: "#8d99ae", // Soft text color
    marginBottom: 30,
    textAlign: "center",
  },
  highlight: {
    color: "#2b2d42", // Highlight color matches the header
    fontWeight: "bold",
  },
  button: {
    width: 270, // Fixed width for consistency
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#1f2a44", // Button color adjusted to match your scheme
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff", // White text on button
    fontWeight: "bold",
  },
  link: {
    width: "100%",
    textAlign: "center",
  },
  signOutText: {
    fontSize: 18,
    color: "#2b2d42", // Matching sign out text color
    fontWeight: "bold",
    marginTop: 10,
  },
});
