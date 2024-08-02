import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { router, usePathname } from 'expo-router'

const SearchInput = ({ initialQuery }) => {
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery || '');
    return (

        <View className="w-full h-16 px-4 bg-black-100 border-2 border-purple-500 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
            <TextInput
                className="text-base mt-0.5 flex-1 font-pregular text-white "
                placeholder="search some videos"
                placeholderTextColor="#7b7b8b"
                onChangeText={(e) => setQuery(e)}

            />

            <TouchableOpacity
                onPress={() => {
                    if (!query) {
                        return Alert.alert("Missing Query", "Please input something")
                    }
                    if (pathname.startsWith('/search')) {
                        router.setParams({ query })
                    } else {
                        router.push(`/search/${query}`)
                    }
                }
                }>
                <Image source={icons.search} className="w-5 h-5" resizeMode='contain' />
            </TouchableOpacity>

        </View>


    )
}

export default SearchInput