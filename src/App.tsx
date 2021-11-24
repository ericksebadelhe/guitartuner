import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from "react-native";
import Tuner from "./components/Tuner";
import Note from "./components/Note";
import Meter from "./components/Meter";

export interface INote {
  name: string;
  value: number;
  octave: number;
  frequency: number;
  cents: number;
}

const App: React.FC = () => {
  const [note, setNote] = useState<INote>({
    name: "A",
    value: 1,
    octave: 4,
    frequency: 440,
    cents: 0,
  });
  const [lastNoteName, setLastNoteName] = useState("A");


  useEffect(() => {
    const init = async () => {
      if (Platform.OS === "android") {
        const res = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        console.log('PERMISSION', res);
      }
  
      const tuner = new Tuner();
      tuner.start();
      tuner.onNoteDetected = (note: INote) => {
        console.log('NOTE DETECTED', note);
        setNote(note);
        // if (lastNoteName === note.name) {
        //   setNote(note);
        // } else {
        //   setLastNoteName(note.name);
        // }
      };
    }
    init();
  }, []);

  useEffect(() => {
    console.log('NOTE STATE', note);
  }, [note]);

  return (
    <View style={style.body}>
      <StatusBar backgroundColor="#000" translucent />
      <Meter cents={note.cents} />
      <Note {...note} />
      <Text style={style.frequency}>
        {note.frequency.toFixed(1)} Hz
      </Text>
    </View>
  );
};

const style = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  frequency: {
    fontSize: 28,
    color: "#37474f",
  },
});

export default App;