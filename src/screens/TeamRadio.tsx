import React, { useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Sound from 'react-native-sound';
import useFetchLoop from '../hooks/useFetchLoop';
import { useIsFocused } from '@react-navigation/native';


interface TeamRadioData {
  date: string;
  driver_number: number;
  meeting_key: string;
  recording_url: string;
  session_key: string;
}

const AudioPlayerComponent = () => {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [currentSound, setCurrentSound] = useState<Sound | null>(null);
  const isFocused = useIsFocused();

  const fetchAudioData = (data: TeamRadioData[]) :TeamRadioData[] => {
      const ordered = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return ordered;
  };
  const { data, loading } = useFetchLoop<TeamRadioData[]>('https://api.openf1.org/v1/team_radio?session_key=latest', fetchAudioData, 60000, false, isFocused);


  const playAudio = (audioUrl: string) => {

    if (currentSound) {
      currentSound.stop();
      currentSound.release();
    }


    const soundInstance = new Sound(audioUrl, '', (error) => {
      if (error) {
        console.error('Error loading audio:', error);
        return;
      }

      soundInstance.play((success) => {
        if (success) {
          setIsPlaying(null);
          soundInstance.release();
          setCurrentSound(null);
        } else {
          console.error('Playback failed');
        }
      });
    });

    setCurrentSound(soundInstance);
    setIsPlaying(audioUrl);
  };


  const stopAudio = () => {
    if (currentSound) {
      currentSound.stop();
      currentSound.release();
      setIsPlaying(null);
      setCurrentSound(null);
    }
  };


  const renderItem = ({ item }: { item: TeamRadioData }) => (
    <View style={{ marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
      <View style={{ flex: 1.5 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          Driver {item.driver_number}
        </Text>
        <Text style={{ marginVertical: 10 }}>Date: {new Date(item.date).toLocaleString()}</Text>
      </View>
      <View style={{ flex: 0.5 }}>
        <TouchableOpacity
          style={[styles.button, isPlaying === item.recording_url && styles.buttonPlaying]}
          onPress={() => {
            if (isPlaying === item.recording_url) {
              stopAudio();
            } else {
              playAudio(item.recording_url);
            }
          }}
        >
          <Text style={styles.buttonText}>
            {isPlaying === item.recording_url ? 'Stop' : 'Play'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
       return (
         <View style={styles.loadingContainer}>
           <ActivityIndicator size="large" color="#0000ff" />
         </View>
       );
     }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 8,  flex: 1, justifyContent: 'center' }}>
        <FlatList
          data={data ? data : []}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${index}-${item.session_key}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonPlaying: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AudioPlayerComponent;
