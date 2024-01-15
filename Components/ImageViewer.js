import { StyleSheet, Image } from 'react-native';

export default function ImageViewer({PlaceHolderImageSource, selectedImage}){
    const imageSource = selectedImage ? { uri: selectedImage} : PlaceHolderImageSource
    return(
        <Image source={imageSource} style={style.image}/>
    )
}

const style = StyleSheet.create({
    image:{
        width: 320,
        height: 440,
        borderRadius: 18,
    }
})