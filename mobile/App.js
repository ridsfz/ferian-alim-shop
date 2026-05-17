import { WebView } from 'react-native-webview';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: 'https://ferian-alim-shop-40u542zo5-rmferians-projects.vercel.app/' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});