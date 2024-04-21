import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Features from '../components/Features';
import { dummyMessages } from '../constants';
import Voice from '@react-native-community/voice';
const HomeScreen = () => {
  const [messages, setMessages] = useState(dummyMessages);
  const [recording,setRecordings] = useState(false);
  const [speaking,setSpeaking] = useState(true);

  const speechStartHandler = () => {
    console.log('start speech');
  };

  const speechEndHandler = () => {
    setRecordings(false);
    console.log('end speech');
  };
  const speechResultsHandler = (results) => {
    console.log("voiv",results);
    
  };
  const speechErrorHandler = (error) => {
    console.log("error",error);
  };

  const startRecording = async () => {
    setRecordings(true);
    try{
      await Voice.start('en-GB');

    }catch(error){
      console.log(error);

    }
  }
  const stopRecording = async () => {
  
    try{
      await Voice.stop();
      setRecordings(false);
      //fetch from chatgpt

    }catch(error){
      console.log(error);

    }
  }

  const clear = () => { setMessages([])};
  const stopSpeack = ( )=>{
    setSpeaking(false);
  }

  useEffect(() => {
    //voice handler
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    return ()=>{
      //destroy 
      Voice.destroy().then(Voice.removeAllListeners);
    }
  },[])
  return (
    <View className="flex-1 bg-white ">
      <SafeAreaView className="flex-1 flex mx-5">
        <View className="flex-row justify-center">
          {/* <Image source={require('../../assets/images/AIlOGO.jpg')}  style={{height:hp(40),width:wp(70)}}/> */}
          <Text style={{ fontSize: wp(10) }} className="text-center font-bold text-gray-700">
            Jarvis
          </Text>
        </View>

        {
          messages.length > 0 ? (
            <View className="space-y-2 flex-1">
              <Text className="text-gray-700 font-semibold ml-1" style={{ fontSize: wp(5) }}>
                Assistant
              </Text>
              <View style={{ height: hp(58) }} className="bg-neutral-200 rounded-3xl p-4" >
                <ScrollView bounces={false} className="space-y-2" showsVerticalScrollIndicator={false}>
                  {
                    messages.map((message, index) => {
                      if (message.role == "assistant") {
                        if (message.content.includes('https')) {
                          //ai image
                          return (<View key={index} className="flex-row justify-start">
                            <View className="p-2 flex rounded-2xl bg-emerald-100 rounded-tl-none">

                              <Image
                                source={{ uri: message.content }}
                                className="rounded-2xl"
                                resizeMode='contain'
                                style={{ width: wp(60), height: wp(60) }} />
                            </View>
                          </View>)

                        } else {
                          //text 
                          return (

                            <View key={index}
                              style={{ width: wp(70) }}
                              className="bg-emerald-100 rounded-xl rounded-tl-none p-2">
                              <Text>{message.content}</Text>
                            </View>

                          )
                        }
                      } else {
                        //user input
                        return (
                          <View key={index} className="flex-row justify-end">
                            <View style={{ width: wp(70) }}
                              className="bg-white rounded-xl rounded-tr-none p-2">
                              <Text>{message.content}</Text>
                            </View>
                          </View>
                        )
                      }

                      // return (
                      //   <View>
                      //     <Text>{message.content}</Text>
                      //   </View>
                      // )
                    })
                  }
                </ScrollView>

              </View>

            </View>
          ) : (
            <Features />
          )
        }


        <View className="flex justify-center items-center mb-2">

          { recording? (
                <TouchableOpacity onPress={stopRecording}>
                <Image className="rounded-full"
                  source={require("../../assets/images/ani1.gif")}
                  style={{ width: hp(10), height: hp(10) }} />
              </TouchableOpacity>

          ):(

            <TouchableOpacity onPress={startRecording}>
            <Image className="rounded-full"
              source={require("../../assets/images/rec.jpg")}
              style={{ width: hp(10), height: hp(10) }} />
          </TouchableOpacity>
          )}

          {
            messages.length > 0 && (
              <TouchableOpacity 
              onPress={clear}
              className="bg-neutral-400 rounded-3xl p-2 absolute right-10">
                <Text className="text-white font-semibold" >
                  Clear
                </Text>
              </TouchableOpacity>
            ) 
          }
          {
           speaking && (
              <TouchableOpacity 
              onPress={stopSpeack}
              className="bg-red-400 rounded-3xl p-2 absolute left-10">
                <Text className="text-white font-semibold" >
                  Stop
                </Text>
              </TouchableOpacity>
            ) 
          }
        
        </View>

      </SafeAreaView>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})