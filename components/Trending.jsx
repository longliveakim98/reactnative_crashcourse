import { useState } from 'react';
import { FlatList, TouchableOpacity, ImageBackground, Image, View, Button } from 'react-native'
import * as Animatable from 'react-native-animatable';
import { icons } from '../constants';
import { Video, ResizeMode, } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';

const zoomIn = {
    0: {
        scale: 0.9,
    },
    1: {
        scale: 1.1,
    },
}

const zoomOut = {
    0: {
        scale: 1,
    },
    1: {
        scale: 0.9,
    },
}

const TrendingItem = ({ activeItem, item }) => {
    const [play, setPlay] = useState(false);

    const handlePlay = () => {
        setPlay(true);
    };

    const handlePlaybackStatusUpdate = async (status) => {
        if (status.didJustFinish) {
            setPlay(false);
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        }
    };

    const handleFullscreenUpdate = async ({ fullscreenUpdate }) => {

        if (fullscreenUpdate === 1) {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.ALL);
        } else if (fullscreenUpdate === 2) {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        }
    };

    return (
        <Animatable.View
            className="mx-2.5"
            animation={activeItem === item.$id ? zoomIn : zoomOut}
            duration={500}
        >
            {play ? (
                <View>
                    <Video
                        source={{ uri: item.video }}
                        className="w-52 h-72 rounded-[33px] mt-3 bg-black border-1 border-white/10"
                        resizeMode={ResizeMode.CONTAIN}
                        useNativeControls
                        shouldPlay
                        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                        onFullscreenUpdate={handleFullscreenUpdate}
                    />
                </View>
            ) : (
                <TouchableOpacity
                    className="relative justify-center items-center"
                    activeOpacity={0.7}
                    onPress={handlePlay}
                >
                    <ImageBackground source={{ uri: item.thumbnail }} className=" w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40" />
                    <Image source={icons.play} className="w-12 h-12 absolute" resizeMode='contain' />
                </TouchableOpacity>
            )}
        </Animatable.View>
    )
}

const Trending = ({ posts }) => {
    const [activeItem, setActiveItem] = useState(posts[0])
    const viewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveItem(viewableItems[0].key)
        }
    }
    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
                <TrendingItem activeItem={activeItem} item={item} />
            )}
            horizontal
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 70
            }}
            contentOffset={{ x: 170 }}
        />
    )
}

export default Trending