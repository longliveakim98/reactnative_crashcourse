import { View, Text, FlatList, TouchableOpacity, Image, Alert, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Empty from '../../components/Empty'
import { getUserPosts, signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppWrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'
import { router } from 'expo-router'
import { useState } from 'react'

const Profile = () => {

    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));

    const logout = async () => {
        await signOut();
        setUser(null);
        setIsLoggedIn(false);
        Alert.alert("Signing Out", "Signed out successfully")
        router.replace('/sign_in')
    }

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }


    return (
        <SafeAreaView className="bg-primary  h-full ">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard video={item} />
                )}
                ListHeaderComponent={() => (
                    <View className="w-full justify-center items-center mt-6 mb-12 px-4 ">
                        <TouchableOpacity className="w-full items-end mb-10" onPress={logout}>
                            <Image source={icons.logout} resizeMode='contain' className="w-6 h-6" />
                        </TouchableOpacity>
                        <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                            <Image source={{ uri: user?.avatar }} className="w-[90%] h-[90%] rounded-lg" resizeMode='cover' />
                        </View>
                        <InfoBox
                            title={user?.username || ""}
                            containerStyles="mt-5"
                            titleStyle="text-lg"
                        />
                        <View className="mt-5 flex-row">
                            <InfoBox
                                title={posts.length || 0}
                                subtitle="Posts"
                                containerStyles="mr-10"
                                titleStyle="text-xl"
                            />
                            <InfoBox
                                title="1.2k"
                                subtitle="Followers"

                                titleStyle="text-xl"
                            />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <Empty
                        title="No videos found"
                        subtitle="No videos found for this search query"
                    />
                )}
                refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
            />
        </SafeAreaView>
    )
}

export default Profile