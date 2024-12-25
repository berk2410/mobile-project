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
            onPress={() => {
              signOut();
            }}
          >
            <Text style={styles.signOutText}>Çıkış</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(tabs)/map")}
          >
            <Text style={styles.buttonText}>Go to Map</Text>
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
    backgroundColor: "#f7f8fc",
  },
  containerHello: {
    flex: 1,
    display:'flex',
    justifyContent: "center",
    alignItems: "center",
    flexDirection:'column',
    padding: 20,
    backgroundColor: "#f7f8fc",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2b2d42",
    marginBottom: 10,
  },
  subheader: {
    fontSize: 18,
    color: "#8d99ae",
    marginBottom: 30,
    textAlign: "center",
  },
  highlight: {
    color: "#2b2d42",
    fontWeight: "bold",
  },
  button: {
    width: "270",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#2b2d42",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    width: "100%",
    textAlign: "center",
  },
  signOutText: {
    fontSize: 18,
    color: "#2b2d42",
    fontWeight: "bold",
    marginTop: 10,
  },
});
