import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

export default function Test() {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      <Text>
        Página segura!
      </Text>
      <Text style={styles.lepo}>Acesso garantido</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lepo: {
    color: '#BBBBBB',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
