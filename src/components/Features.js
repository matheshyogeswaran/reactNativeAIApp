import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const Features = () => {
    return (
        <View style={{ height: hp(60) }} className="space-y-4">
            <Text style={{ fontSize: wp(6.5) }} className="font-semibold text-gray-700">features</Text>

            <View className="bg-emerald-200 p-4 rounded-xl space-y-2">
                <View className="flex-row items-center space-x-1">
                    <Image source={require('../../assets/images/gemini.png')} style={{ width: hp(4), height: hp(4) }} />
                    <Text style={{ fontSize: wp(4.8) }} className="font-semibold text-gray-700">Gemini</Text>
                </View>
                <Text style={{ fontSize: wp(3.8) }} className="font-medium text-gray-700">
                Google Gemini is an AI language model by Google, designed for generating and understanding human-like text across various applications.
                </Text>

            </View>
            
            <View className="bg-purple-200 p-4 rounded-xl space-y-2">
                <View className="flex-row items-center space-x-1">
                    <Image source={require('../../assets/images/pexel.png')} style={{ width: hp(4), height: hp(4) }} />
                    <Text style={{ fontSize: wp(4.8) }} className="font-semibold text-gray-700">Pexels</Text>
                </View>
                <Text style={{ fontSize: wp(3.8) }} className="font-medium text-gray-700">
                Pexels is a free stock photo and video website offering high-quality, royalty-free images and videos for personal and commercial use.
                </Text>

            </View>
            
            <View className="bg-cyan-200 p-4 rounded-xl space-y-2">
                <View className="flex-row items-center space-x-1">
                    <Image source={require('../../assets/images/AI.png')} style={{ width: hp(4), height: hp(4) }} />
                    <Text style={{ fontSize: wp(4.8) }} className="font-semibold text-gray-700">Smart-AI</Text>
                </View>
                <Text style={{ fontSize: wp(3.8) }} className="font-medium text-gray-700">
                    ChatGPT is an AI language model designed to engage in conversation with users like you.
                </Text>

            </View>
        </View>
    )
}

export default Features

const styles = StyleSheet.create({})
