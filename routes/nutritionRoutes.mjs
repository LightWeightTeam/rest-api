/*
import express from 'express';
const nutritionrouter = express.Router();
import nutritionController from '../controllers/nutritionController.mjs';

// Route Suche der Lebensmittel
nutritionrouter.get('/searchFoodItems', async (req, res) => {
    const { query, pageNumber } = req.query; // Pagenumber muss übergenben werden damit man mehrere Daten Laden kann

    try {
        const foodItems = await nutritionController.searchFoodItems(query, pageNumber);
        res.json(foodItems); // Daten an Flutter zurücksenden
    } catch (error) {
        console.error('Error processing the request:', error);
        res.status(500).json({ error: 'Error processing the request' });
    }
});

//Anzeige der Mealdaten
nutritionrouter.get('/getMeal', async (req, res) => {
    const { uid, selectedDate, mealType } = req.query;

    try {
        const mealData = await nutritionController.getMeal(uid, selectedDate, mealType);
        res.status(200).json(mealData);
    } catch (error) {
        console.error('Error retrieving meal data:', error);
        res.status(500).json({ error: 'Error retrieving meal data' });
    }
});

//Summe der Mahlzeiten Anzeigen von MealTyp
nutritionrouter.get('/getMealTypeSum', async (req, res) => {
    const { uid, selectedDate, mealType } = req.query;

    try {
        const mealData = await nutritionController.getMealTypeSum(uid, selectedDate, mealType);
        res.status(200).json(mealData);
    } catch (error) {
        console.error('Error getting sum of MealType:', error);
        res.status(500).json({ error: 'Error getting sum of MealType' });
    }
});

//Summe der Mahlzeigen Anzeigen lassen
nutritionrouter.get('/getMealSum', async (req, res) => {
    const { uid, selectedDate } = req.query;

    try {
        const mealData = await nutritionController.getMealSum(uid, selectedDate);
        res.status(200).json(mealData);
    } catch (error) {
        console.error('Error retrieving meal totals:', error);
        res.status(500).json({ error: 'Error retrieving meal totals' });
    }
});

//Löschen der Daten
nutritionrouter.get('/deleteMeal', async (req, res) => {
    const { uid, selectedDate, mealType ,mealId} = req.query;

    try {
        const DeleteMealData = await nutritionController.deleteMeal(uid, selectedDate, mealType, mealId);
        res.status(200).json(DeleteMealData);
    } catch (error) {
        console.error('Error retrieving meal data:', error);
        res.status(500).json({ error: 'Error retrieving meal data' });
    }
});



//Kalorien Berechnen
nutritionrouter.post('/calculateCalories', nutritionController.basicCalories);

//Kalorien Speichern
nutritionrouter.post('/saveBasicCalories', nutritionController.saveBasicCalories);

//Nahrung Speichern
nutritionrouter.post('/saveNutritionData', nutritionController.saveNutritionData);


export default nutritionrouter;

*/