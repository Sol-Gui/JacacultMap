import { StyleSheet } from 'react-native';
import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useMessage } from "../services/api";

export default function test() {

  const message = useMessage("test");

  return (
    <View>
      <Text>Pagina de testes</Text>
      <Text style={styles.lepo}>{message || "Carregando..."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lepo: {
    color: '#FF0000',
  },
});