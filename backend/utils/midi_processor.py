import glob
import os
import pickle
import numpy as np
from music21 import converter, instrument, note, chord

def get_notes(dataset_path: str):
    """
    Parses all MIDI files in a directory and extracts a sequence of notes/chords.
    """
    notes = []
    
    # Check if dataset path exists
    if not os.path.exists(dataset_path):
        return notes

    midi_files = glob.glob(f"{dataset_path}/*.mid") + glob.glob(f"{dataset_path}/*.midi")
    
    for file in midi_files:
        try:
            midi = converter.parse(file)
            print(f"Parsing {file}")

            notes_to_parse = None
            try:
                # Given a single stream, extract the parts
                s2 = instrument.partitionByInstrument(midi)
                notes_to_parse = s2.parts[0].recurse() 
            except: # file has notes in a flat structure
                notes_to_parse = midi.flat.notes

            for element in notes_to_parse:
                if isinstance(element, note.Note):
                    notes.append(str(element.pitch))
                elif isinstance(element, chord.Chord):
                    notes.append('.'.join(str(n) for n in element.normalOrder))
        except Exception as e:
            print(f"Error parsing {file}: {str(e)}")

    return notes

def prepare_sequences(notes, n_vocab, sequence_length=100):
    """
    Prepare the sequences used by the Neural Network
    """
    # get all pitch names
    pitches = sorted(set(item for item in notes))
    
    # create a dictionary to map pitches to integers
    note_to_int = dict((note, number) for number, note in enumerate(pitches))

    network_input = []
    network_output = []

    # create input sequences and the corresponding outputs
    for i in range(0, len(notes) - sequence_length, 1):
        sequence_in = notes[i:i + sequence_length]
        sequence_out = notes[i + sequence_length]
        network_input.append([note_to_int[char] for char in sequence_in])
        network_output.append(note_to_int[sequence_out])

    n_patterns = len(network_input)

    # reshape the input into a format compatible with LSTM layers
    network_input_reshaped = np.reshape(network_input, (n_patterns, sequence_length, 1))
    
    # normalize input
    network_input_reshaped = network_input_reshaped / float(n_vocab)

    # mock to_categorical
    network_output_mock = np.zeros((len(network_output), n_vocab))
    for i, val in enumerate(network_output):
        network_output_mock[i, val] = 1.0

    return network_input_reshaped, network_output_mock, network_input, note_to_int
