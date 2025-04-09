import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { CarouselMomentum, CarouselMomentumAnimationType } from 'react-native-momentum-carousel';
import { Driver } from '../types/Driver';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DriversContext } from '../context/DrivesContext';

const HomeScreen = () => {

  const context = useContext(DriversContext);

  if (!context) {
    throw new Error('UserContext is not available!');
  }

  const { data, loading } = context;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ( {item}) => {
    const driver: Driver = item;
    return (
    <View key={driver.driver_number} style={[styles.card, {backgroundColor: '#' + driver.team_colour}]}>
      <Image
        source={{ uri: driver.headshot_url.replace('.transform/1col/image.png','') }}
        style={styles.driverImage}
      />
      <Text style={styles.driverName}>{driver.driver_number} {driver.full_name}</Text>
      <Text style={styles.teamName}>Team: {driver.team_name}</Text>
      <Text style={styles.acronym}>Acronym: {driver.name_acronym}</Text>
    </View>);
  };

  return (
     <SafeAreaView style={{flex: 1}}>
    <View style={styles.container}>
         <CarouselMomentum
          data={data ? data : []}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width}
          renderItem={renderItem}
          onSnap={() => {}}
          inactiveScale={0.8}
          animation={CarouselMomentumAnimationType.Default}      />
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    margin: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  driverImage: {
    width: '100%',
    height: Dimensions.get('window').height / 1.37,
    borderRadius: 50,
    marginBottom: 10,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  teamName: {
    fontSize: 16,
    color: '#ffffff',
  },
  driverNumber: {
    fontSize: 14,
    color: '#ffffff',
  },
  acronym: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default HomeScreen;
