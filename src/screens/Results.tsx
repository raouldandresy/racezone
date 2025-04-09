import React, { useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import { Result } from '../types/Result';
import { GrandPrixMeeting } from '../types/GrandPrixMeeting';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DriversContext } from '../context/DrivesContext';
import useFetch from '../hooks/useFetch';


const ResultsScreen = () => {

  const context = useContext(DriversContext);

  if (!context) {
    throw new Error('UserContext is not available!');
  }

  const { data, loading: loadingDriver } = context;

  const fetchResults = (resultApi: Result[]): Result[] => {
    const dataFormatted: Result[] = resultApi.sort((a,b) =>  new Date(b.date).getTime() - new Date(a.date).getTime()).sort((a,b) => a.position - b.position);
    const filteredResults: Result[] = [];
    const seenPositions = new Set();
    const seenDrivers = new Set();
    dataFormatted.forEach((result) => {
      if (!seenPositions.has(result.position) && !seenDrivers.has(result.driver_number)) {
        filteredResults.push(result);
        seenPositions.add(result.position);
        seenDrivers.add(result.driver_number);
      }
    });
    return filteredResults;
  };

  const { data: results, loading } = useFetch<Result[]>('https://api.openf1.org/v1/position?session_key=latest', fetchResults);

  const { data: race } = useFetch<GrandPrixMeeting[]>('https://api.openf1.org/v1/sessions?meeting_key=latest&session_key=latest');



  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
    <ScrollView style={styles.container} contentContainerStyle={{flexGrow:1, paddingBottom:100}}  showsVerticalScrollIndicator={false}>
      {race && <Text style={styles.title}>{race[0]?.circuit_short_name} {race[0]?.country_name} {race[0]?.session_name}</Text>}
      {!loadingDriver && results?.map((result: Result) => {
        const driver = data?.find(el => el.driver_number === result.driver_number);
        return(
        <View key={result.driver_number} style={[styles.resultItem, {backgroundColor: '#' + driver?.team_colour}]}>
             <View style={styles.flex01}>
                <Text style={styles.resultLabel}>{result.position}</Text>
             </View>
            <View style={styles.flex}>
                 <Image
                    source={{ uri: driver?.headshot_url.replace('.transform/1col/image.png','') }}
                    style={styles.driverImage}
                    />
            </View>
            <View style={styles.labelRight}>
                <Text style={styles.resultText}>Driver Number: {result.driver_number}</Text>
                <Text style={styles.resultText}>{driver?.full_name}</Text>
             </View>
        </View>
    );})}
    </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultItem: {
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultLabel: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
   driverImage: {
      width: '100%',
      height: '100%',
    },
    flex:{
        flexGrow: 1,
    },
    flex01:{
        alignItems: 'center',
        flexGrow: 0.1,
    },
    labelRight:{
        flexGrow: 1,
        alignItems: 'center',
    },
});

export default ResultsScreen;
