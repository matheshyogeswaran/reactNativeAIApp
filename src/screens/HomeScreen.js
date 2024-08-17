import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Voice from '@react-native-community/voice';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import Features from '../components/Features';
import Tts from 'react-native-tts';
import { Platform } from 'react-native';
// Replace with your API keys
const geminiApiKey = ''; // Gemini API key
const pexelsApiKey = ''; // Pexels API key

const geminiClient = axios.create({
  headers: {
    'x-goog-api-key': geminiApiKey,
    'Content-Type': 'application/json',
  },
});

const pexelsClient = axios.create({
  headers: {
    'Authorization': `Bearer ${pexelsApiKey}`,
  },
});

const geminiEndpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
const pexelsEndpoint = 'https://api.pexels.com/v1/search';

const HomeScreen = () => {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(true);

  const speechStartHandler = () => console.log('Speech started');
  const speechEndHandler = () => {
    setRecording(false);
    console.log('Speech ended');
  };
  const speechResultsHandler = async (results) => {
    const text = results.value[0];
    console.log('Voice result:', text);
    await handleUserMessage(text);  // Call function to handle the message
  };
  const speechErrorHandler = (error) => console.log('Speech error:', error);

  const startRecording = async () => {
    setRecording(true);
    try {
      await Voice.start('en-GB');
    } catch (error) {
      console.log('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
    } catch (error) {
      console.log('Error stopping recording:', error);
    }
  };

  // Handle user messages
  const handleUserMessage = async (text) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: text },
    ]);

    console.log('Handling user message:', text);

    try {
      const response = await geminiClient.post(geminiEndpoint, {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Does this message want to generate a picture, image, art, or anything asking for an image? ${text}. Simply answer with yes or no.`
              }
            ]
          }
        ]
      });

      const content = response.data.candidates[0].content.parts[0].text;
      console.log('Gemini response content:', content);

      if (content.toLowerCase().includes('yes')) {
        const imageUrl = await callPexelsApi(text);
        console.log('Image URL from Pexels:', imageUrl);
        if (imageUrl) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'assistant', content: imageUrl },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'assistant', content: 'I can get the image for you after 5 minutes. Please try again later.' },
          ]);
        }
      } else {
        const responseText = await handleNoImageResponse(text);
        console.log('Response text:', responseText);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'assistant', content: responseText },
        ]);
        startTextToSpeech(responseText);
      }
    } catch (error) {
      console.error('Error handling user message:', error);
    }
  };



  
  const startTextToSpeech = (message) => {
    if (Tts && typeof Tts.speak === 'function') {
      if (!message.includes('https')) {
        console.log('Speaking:', message);
  
        const commonOptions = {
          rate: 0.5,
        };
  
        const platformSpecificOptions = Platform.select({
          ios: {
            ...commonOptions,
            iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
          },
          android: {
            ...commonOptions,
            androidParams: {
              KEY_PARAM_PAN: -1,
              KEY_PARAM_VOLUME: 0.5,
              KEY_PARAM_STREAM: 'STREAM_MUSIC',
            },
          },
        });
  
        Tts.speak(message, platformSpecificOptions);
      }
    } else {
      console.log('TTS is not initialized or is unavailable.');
    }
  };
  

  const callPexelsApi = async (query) => {
    try {
      const response = await pexelsClient.get(pexelsEndpoint, {
        params: {
          query: query,
          per_page: 1,
        },
      });
      console.log("Pexels API Response:", response.data);
      const imageUrl = response.data.photos[0]?.src?.original;
      if (imageUrl) {
        console.log("Image URL:", imageUrl);
        return imageUrl;
      } else {
        console.log('No images found for query:', query);
        return null;
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('Error calling Pexels API: Unauthorized (401)');
      } else {
        console.log('Error calling Pexels API:', error);
      }
      return null; // Ensure that null is returned if there's an error
    }
  };

  const handleNoImageResponse = async (prompt) => {
    try {
      const response = await geminiClient.post(geminiEndpoint, {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      });
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.log('Error handling non-image response:', error);
      return 'Sorry, I could not process your request.';
    }
  };

  const clearMessages = () => setMessages([]);

  const stopSpeaking = () => {
    if(speaking){
    setSpeaking(false)
    Tts.stop();
    }
  };

  useEffect(() => {
    const initTts = async () => {
      try {
        await Tts.setDefaultLanguage('en-GB');
        await Tts.setDefaultRate(0.5, true);
        console.log('TTS initialized successfully');
      } catch (error) {
        console.log('TTS initialization error:', error);
      }
    };

    initTts();

    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    Tts.addEventListener('tts-start', (event) => console.log("start", event));
    Tts.addEventListener('tts-progress', (event) => console.log("progress", event));
    Tts.addEventListener('tts-finish', (event) => console.log("finish", event));
    Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      Tts.removeAllListeners();  // Ensure all TTS listeners are removed
    };
  }, []);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 mx-5">
        <View className="flex-row justify-center mb-4">
          <Text className="text-center text-gray-700 font-bold text-4xl mt-5">
            Jarvis
          </Text>
        </View>
        {messages.length > 0 ? (
          <View className="flex-1 mb-4">
            <Text className="text-gray-700 font-semibold text-2xl mb-2">
              Assistant
            </Text>
            <View className="flex-1 bg-neutral-200 rounded-3xl p-4">
              <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                {messages.map((message, index) => (
                  <View
                    key={index}
                    className={`flex-row ${message?.role === 'assistant' ? 'justify-start' : 'justify-end'} mb-2`}
                  >
                    <View
                      className={`p-2 rounded-2xl ${message?.role === 'assistant' ? 'bg-emerald-100' : 'bg-white'} ${message?.content.includes('https') ? 'bg-emerald-100' : ''}`}
                    >
                      {message?.content.includes('https') ? (
                        <Image
                          source={{ uri: message?.content }}
                          className="w-60 h-60 rounded-2xl"
                          resizeMode="contain"
                        />
                      ) : (
                        <Text>{message?.content}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )}
        <View className="flex justify-center items-center mb-2 mt-5">
          {recording ? (
            <TouchableOpacity onPress={stopRecording}>
              <Image
                source={require('../../assets/images/ani1.gif')}
                className="w-10 h-10 rounded-full"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording}>
              <Image
                source={require('../../assets/images/rec.jpg')}
                className="w-10 h-10 rounded-full"
              />
            </TouchableOpacity>
          )}
          {messages.length > 0 && (
            <TouchableOpacity
              onPress={clearMessages}
              className="bg-neutral-400 rounded-3xl p-2 absolute right-10"
            >
              <Text className="text-white font-semibold">Clear</Text>
            </TouchableOpacity>
          )}
          {speaking && (
            <TouchableOpacity
              onPress={stopSpeaking}
              className="bg-red-400 rounded-3xl p-2 absolute left-10"
            >
              <Text className="text-white font-semibold">Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
