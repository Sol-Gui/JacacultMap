import { StyleSheet } from 'react-native';
import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useMessage } from "../services/api";

export default function Index() {

  const message = useMessage();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text style={styles.lepo}>{message || "Carregando..."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lepo: {
    color: '#FF0000',
  },
});