import Recording from "react-native-recording";
import PitchFinder from "pitchfinder";

export default class Tuner {
  sampleRate: number;
  bufferSize: number;
  pitchFinder = PitchFinder.YIN({ sampleRate: 44100 });
  onNoteDetected: any;
  middleA = 440;
  semitone = 69;
  noteStrings = [
    "C",
    "C♯",
    "D",
    "D♯",
    "E",
    "F",
    "F♯",
    "G",
    "G♯",
    "A",
    "A♯",
    "B",
  ];

  constructor(sampleRate = 44100, bufferSize = 4096) {
    this.sampleRate = sampleRate;
    this.bufferSize = bufferSize;
    this.pitchFinder = PitchFinder.YIN({ sampleRate: this.sampleRate });
  }



  start() {
    Recording.init({
      sampleRate: this.sampleRate,
      bufferSize: this.bufferSize,
      bitsPerChannel: 16,
      channelsPerFrame: 1,
    });
    Recording.start();
    Recording.addRecordingEventListener((data: any) => {
      const frequency = this.pitchFinder(data);
      console.log('FREQUENCY', frequency);
      if (frequency && this.onNoteDetected) {
        const note = this.getNote(frequency);
        console.log('NOTE', note);
        this.onNoteDetected({
          name: this.noteStrings[note % 12],
          value: note,
          cents: this.getCents(frequency, note),
          octave: Number(note / 12) - 1,
          frequency: frequency,
        });
      }
    });
  }

  /**
   * get musical note from frequency
   *
   * @param {number} frequency
   * @returns {number}
   */
  getNote(frequency: number) {
    console.log('GET NOTE', frequency);
    const note = 12 * (Math.log(frequency / this.middleA) / Math.log(2));
    const res = Math.round(note) + this.semitone;
    console.log('GET NOTE RES', res);
    return res;
  }

  /**
   * get the musical note's standard frequency
   *
   * @param note
   * @returns {number}
   */
  getStandardFrequency(note: number) {
    const res = this.middleA * Math.pow(2, (note - this.semitone) / 12);
    console.log('STANDARD', res);
    return res;
  }

  /**
   * get cents difference between given frequency and musical note's standard frequency
   *
   * @param {float} frequency
   * @param {int} note
   * @returns {int}
   */
  getCents(frequency: number, note: number) {
    console.log('GET CENTS', frequency, note);
    const res = Math.floor(
      (1200 * Math.log(frequency / this.getStandardFrequency(note))) /
        Math.log(2));
    console.log('GET CENTS RES', res);
    return res;
  }
}