import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image} from 'react-native';
import ImageViewer from './Components/ImageViewer';
import Button from './Components/Button';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import IconButton from './Components/IconButton';
import CircleButton from './Components/CircleButton';
import EmojiPicker from './Components/EmojiPicker';
import EmojiList from './Components/EmojiList';
import EmojiSticker from './Components/EmojiSticker';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

export default function App() {
  const Placeholderimages = require('./assets/teste.webp')
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const imageRef = useRef();

  if (status === null) {
    requestPermission();
  }
  
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOptions(false)
  }
 
  const onAddSticker = () => {
    setIsModalVisible(true)
  }

  const onModalClose = () => {
    setIsModalVisible(false);
  };
  
  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("Saved!");
      }
    } catch (e) {
      console.log(e);
    }
  };
  
  return (
    <GestureHandlerRootView style={styles.container}>
    <View style={styles.container}>
      <View style={styles.imageContainer} collapsable={false}>
        <ImageViewer PlaceHolderImageSource={Placeholderimages} selectedImage={selectedImage}/>
        {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji}/>}
      </View>
      { showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
              <IconButton icon='refresh' label='atualizar' onPress={onReset}/>
              <CircleButton onPress={onAddSticker}/>
              <IconButton icon='save-alt' label='salvar' onPress={onSaveImageAsync}/>
          </View>
        </View>
      ) : (
      <View style={styles.footerContainer}>
        <Button theme="primary" label='Escolha uma foto' onPress={pickImageAsync}/>
        <Button label='Use essa foto' onPress={ () => setShowAppOptions(true)}/>
      </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
      <StatusBar style="light" />
    </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    color:'#fff',
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
