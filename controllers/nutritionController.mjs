import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import config from '../firebaseKeys/configKey.mjs';
import axios from 'axios';
import uidController from './uidController.mjs';
import crypto from 'crypto';
import querystring from 'querystring';
import dotenv from 'dotenv';
dotenv.config();

import { parseString } from 'xml2js';

// Funktion zur Umwandlung von XML in JSON
const parseXmlToJson = (xmlData) => {
  return new Promise((resolve, reject) => {
    parseString(xmlData, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};




const app = firebase.initializeApp(config);




//Grundvariablen zu Firestore hinzufügen 
const saveBasicCalories = async (req, res) => {
  try {

    const { uid, gender, age, weight, height } = req.body;

    let basicCalories = 0;

    if (gender === 'männlich') {
      basicCalories = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else if (gender === 'weiblich') {
      basicCalories = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    if (!uid) {
      return res.status(400).json({ message: 'Missing data: uid missing', success: false });
    }


    //Update der basic_calories in Firebase
    await firebase.firestore().collection('users').doc(uid)
      .collection('nutrition').doc('food_values')
      .update({
        'basic_calories': basicCalories
      });

      await firebase.firestore().collection('users').doc(uid)
      .update({
        'gender': gender,
        'age': age,
        'weight': weight,
        'height': height
      });

    return res.status(200).json({ message: 'Base calories successfully saved in Firestore', success: true });
  } catch (error) {
    console.error('Error saving base calories in Firestore:', error);
    return res.status(500).json({ message: 'Error saving base calories in Firestore', success: false });
  }
};




//Suchfunktion zur erhalten der Nahrungsdaten
async function searchFoodItems(foodName, pageNumber) {
  const apiKeyFatSecret = process.env.apiKeyFatSecret; // Ihr FatSecret Consumer Key
  const apiSecret = process.env.apiSecret; // Ihr FatSecret Consumer Secret

  //Vorgeschriebenen übergabe Parameter von FatSecret
  const oauthParams = {
    oauth_consumer_key: apiKeyFatSecret,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_timestamp: Math.floor(Date.now() / 1000),
    method: 'foods.search',
    search_expression: foodName,
    page_number: pageNumber
  };

  const sortedParams = Object.keys(oauthParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(oauthParams[key])}`)
    .join('&');

  const baseString = `POST&${encodeURIComponent(process.env.fatsecret_uri)}&${encodeURIComponent(sortedParams)}`;
  const signingKey = `${encodeURIComponent(apiSecret)}&`;
  const signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');

  oauthParams.oauth_signature = signature;

  try {
    const response = await axios.post(process.env.fatsecret_uri, null, {
      params: oauthParams
    });

    //Die Empfangenen Daten von XML zu Json ändern
    const xmlResponse = response.data; // Diese übergabe ist immer xml
    const jsonResult = await parseXmlToJson(xmlResponse); // Die Funktion parseXmlToJson ändert die Daten in json um

    return jsonResult;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}


// Speichern der Nährwertdaten
const saveNutritionData = async (req, res) => {
  try {

    //Diese Daten werden von Flutter übergeben
    const { uid, calories, fat, carbs, protein, foodName, amount, selectedDate, mealType } = req.body;

    //Falls die daten null sind werden sie auf 0 gesetzt
    const caloriesValue = calories || 0;
    const fatValue = fat || 0.0;
    const carbsValue = carbs || 0.0;
    const proteinValue = protein || 0.0;
    const foodNameValue = foodName || '';
    const amountValue = amount || '';

    const userRef = firebase.firestore().collection('users').doc(uid);
    const nutritionRef = userRef.collection('nutrition').doc('food_values');

    const nutritionSnapshot = await nutritionRef.get();

    if (!nutritionSnapshot.exists) {
      await nutritionRef.set({});
    }

    const selectedDateRef = nutritionRef.collection(selectedDate);
    const mealTypeRef = selectedDateRef.doc(mealType);

    const mealTypeSnapshot = await mealTypeRef.get();

    if (!mealTypeSnapshot.exists) {
      await mealTypeRef.set({});
    }

    //Hier wird in der collection meals ein Dokument erstellt welches von 1 hinaufzählt
    const mealsRef = mealTypeRef.collection('meals');
    let mealIndex = 1;
    let mealDocRef;

    do {
      const mealId = `meal${mealIndex}`;
      mealDocRef = mealsRef.doc(mealId);
      const mealSnapshot = await mealDocRef.get();
      mealIndex++;

      if (!mealSnapshot.exists) {
        await mealDocRef.set({
          calories: caloriesValue,
          fat: fatValue,
          carbs: carbsValue,
          protein: proteinValue,
          foodName: foodNameValue,
          amount: amountValue,
          mealId: mealId,
        });
        //Aufruf um die Summe von dem MealTyp zu aktualisieren
        await updateSumMealType(uid, selectedDate, mealType)
        //Aufruf damit die komplette summe aktualisiert wird
        updateNutriSum(uid,selectedDate)
        return res.status(200).json({ message: 'Nutritional data successfully saved in Firestore', success: true });
        
      }
    } while (true);
  } catch (error) {
    console.error('Error saving nutritional data in Firestore::', error);
    return res.status(500).json({ message: 'Error saving nutritional data in Firestore', success: false });
  }
};

//Aktualisieren Summe MealTyp
const updateSumMealType = async (uid, selectedDate, mealType) => {
  try {
    const nutritionRef = firebase.firestore().collection('users').doc(uid).collection('nutrition').doc('food_values');
    const selectedDateRef = nutritionRef.collection(selectedDate).doc(mealType);
    const mealsRef = selectedDateRef.collection('meals');

    const mealDocs = await mealsRef.get();
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalProtein = 0;

    //Hier werden die neuen Werte Berechnet
    mealDocs.forEach((mealDoc) => {
      const mealData = mealDoc.data();
      totalCalories += mealData.calories || 0;
      totalCarbs += mealData.carbs || 0;
      totalFat += mealData.fat || 0;
      totalProtein += mealData.protein || 0;
    });

    //Hier werden die Werte in firebase gespeichert
    await selectedDateRef.set(
      {
        caloriesSum: totalCalories,
        carbsSum: totalCarbs,
        fatSum: totalFat,
        proteinSum: totalProtein
      },
      { merge: true }
    );

    //Wird in der Console Ausgeben kann bald entfernt werden
    console.log('Nutritional values ​​successfully updated:', {
      caloriesSum: totalCalories,
      carbsSum: totalCarbs,
      fatSum: totalFat,
      proteinSum: totalProtein
    });
  } catch (error) {
    console.error('Error updating nutritional values:', error);
  }
};

//Aktualisieren der Gesamten Summe
const updateNutriSum = async (uid, selectedDate) => {
  try {
    const nutritionRef = firebase.firestore().collection('users').doc(uid).collection('nutrition').doc('food_values');
    const selectedDateRef = nutritionRef.collection(selectedDate);

    const mealTypesSnapshot = await selectedDateRef.get();

    let totalCalories = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalProtein = 0;

    mealTypesSnapshot.forEach((doc) => {
      const mealTypeData = doc.data();
      totalCalories += mealTypeData.caloriesSum || 0;
      totalCarbs += mealTypeData.carbsSum || 0;
      totalFat += mealTypeData.fatSum || 0;
      totalProtein += mealTypeData.proteinSum || 0;
    });

    const nutriSumRef = selectedDateRef.doc('nutriSum');

    // Überprüfen, ob nutriSum existiert
    const nutriSumSnapshot = await nutriSumRef.get();

    if (!nutriSumSnapshot.exists) {
      // Wenn nutriSum nicht existiert, erstelle es
      await nutriSumRef.set({
        totalCalories: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalProtein: 0
      });
    }

    // Aktualisieren der Werte in nutriSum
    await nutriSumRef.set(
      {
        totalCalories,
        totalCarbs,
        totalFat,
        totalProtein
      },
      { merge: true }
    );

    console.log('nutriSum successfully updated:', {
      totalCalories,
      totalCarbs,
      totalFat,
      totalProtein
    });

  } catch (error) {
    console.error('Error updating nutriSum:', error);
    throw error;
  }
};


//Anzeige der Meals
const getMeal = async (uid, selectedDate, mealType) => {
  try {
    const nutritionRef = firebase.firestore().collection('users').doc(uid).collection('nutrition').doc('food_values');
    const selectedDateRef = nutritionRef.collection(selectedDate).doc(mealType);
    const mealsRef = selectedDateRef.collection('meals');

    const mealDocs = await mealsRef.get();

    let mealDataArray = [];

    mealDocs.forEach((mealDoc) => {
      const mealData = mealDoc.data();
      mealDataArray.push({
        amount: mealData.amount || '',
        calories: mealData.calories || 0,
        carbs: mealData.carbs || 0,
        fat: mealData.fat || 0,
        foodName: mealData.foodName || '',
        mealId: mealData.mealId || '',
        protein: mealData.protein || 0
      });
    });

    return mealDataArray;
  } catch (error) {
    console.error('Error reading meal data:', error);
    throw error;
  }
};

//Anzeige der Summe vom MealTyp
const getMealTypeSum = async (uid, selectedDate, mealType) => {
  try {
    const nutritionRef = firebase.firestore().collection('users').doc(uid).collection('nutrition').doc('food_values').collection(selectedDate);
    const selectedMealTypeRef = nutritionRef.doc(mealType);

    const mealTypeData = await selectedMealTypeRef.get();

    if (mealTypeData.exists) {
      const { caloriesSum = 0, carbsSum = 0, fatSum = 0, proteinSum = 0 } = mealTypeData.data() || {};

      return { caloriesSum, carbsSum, fatSum, proteinSum };
    } else {
      console.error(`Meal '${mealType}' date '${selectedDate}' not found.`);
      return null;
    }
  } catch (error) {
    console.error('Error reading meal data:', error);
    throw error;
  }
};

//Anzeige der Gesamten Summe
const getMealSum = async (uid, selectedDate) => {
  try {
    const nutritionRef = firebase.firestore().collection('users').doc(uid).collection('nutrition').doc('food_values').collection(selectedDate);
    const selectedMealTypeRef = nutritionRef.doc('nutriSum');

    const mealTypeData = await selectedMealTypeRef.get();

    if (mealTypeData.exists) {
      const { totalCalories = 0, totalCarbs = 0, totalFat = 0, totalProtein = 0 } = mealTypeData.data() || {};

      return { totalCalories, totalCarbs, totalFat, totalProtein };
    } else {
      console.error(`Total sum for the date '${selectedDate}' not found.`);
      return null;
    }
  } catch (error) {
    console.error('Error reading total sum:', error);
    throw error;
  }
};

//Löschen der Eintragung Meal
const deleteMeal = async (uid, selectedDate, mealType, mealId) => {
  try {
    const mealRef = firebase.firestore()
      .collection('users')
      .doc(uid)
      .collection('nutrition')
      .doc('food_values')
      .collection(selectedDate)
      .doc(mealType)
      .collection('meals')
      .doc(mealId);

    const mealDoc = await mealRef.get();


    await mealRef.delete();

    // Aktualisieren der Summen nach dem Löschen der Mahlzeit
    await updateSumMealType(uid, selectedDate, mealType);
    await updateNutriSum(uid, selectedDate);
    //ist Optional gehört noch geprüft ob es Sinn mach oder nicht
    await getMeal(uid, selectedDate, mealType);

  } catch (error) {
    console.error('Fehler beim Löschen der Mahlzeit:', error);
  }
};

const calculateNutritionIntake = async (uid, selectedDate) => {
  try {
    console.log('Received UID:', uid);
    console.log('Received selectedDate:', selectedDate);

    
    const nutritionRef = firebase.firestore().collection('users').doc(uid).collection('nutrition').doc('food_values');
    const selectedDateRef = nutritionRef.collection(selectedDate);


    const basicCaloriesData = await nutritionRef.get();
    const basicCalories = basicCaloriesData.data()?.basic_calories || 0;


    const burnedCaloriesData = await selectedDateRef.doc('nutriSum').get();
    const burnedCalories = burnedCaloriesData.data()?.burnedCalories || 0;


    const totalCalories = basicCalories + burnedCalories;

    const proteinIntake = totalCalories * 0.25;
    const fatIntake = totalCalories * 0.35;
    const carbIntake = totalCalories * 0.40;

    const caloriesPerGram = {
      protein: 4,
      fat: 9,
      carb: 4,
    };


    const proteinIntakeGrams = proteinIntake / caloriesPerGram.protein;
    const fatIntakeGrams = fatIntake / caloriesPerGram.fat;
    const carbIntakeGrams = carbIntake / caloriesPerGram.carb;


    console.log('Protein Intake:', proteinIntakeGrams);
    console.log('Fat Intake:', fatIntakeGrams);
    console.log('Carb Intake:', carbIntakeGrams);

    return { proteinIntakeGrams, fatIntakeGrams, carbIntakeGrams };
  } catch (error) {
    console.error('Error calculating nutrition intake:', error);
    throw error;
  }
};

export default {
  saveBasicCalories,
  searchFoodItems,
  saveNutritionData,
  getMeal,
  getMealTypeSum,
  getMealSum,
  deleteMeal,
  calculateNutritionIntake
};
