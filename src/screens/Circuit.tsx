import React, { useContext } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Text } from 'react-native-svg';
import { LocationData } from '../types/LocationData';
import { Driver } from '../types/Driver';
import { DriversContext } from '../context/DrivesContext';
import useFetchLoop from '../hooks/useFetchLoop';
import { useIsFocused } from '@react-navigation/native';


const calculateBounds = (data: LocationData[]) => {
  let minX = Math.min(...data.map(p => p.x));
  let maxX = Math.max(...data.map(p => p.x));
  let minY = Math.min(...data.map(p => p.y));
  let maxY = Math.max(...data.map(p => p.y));

  return { minX, maxX, minY, maxY };
};


const pad = n => `${Math.floor(Math.abs(n))}`.padStart(2, '0');

const getTimezoneOffset = date => {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? '+' : '-';
  return diff + pad(tzOffset / 60) + ':' + pad(tzOffset % 60);
};

const toISOStringWithTimezone = date => {
  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    getTimezoneOffset(date);
};

function subtractSeconds(date, seconds) {
  date.setSeconds(date.getSeconds() - seconds);
  return date;
}


const scaleAndTranslatePath = (data: LocationData[], drivers: Driver[]) => {
  const { minX, maxX, minY, maxY } = calculateBounds(data);


  const width = maxX - minX;
  const height = maxY - minY;

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;


  const margin = 20;

  const availableWidth = screenWidth - margin * 2;
  const availableHeight = screenHeight - margin * 2;


  const scaleFactorX = availableWidth / width;
  const scaleFactorY = availableHeight / height;


  const scaleFactor = Math.min(scaleFactorX, scaleFactorY);


  const offsetX = (availableWidth - width * scaleFactor) / 2 - minX * scaleFactor + margin;
  const offsetY = (availableHeight - height * scaleFactor) / 2 - minY * scaleFactor + margin;


  let path = [];
  let driver = drivers.find(item => item.driver_number === data[0].driver_number);
  path.push({
    xScaled: (data[0].x - minX) * scaleFactor + offsetX,
    yScaled: (data[0].y - minY) * scaleFactor + offsetY,
    ...data[0],
    team_colour: driver?.team_colour,
  });

  data.forEach((point, index) => {
    if (index > 0) {
      let driver2 = drivers.find(item2 => item2.driver_number === point.driver_number);
      path.push({
        xScaled: (point.x - minX) * scaleFactor + offsetX,
        yScaled: (point.y - minY) * scaleFactor + offsetY,
        ...point,
        team_colour: driver2?.team_colour,
      });
    }
  });

  return path;
};



const GeoJSONMap = () => {
  const isFocused = useIsFocused();
  const context = useContext(DriversContext);

  if (!context) {
    throw new Error('UserContext is not available!');
  }

  const { data } = context;

  const getDate = () => {
    let now = toISOStringWithTimezone(new Date());
    let past = toISOStringWithTimezone(subtractSeconds(new Date(),10));
    return [past, now];
  };

  const fetchPosition = (dataLocation: LocationData[]) => {
      const ordered = dataLocation.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const seenPositions = new Set();
      const filteredResults: LocationData[] = [];
      ordered.forEach((result) => {
        if (!seenPositions.has(result.driver_number)) {
        filteredResults.push(result);
        seenPositions.add(result.driver_number);
        }
      });
    return filteredResults;
  };

  let { data: position } = useFetchLoop<LocationData[]>('https://api.openf1.org/v1/location?session_key=latest&date>' + getDate()[0] + '&date<' + getDate()[1], fetchPosition, 2000, false, isFocused);




  const svgData = position && position.length > 0 ? scaleAndTranslatePath(position, data ? data : []) : [];
  return (
      <SafeAreaView style={styles.container}>
      <Svg width="100%" height="100%" viewBox="100 0 700 100" preserveAspectRatio="xMinYMin meet">
       {svgData.length > 0 ?
       svgData.map(item =>
        <View key={item.driver_number}>
       <Circle key={'Circle' + item.driver_number}
          cx={item.xScaled}
          cy={item.yScaled}
          r="14"
          fill={'#' + item.team_colour}
         />
          <Text
          key={'Text' + item.driver_number}
          stroke="black"
          fontSize="24"
          x={item.xScaled}
          y={item.yScaled}
          textAnchor="middle"
         >{item.driver_number}</Text></View>) : null}
        </Svg>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GeoJSONMap;
