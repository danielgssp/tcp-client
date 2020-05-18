import React, {useState} from 'react';
import TcpSocket from 'react-native-tcp-socket';
import {Text, StyleSheet, Button, View, TextInput} from 'react-native';

const App = () => {
  const serverPort = 5000;
  const serverHost = '192.168.0.103';

  const [errorStatus, setErrorStatus] = useState({});
  const [textInput, setTextInput] = useState('');
  const [status, setStatus] = useState({});

  function clientConfig(text = '') {
    const client = TcpSocket.createConnection(
      {
        port: serverPort,
        host: serverHost,
      },
      (address) => {
        setStatus(address);
        console.log('opened client on ' + JSON.stringify(address));
        client.write(text);
      },
    );

    client.on('data', (data) => {
      console.log('Client Received: ' + data);
      client.destroy(); // kill client after server's response
    });

    client.on('error', (error) => {
      setErrorStatus({backgroundColor: 'red'});
      console.log('client error ' + error);
    });

    client.on('close', (error) => {
      if (error.hadError !== true) {
        setErrorStatus({backgroundColor: 'green'});
      }
      console.log('client closed');
    });
  }

  function delay() {
    let count = 0;
    setInterval(() => {
      count = count + 1;
      clientConfig('test ' + count);
    }, 250);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Send a message to the server</Text>

      <View style={styles.containerForm}>
        <TextInput
          style={styles.input}
          onChangeText={(txt) => setTextInput(txt)}
          value={textInput}
        />
        <Button title={'send'} onPress={() => clientConfig(textInput)} />
      </View>

      <View style={styles.containerStatus}>
        <Text>
          Status - <View style={[styles.status, errorStatus]} />
        </Text>
        <Text>Address - {status.address}</Text>
        <Text>PortCon - {status.port}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  containerForm: {
    marginHorizontal: 50,
    marginVertical: 10,
  },
  containerStatus: {
    marginHorizontal: 50,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    marginVertical: 10,
  },
  status: {
    width: 20,
    height: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 25,
  },
});

export default App;
