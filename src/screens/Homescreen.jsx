import { Button, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import generateId from '../lib/generateId';

const DUMMY_DATA = [
  {
    firstName: 'Jennifer',
    id: '1',
    lastName: 'Aniston',
    occupation: 'Actress',
    age: 22,
    photoURL: require('../../assets/images/1.webp'),
  },
  {
    firstName: 'Jennie',
    id: '2',
    lastName: 'Ruby Jane',
    occupation: 'Singer',
    age: 26,
    photoURL: require('../../assets/images/2.webp'),
  },
  {
    firstName: 'Tom',
    id: '3',
    lastName: 'Holland',
    occupation: 'Actor',
    age: 27,
    photoURL: require('../../assets/images/3.webp'),
  },
  {
    firstName: 'Jack',
    id: '4',
    lastName: 'Dylan Grazer',
    occupation: 'Software Developer',
    age: 27,
    photoURL: require('../../assets/images/4.jpeg'),
  },
  {
    firstName: 'David',
    id: '5',
    lastName: 'Mazouz',
    occupation: 'Actor',
    age: 25,
    photoURL: require('../../assets/images/5.jpeg'),
  },
  {
    firstName: 'Alex',
    id: '6',
    lastName: 'Lange',
    occupation: 'Actor',
    age: 19,
    photoURL: require('../../assets/images/6.jpeg'),
  },
  {
    firstName: 'Jennifer',
    id: '7',
    lastName: 'Lawrence',
    occupation: 'Actress',
    age: 23,
    photoURL: require('../../assets/images/7.jpeg'),
  },
  {},
];
const Homescreen = () => {
  const navigation = useNavigation();
  const { logout, user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const swiperRef = useRef();

  useLayoutEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      if (!snapshot.exists()) {
        navigation.navigate('Modal');
      }
      return unsub;
    });
  }, []);

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      const passes = await getDocs(collection(db, 'users', user.uid, 'passes')).then((snapshot) =>
        snapshot.docs.map((doc) => doc.id)
      );
      const swipes = await getDocs(collection(db, 'users', user.uid, 'swipes')).then((snapshot) =>
        snapshot.docs.map((doc) => doc.id)
      );
      const passedUserIds = passes.length > 0 ? passes : ['fallback'];
      const swipedUserIds = swipes.length > 0 ? swipes : ['fallback'];

      unsub = onSnapshot(
        query(collection(db, 'users'), where('id', 'not-in', [...passedUserIds, ...swipedUserIds])),
        (snapshot) => {
          const profilesFromDB = snapshot.docs
            .filter((doc) => doc.id !== user.uid)
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
          setProfiles([...profilesFromDB, ...DUMMY_DATA]);
        }
      );
    };
    fetchCards();
    return unsub;
  }, []);

  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;
    if (!profiles[cardIndex].displayName) return;
    const userSwiped = profiles[cardIndex];
    console.log(`You swiped PASS on ${userSwiped.displayName} ${userSwiped.id}`);
    setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped);
  };

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;
    if (!profiles[cardIndex].displayName) return;
    const userSwiped = profiles[cardIndex];

    const loggedInProfile = (await getDoc(doc(db, 'users', user.uid))).data();

    // check if the user swiped on you...
    getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid)).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        //user has matched with you before you matched with them...
        //create a MATCH !!
        console.log(`Hooray, you MATCHED with ${userSwiped.displayName}`);
        setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);
        setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
          users: {
            [user.uid]: loggedInProfile,
            [userSwiped.id]: userSwiped,
          },
          usersMatched: [user.uid, userSwiped.id],
          timestamp: serverTimestamp(),
        });
        navigation.navigate('Match', {
          loggedInProfile,
          userSwiped,
        });
      } else {
        console.log(`You swiped on ${userSwiped.displayName} ${userSwiped.id}`);
        setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);
      }
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="items-center justify-between flex-row px-5">
        <TouchableOpacity onPress={logout}>
          <Image source={{ uri: user.photoURL }} className="h-10 w-10 rounded-full " />
        </TouchableOpacity>
        {}
        <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
          <Image
            source={require('../../assets/images/logo.png')}
            resizeMode="contain"
            className="h-12 w-12"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles-sharp" color="#FF5864" size={30} />
          {}
        </TouchableOpacity>
      </View>
      <View className="flex-1">
        <Swiper
          ref={swiperRef}
          cards={profiles}
          renderCard={(card, _index) =>
            card && card?.photoURL ? (
              <View className="bg-white h-[65%] rounded-xl ">
                {}
                <Image
                  source={
                    typeof card.photoURL === 'string' ? { uri: card.photoURL } : card.photoURL
                  }
                  className="h-full w-full rounded-t-xl"
                />
                <View
                  className="bg-white w-full h-20 flex-row justify-between items-center px-6 py-2 rounded-b-xl shadow-xl"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.41,
                    elevation: 2,
                  }}
                >
                  <View>
                    <Text className="text-2xl font-bold">
                      {card.displayName || card.firstName + ' ' + card.lastName}
                    </Text>
                    <Text>{card.occupation}</Text>
                  </View>
                  <Text className="text-2xl font-bold">{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                className="bg-white h-[65%] rounded-xl justify-center items-center"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.41,
                  elevation: 2,
                }}
              >
                <Text className="font-bold pb-5">No more profiles</Text>
                <Image
                  source={require('../../assets/images/Crying_Face_Emoji_large.webp')}
                  resizeMode="contain"
                  className="h-20 w-full"
                  width={100}
                  height={100}
                />
              </View>
            )
          }
          containerStyle={{ backgroundColor: 'transparent' }}
          // keyExtractor={(cardData) => cardData.id}
          stackSize={5}
          /* showSecondCard */
          cardIndex={0}
          verticalSwipe={false}
          animateCardOpacity
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  textAlign: 'right',
                  color: '#EC4D25',
                },
              },
            },
            right: {
              title: 'MATCH',
              style: {
                label: {
                  color: '#11B356',
                },
              },
            },
          }}
          onSwipedLeft={swipeLeft}
          onSwipedRight={swipeRight}
        ></Swiper>
      </View>
      <View className="flex-row justify-evenly">
        <TouchableOpacity
          onPress={() => swiperRef.current.swipeLeft()}
          className="items-center justify-center rounded-full w-16 h-16 bg-red-200"
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swiperRef.current.swipeRight()}
          className="items-center justify-center rounded-full w-16 h-16 bg-green-200"
        >
          <AntDesign name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Homescreen;
