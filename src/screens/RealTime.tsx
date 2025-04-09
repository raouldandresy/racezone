import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Animated from 'react-native-reanimated';
import { IntervalData } from '../types/IntervalData';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DriversContext } from '../context/DrivesContext';
import useFetchLoop from '../hooks/useFetchLoop';
import { useIsFocused } from '@react-navigation/native';


const getFirstOccurrences = (data: IntervalData[]): IntervalData[] => {
  const firstOccurrences: IntervalData[] = [];

  data.forEach((entry) => {
    const driver_number = entry.driver_number;


    if (!firstOccurrences[driver_number]) {
      firstOccurrences[driver_number] = entry;
    }
  });


  return Object.values(firstOccurrences);
};

const RealTimePage = () => {
  const [highlightedRows, setHighlightedRows] = useState<Set<number>>(new Set());
  const isFocused = useIsFocused();
  const context = useContext(DriversContext);

  if (!context) {
    throw new Error('UserContext is not available!');
  }

  const { data } = context;

  const fetchData =  (latestData: IntervalData[], prevDataInterval?: IntervalData[]) : IntervalData[]=> {
    const reversed: IntervalData[] = latestData.reverse();
    const filtered: IntervalData[] = getFirstOccurrences(reversed).sort((a, b) => {
      const gapA = a.gap_to_leader ?? Infinity;
      const gapB = b.gap_to_leader ?? Infinity;
      return gapA - gapB;
    });
    if (filtered) {
        const changedRows = filtered
        .map((row, index) => {
          const previousRow = prevDataInterval?.find((el) => el.driver_number === row.driver_number);
          return (previousRow && (previousRow.gap_to_leader !== row.gap_to_leader || previousRow.interval !== row.interval)) ? index : null;
        })
        .filter((index) => index !== null);

      if (changedRows.length > 0) {
        setHighlightedRows(new Set(changedRows));
        setTimeout(() => {
          setHighlightedRows(new Set());
        }, 2000);
      }

      return filtered;
    }
    return [];
  };

  let { data: dataInterval } = useFetchLoop<IntervalData[]>('https://api.openf1.org/v1/intervals?session_key=latest&gap_to_leader<90', fetchData, 5000, true, isFocused);

  return (
     <SafeAreaView style={{flex: 1}}>
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {dataInterval && dataInterval.length > 0 ? (
        <View style={styles.table}>

          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Driver Number</Text>
            <Text style={styles.tableHeader}>Date</Text>
            <Text style={styles.tableHeader}>Gap to Leader (s)</Text>
            <Text style={styles.tableHeader}>Interval to Ahead (s)</Text>
          </View>

          {/* Table Data Rows */}
          {dataInterval.map((interval, index) => {
            const rowStyle = highlightedRows.has(index) ? styles.changedRow : {};
            const driver = data?.find(item => item.driver_number === interval.driver_number);
            return (
              <Animated.View
                key={interval.driver_number}
                style={[styles.tableRow, rowStyle]}
              >
                <Text style={styles.tableCell}>{interval.driver_number} {driver?.name_acronym}</Text>
                <Text style={styles.tableCell}>{new Date(interval.date).toLocaleString()}</Text>
                <Text style={styles.tableCell}>{interval.gap_to_leader}s</Text>
                <Text style={styles.tableCell}>{interval.interval}s</Text>
              </Animated.View>
            );
          })}
        </View>
      ) : (
         <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
      )}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f1f1f1',
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  table: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
    width: '25%',
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#34495e',
    width: '25%',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changedRow: {
    backgroundColor: '#f39c12',
  },
  progressContainer: {
    marginTop: 40,
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    width: '80%',
    height: 12,
    backgroundColor: '#3498db',
    borderRadius: 6,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RealTimePage;
