import express from 'express';
const nutritionrouter = express.Router();
import nutritionController from '../controllers/nutritionController.mjs';
import tokenController from '../controllers/tokenController.mjs';


// Route Suche der Lebensmittel
nutritionrouter.get('/searchFoodItems',tokenController.authenticateToken, async (req, res) => {
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
nutritionrouter.get('/getMeal',tokenController.authenticateToken, async (req, res) => {
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
nutritionrouter.get('/getMealTypeSum',tokenController.authenticateToken, async (req, res) => {
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
nutritionrouter.get('/getMealSum',tokenController.authenticateToken, async (req, res) => {
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
nutritionrouter.get('/deleteMeal',tokenController.authenticateToken, async (req, res) => {
    const { uid, selectedDate, mealType ,mealId} = req.query;

    try {
        const DeleteMealData = await nutritionController.deleteMeal(uid, selectedDate, mealType, mealId);
        res.status(200).json(DeleteMealData);
    } catch (error) {
        console.error('Error retrieving meal data:', error);
        res.status(500).json({ error: 'Error retrieving meal data' });
    }
});

// Neue Route für die berechnete Protein-, Fett- und Kohlenhydrataufnahme hinzufügen
nutritionrouter.get('/calculateNutritionIntake',tokenController.authenticateToken, async (req, res) => {
    const { uid, selectedDate } = req.query;

    try {
        const nutritionIntake = await nutritionController.calculateNutritionIntake(uid, selectedDate);
        res.status(200).json(nutritionIntake);
    } catch (error) {
        console.error('Error calculating nutrition intake:', error);
        res.status(500).json({ error: 'Error calculating nutrition intake' });
    }
});

//Kalorien Berechnen und speichern
nutritionrouter.post('/saveBasicCalories', tokenController.authenticateToken,nutritionController.saveBasicCalories);

//Nahrung Speichern
nutritionrouter.post('/saveNutritionData', tokenController.authenticateToken,nutritionController.saveNutritionData);


export default nutritionrouter;

