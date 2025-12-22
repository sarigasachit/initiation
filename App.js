import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  SafeAreaView,
  Modal,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration
const HOST_PIN = '7734'; // CHANGE THIS!

const GATES = {
  1: { title: 'GATE I', answer: 'LET' },
  2: { title: 'GATE II', answer: 'US' },
  3: { title: 'GATE III', answer: 'JUDGE' },
  4: { title: 'GATE IV', answer: 'KEBAB' },
  5: { title: 'GATE V', answer: 'JIGSAW' },
  6: { title: 'GATE VI', answer: 'WHERE' },
  7: { title: 'GATE VII', answer: 'FIRE' },
  8: { title: 'GATE VIII', answer: 'LEARNED' },
  9: { title: 'GATE IX', answer: 'PATIENCE' }
};

export default function App() {
  const [progress, setProgress] = useState({
    currentGate: 1,
    completedGates: [],
    awaitingHost: false,
    gameComplete: false,
    attempts: {}
  });
  
  const [answer, setAnswer] = useState('');
  const [jigsawGrid, setJigsawGrid] = useState(Array(9).fill(''));
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Load progress on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Save progress when it changes
  useEffect(() => {
    saveProgress();
  }, [progress]);

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem('initiation_progress');
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async () => {
    try {
      await AsyncStorage.setItem('initiation_progress', JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const logAttempt = (gate, attempt, correct) => {
    const key = `gate_${gate}`;
    setProgress(prev => ({
      ...prev,
      attempts: {
        ...prev.attempts,
        [key]: [...(prev.attempts[key] || []), {
          attempt,
          correct,
          timestamp: new Date().toISOString()
        }]
      }
    }));
  };

  const checkAnswer = (gate, correctAnswer, userAnswer) => {
    const normalized = userAnswer.trim().toUpperCase();
    if (normalized === correctAnswer) {
      const successMsg = getSuccessMessage(gate);
      setFeedback({ type: 'success', message: successMsg });
      logAttempt(gate, userAnswer, true);
      
      setTimeout(() => {
        setProgress(prev => ({
          ...prev,
          awaitingHost: true,
          completedGates: [...prev.completedGates, gate]
        }));
        setAnswer('');
        setFeedback(null);
      }, 1500);
    } else {
      const errorMsg = getErrorMessage(gate);
      setFeedback({ type: 'error', message: errorMsg });
      logAttempt(gate, userAnswer, false);
    }
  };

  const getSuccessMessage = (gate) => {
    const messages = {
      1: 'Necessary.', 2: 'Together.', 3: 'Within.',
      4: 'Universal.', 5: 'Structure precedes location.',
      6: 'Located.', 7: 'Illuminated.', 8: 'Acquired.', 9: 'Complete.'
    };
    return messages[gate] || 'Correct.';
  };

  const getErrorMessage = (gate) => {
    const messages = {
      1: 'Not sufficient.', 2: 'Separated.', 3: 'External.',
      4: 'Mutable.', 5: 'Fragmented.', 6: 'Displaced.',
      7: 'Obscured.', 8: 'Innate.', 9: 'Too hasty.'
    };
    return messages[gate] || 'Not consistent.';
  };

  const hostApprove = () => {
    if (adminPin === HOST_PIN) {
      setProgress(prev => ({
        ...prev,
        currentGate: prev.currentGate + 1,
        awaitingHost: false
      }));
      setShowAdmin(false);
      setAdminPin('');
      Alert.alert('Success', 'Gate unlocked.');
    } else {
      Alert.alert('Error', 'Invalid PIN.');
    }
  };

  const resetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all progress?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setProgress({
              currentGate: 1,
              completedGates: [],
              awaitingHost: false,
              gameComplete: false,
              attempts: {}
            });
            setShowAdmin(false);
          }
        }
      ]
    );
  };

  const handleJigsawSubmit = () => {
    const hasAllPieces = ['FIRE', 'REPE', 'TITI', 'ON', 'CULT', 'URE', 'RESU', 'LT'].every(piece => 
      jigsawGrid.some(cell => cell.includes(piece.replace('|', '')))
    );
    
    if (hasAllPieces) {
      setFeedback({ type: 'success', message: 'Structure precedes location.' });
      logAttempt(5, 'CORRECT', true);
      setTimeout(() => {
        setProgress(prev => ({
          ...prev,
          awaitingHost: true,
          completedGates: [...prev.completedGates, 5]
        }));
        setJigsawGrid(Array(9).fill(''));
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: 'Fragmented.' });
      logAttempt(5, 'WRONG', false);
    }
  };

  // Render final reveal
  if (progress.gameComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.finalReveal}>
          <Text style={styles.finalSentence}>
            Let us judge kebab{'\n'}
            where fire learned patience.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render waiting screen
  if (progress.awaitingHost) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.waitingScreen}>
          <Text style={styles.waitingTitle}>Return to Saggu.</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>The gate is solved. Await approval.</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => setShowAdmin(true)}
          >
            <Text style={styles.buttonText}>Host Approval</Text>
          </TouchableOpacity>
        </View>
        <AdminModal
          visible={showAdmin}
          onClose={() => setShowAdmin(false)}
          pin={adminPin}
          setPin={setAdminPin}
          onApprove={hostApprove}
          onReset={resetProgress}
          progress={progress}
        />
      </SafeAreaView>
    );
  }

  // Render current gate
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Initiation</Text>
        
        {feedback && (
          <View style={[
            styles.feedback,
            feedback.type === 'success' ? styles.successBox : styles.errorBox
          ]}>
            <Text style={[
              styles.feedbackText,
              feedback.type === 'success' ? styles.successText : styles.errorText
            ]}>
              {feedback.message}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => setShowAdmin(true)}
        >
          <Text style={styles.adminButtonText}>⚙</Text>
        </TouchableOpacity>

        <GateContent
          gateNumber={progress.currentGate}
          answer={answer}
          setAnswer={setAnswer}
          jigsawGrid={jigsawGrid}
          setJigsawGrid={setJigsawGrid}
          onSubmit={() => {
            if (progress.currentGate === 5) {
              handleJigsawSubmit();
            } else {
              checkAnswer(progress.currentGate, GATES[progress.currentGate].answer, answer);
            }
          }}
          onComplete={() => {
            if (progress.currentGate === 9) {
              setProgress(prev => ({ ...prev, gameComplete: true }));
            }
          }}
        />
      </ScrollView>

      <AdminModal
        visible={showAdmin}
        onClose={() => setShowAdmin(false)}
        pin={adminPin}
        setPin={setAdminPin}
        onApprove={hostApprove}
        onReset={resetProgress}
        progress={progress}
      />
    </SafeAreaView>
  );
}

// Gate Content Component
function GateContent({ gateNumber, answer, setAnswer, jigsawGrid, setJigsawGrid, onSubmit }) {
  if (gateNumber === 5) {
    return <Gate5 grid={jigsawGrid} setGrid={setJigsawGrid} onSubmit={onSubmit} />;
  }

  const gates = {
    1: <Gate1 />,
    2: <Gate2 />,
    3: <Gate3 />,
    4: <Gate4 />,
    6: <Gate6 />,
    7: <Gate7 />,
    8: <Gate8 />,
    9: <Gate9 />
  };

  return (
    <>
      {gates[gateNumber]}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter the word"
          value={answer}
          onChangeText={setAnswer}
          autoCapitalize="characters"
          autoCorrect={false}
          onSubmitEditing={onSubmit}
        />
        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

// Individual Gates
function Gate1() {
  return (
    <>
      <Text style={styles.gateTitle}>GATE I</Text>
      <View style={styles.gateContent}>
        <Text style={styles.gateText}>
          This gate opens when you speak the word that grants passage.{'\n\n'}
          The word permits.{'\n'}
          The word allows.{'\n'}
          The word is the answer to its own constraint.{'\n\n'}
          What single word grants permission to continue?
        </Text>
      </View>
    </>
  );
}

function Gate2() {
  return (
    <>
      <Text style={styles.gateTitle}>GATE II</Text>
      <View style={styles.gateContent}>
        <Text style={styles.gateText}>
          Two minds.{'\n'}
          One answer.{'\n'}
          No communication required.{'\n\n'}
          You and the host exist in relation.{'\n'}
          What word describes this relation?{'\n\n'}
          Not "I".{'\n'}
          Not "you".{'\n'}
          What remains?
        </Text>
      </View>
    </>
  );
}

function Gate3() {
  return (
    <>
      <Text style={styles.gateTitle}>GATE III</Text>
      <View style={styles.gateContent}>
        <Text style={styles.gateText}>
          Consider what lies within your control:{'\n\n'}
          • The weather tomorrow{'\n'}
          • Your reputation among strangers{'\n'}
          • The outcome of chance{'\n'}
          • Your interpretation of events{'\n'}
          • The actions of others{'\n'}
          • Your physical appearance{'\n'}
          • Your chosen response{'\n'}
          • The passage of time{'\n'}
          • Your evaluation of worth{'\n\n'}
          Remove all that is external.{'\n'}
          Remove all that fortune dictates.{'\n'}
          Remove all that others determine.{'\n\n'}
          What single action remains absolutely within your power?
        </Text>
      </View>
    </>
  );
}

function Gate4() {
  return (
    <>
      <Text style={styles.gateTitle}>GATE IV</Text>
      <View style={styles.gateContent}>
        <Text style={styles.gateText}>
          Languages transform meaning across borders.{'\n\n'}
          "Water" becomes "Wasser" becomes "eau" becomes "agua".{'\n'}
          "Friend" becomes "Freund" becomes "ami" becomes "amigo".{'\n'}
          "Love" becomes "Liebe" becomes "amour" becomes "amor".{'\n\n'}
          Yet some words resist transformation.{'\n'}
          They pass unchanged through linguistic boundaries.{'\n'}
          They preserve their form across continents.{'\n\n'}
          Consider a word that names:{'\n'}
          • Meat on a skewer{'\n'}
          • Cooked over sustained heat{'\n'}
          • Found from Berlin to Bangkok{'\n'}
          • Spelled identically in a dozen tongues{'\n\n'}
          What is this invariant word?
        </Text>
      </View>
    </>
  );
}

function Gate5({ grid, setGrid, onSubmit }) {
  const tiles = ['FI|RE', 'RE|PE', 'TI|TI', 'ON', 'CUL|T', 'URE', '→ RE|SU', 'LT', '↓'];
  
  const selectTile = (tile) => {
    const emptyPos = grid.findIndex(c => !c);
    if (emptyPos !== -1) {
      const newGrid = [...grid];
      newGrid[emptyPos] = tile;
      setGrid(newGrid);
    }
  };

  return (
    <>
      <Text style={styles.gateTitle}>GATE V</Text>
      <View style={styles.gateContent}>
        <Text style={styles.gateText}>
          Nine fragments.{'\n'}
          One structure.{'\n'}
          No imagery.{'\n\n'}
          Arrange the tiles to reveal coherent meaning.{'\n'}
          The structure precedes the word.
        </Text>

        <View style={styles.jigsawGrid}>
          {grid.map((cell, i) => (
            <View key={i} style={styles.jigsawCell}>
              <Text style={styles.jigsawCellText}>{cell || (i + 1)}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.gateText, { fontSize: 12, marginTop: 15 }]}>
          Available tiles:
        </Text>
        <View style={styles.tileContainer}>
          {tiles.map((tile, i) => (
            <TouchableOpacity
              key={i}
              style={styles.tile}
              onPress={() => selectTile(tile)}
            >
              <Text style={styles.tileText}>{tile}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Submit Arrangement</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setGrid(Array(9).fill(''))}
        >
          <Text style={styles.buttonText}>Clear Grid</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

function Gate6() {
  return (
    <>
      <Text style={styles.gateTitle}>GATE VI</Text>
      <View style={styles.gateContent}>
        <Text style={styles.gateText}>
          Location is not coordinates.{'\n'}
          Place is not a point on a map.{'\n\n'}
          Fire transforms through repetition.{'\n'}
          Repetition creates culture.{'\n'}
          Culture resides in place.{'\n\n'}
          The question precedes the answer.{'\n'}
          The inquiry precedes the destination.{'\n\n'}
          What single word asks for location without demanding latitude?{'\n'}
          What word seeks place through relation rather than position?
        </Text>
      </View>
    </>
  );
}

function Gate7() {
  return (
    <>
      <Text style={styles.gateTitle}>GATE VII</Text>
      <View style={styles.gateContent}>
        <Text style={styles.gateText}>
          Look beyond the surface.{'\n'}
          Some truths hide in plain sight.
        </Text>
        <Text style={styles.preText}>
          {`╔═══════════════════════════╗
║ F ░ I ░ R ░ E ░ ░ ░ ░ ░ ░ ║
║ ░ L ░ A ░ M ░ E ░ ░ ░ ░ ░ ║
║ ░ ░ H ░ E ░ A ░ T ░ ░ ░ ░ ║
║ ░ ░ ░ B ░ U ░ R ░ N ░ ░ ░ ║
║ ░ ░ ░ ░ I ░ G ░ N ░ I ░ T ║
║ ░ ░ ░ ░ ░ L ░ O ░ W ░ ░ ░ ║
╚═══════════════════════════╝`}
        </Text>
        <Text style={styles.gateText}>
          {'\n'}Read the diagonal.{'\n'}
          Not the noise.{'\n'}
          What element appears?
        </Text>
      </View>
    </>
  );
}

function Gate8() {
  return (
    <>
      <Text style={styles.gateTitle}>GATE VIII</Text>
      <View style={styles.gateContent}>
        <Text style={styles.gateText}>
          Knowledge comes in two forms:{'\n\n'}
          <Text style={{ fontWeight: 'bold' }}>KNOWN</Text> = possessed from the start, innate, given{'\n'}
          <Text style={{ fontWeight: 'bold' }}>?</Text> = acquired through experience, earned through repetition{'\n\n'}
          A child knows hunger.{'\n'}
          A child _______ to walk.{'\n\n'}
          A bird knows flight.{'\n'}
          A bird _______ its territory.{'\n\n'}
          Fire knows heat.{'\n'}
          Patience is _______.{'\n\n'}
          What verb describes knowledge gained only through time?{'\n'}
          What word means "acquired through repeated experience"?{'\n\n'}
          <Text style={{ fontStyle: 'italic' }}>Past tense. One word.</Text>
        </Text>
      </View>
    </>
  );
}

function Gate9() {
  return (
    <>
      <Text style={styles.gateTitle}>GATE IX</Text>
      <View style={styles.gateContent}>
        <Text style={styles.gateText}>
          <Text style={{ fontWeight: 'bold' }}>CONSTRAINTS:</Text>{'\n\n'}
          1. Eight letters.{'\n'}
          2. Contains exactly three vowels.{'\n'}
          3. First letter: P{'\n'}
          4. Last letter: E{'\n'}
          5. The word describes a quality required to solve this very puzzle.{'\n'}
          6. It cannot be achieved through force.{'\n'}
          7. It grows only through sustained practice.{'\n'}
          8. Fire teaches it to meat.{'\n\n'}
          What word satisfies all constraints?
        </Text>
      </View>
    </>
  );
}

// Admin Modal
function AdminModal({ visible, onClose, pin, setPin, onApprove, onReset, progress }) {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Host Panel</Text>
          
          <Text style={styles.modalText}>Current Gate: {progress.currentGate}</Text>
          <Text style={styles.modalText}>
            Completed: {progress.completedGates.join(', ') || 'None'}
          </Text>

          {progress.awaitingHost && (
            <View style={{ marginTop: 20 }}>
              <TextInput
                style={styles.input}
                placeholder="Enter PIN"
                value={pin}
                onChangeText={setPin}
                secureTextEntry
                keyboardType="number-pad"
              />
              <TouchableOpacity style={styles.button} onPress={onApprove}>
                <Text style={styles.buttonText}>Approve & Unlock</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={onReset}
          >
            <Text style={styles.buttonText}>Reset Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => setShowAnswers(!showAnswers)}
          >
            <Text style={styles.buttonText}>
              {showAnswers ? 'Hide' : 'Show'} Answers
            </Text>
          </TouchableOpacity>

          {showAnswers && (
            <View style={styles.answersBox}>
              {Object.entries(GATES).map(([num, gate]) => (
                <Text key={num} style={styles.answerText}>
                  Gate {num}: {gate.answer}
                </Text>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2c3e50',
    fontFamily: 'Georgia',
  },
  gateTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
    borderBottomWidth: 2,
    borderBottomColor: '#2c3e50',
    paddingBottom: 10,
    fontFamily: 'Georgia',
  },
  gateContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gateText: {
    fontSize: 16,
    lineHeight: 28,
    color: '#2c3e50',
    fontFamily: 'Georgia',
  },
  preText: {
    fontFamily: 'Courier New',
    fontSize: 12,
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 6,
    marginVertical: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    fontSize: 18,
    fontFamily: 'Courier New',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 18,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
  },
  secondaryButton: {
    backgroundColor: '#95a5a6',
  },
  feedback: {
    padding: 15,
    borderRadius: 6,
    marginBottom: 15,
    borderWidth: 2,
  },
  feedbackText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successBox: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  successText: {
    color: '#155724',
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  errorText: {
    color: '#721c24',
  },
  infoBox: {
    backgroundColor: '#d1ecf1',
    borderColor: '#bee5eb',
    borderWidth: 2,
    padding: 15,
    borderRadius: 6,
    marginVertical: 30,
  },
  infoText: {
    color: '#0c5460',
    textAlign: 'center',
    fontSize: 16,
  },
  adminButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#95a5a6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  adminButtonText: {
    fontSize: 24,
    color: 'white',
  },
  waitingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  waitingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 20,
    fontFamily: 'Georgia',
  },
  finalReveal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  finalSentence: {
    fontSize: 26,
    lineHeight: 50,
    textAlign: 'center',
    color: '#2c3e50',
    fontWeight: 'bold',
    fontFamily: 'Georgia',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Georgia',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#2c3e50',
  },
  answersBox: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  answerText: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'Courier New',
  },
  jigsawGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    marginBottom: 20,
  },
  jigsawCell: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  jigsawCellText: {
    fontFamily: 'Courier New',
    fontSize: 14,
    textAlign: 'center',
  },
  tileContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tile: {
    padding: 12,
    margin: 5,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: 'white',
  },
  tileText: {
    fontFamily: 'Courier New',
    fontSize: 12,
    textAlign: 'center',
  },
});
