import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import AppNavigation from './src/navigation/AppNavigation'
import { apiCall } from './src/api/ai'

const App = () => {
  // useEffect(() => {
  //   apiCall("computer image");
  // },[])


  return (
    <AppNavigation />
  )
}

export default App

const styles = StyleSheet.create({})