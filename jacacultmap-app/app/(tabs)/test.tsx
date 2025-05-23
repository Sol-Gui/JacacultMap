import { StyleSheet } from 'react-native';
import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";

export default function test() {

  return (
    <View>
      <Text>Pagina de testes</Text>
      <Text style={styles.lepo}>{"Carregando..."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lepo: {
    color: '#FF0000',
  },
});