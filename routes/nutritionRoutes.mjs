import express from 'express';
const nutritionrouter = express.Router();
import nutritionController from '../controllers/nutritionController.mjs';
import tokenController from '../controllers/tokenController.mjs';


// Route Suche der Lebensmittel
nutritionrouter.get('/searchFoodItems', tokenController.authenticateToken, async (req, res) => {
    const { query, pageNumber } = req.query; // Pagenumber muss übergeben werden, damit man mehrere Daten laden kann
  
    try {
      const foodItems = await nutritionController.searchFoodItems(query, pageNumber);
      res.json(foodItems); // Daten an Flutter zurücksenden
    } catch (error) {
      console.error('Error processing the request:', error.message);
      res.status(500).json({ error: 'Error processing the request' });
    }
});

//Anzeige der Mealdaten
nutritionrouter.get('/getMeal', tokenController.authenticateToken, async (req, res) => {
    const { uid, selectedDate, mealType } = req.query;
  
    try {
      if (!uid || !selectedDate || !mealType) {
        res.status(400).json({ error: 'Invalid request parameters' });
        return;
      }
  
      const mealData = await nutritionController.getMeal(uid, selectedDate, mealType);
      res.json(mealData);
    } catch (error) {
      console.error('Error processing the request:', error.message);
      res.status(500).json({ error: 'Error processing the request' });
    }
  });

//Summe der Mahlzeiten Anzeigen von MealTyp
nutritionrouter.get('/getMealTypeSum', tokenController.authenticateToken, async (req, res) => {
    const { uid, selectedDate, mealType } = req.query;
  
    try {
      if (!uid || !selectedDate || !mealType) {
        res.status(400).json({ error: 'Invalid request parameters' });
        return;
      }
  
      const mealData = await nutritionController.getMealTypeSum(uid, selectedDate, mealType);
  
      if (mealData) {
        res.status(200).json(mealData);
      } else {
        res.status(404).json({ error: `Meal '${mealType}' for date '${selectedDate}' not found` });
      }
    } catch (error) {
      console.error(`Error getting sum of MealType for uid: ${uid}, selectedDate: ${selectedDate}, mealType: ${mealType}. Error:`, error.message);
      res.status(500).json({ error: 'Error getting sum of MealType' });
    }
  });

//Summe der Mahlzeigen Anzeigen lassen
nutritionrouter.get('/getMealSum', tokenController.authenticateToken, async (req, res) => {
  const { uid, selectedDate } = req.query;

  try {
    if (!uid || !selectedDate) {
      res.status(400).json({ error: 'Invalid request parameters' });
      return;
    }

    const mealData = await nutritionController.getMealSum(uid, selectedDate);

    if (mealData) {
      res.status(200).json(mealData);
    } else {
      res.status(404).json({ error: `Total sum for the date '${selectedDate}' not found` });
    }
  } catch (error) {
    console.error(`Error retrieving meal totals for uid: ${uid}, selectedDate: ${selectedDate}. Error:`, error.message);
    res.status(500).json({ error: 'Error retrieving meal totals' });
  }
});

//Löschen der Daten
nutritionrouter.get('/deleteMeal', tokenController.authenticateToken, async (req, res) => {
  const { uid, selectedDate, mealType, mealId } = req.query;

  try {
    if (!uid || !selectedDate || !mealType || !mealId) {
      res.status(400).json({ error: 'Invalid request parameters' });
      return;
    }

    const deleteMealData = await nutritionController.deleteMeal(uid, selectedDate, mealType, mealId);
    
    if (deleteMealData) {
      res.status(200).json(deleteMealData);
    } else {
      res.status(404).json({ error: `Meal with ID '${mealId}' not found for date '${selectedDate}' and type '${mealType}'` });
    }
  } catch (error) {
    console.error(`Error deleting meal for uid: ${uid}, selectedDate: ${selectedDate}, mealType: ${mealType}, mealId: ${mealId}. Error:`, error.message);
    res.status(500).json({ error: 'Error deleting meal' });
  }
});

// Neue Route für die berechnete Protein-, Fett- und Kohlenhydrataufnahme hinzufügen
nutritionrouter.get('/calculateNutritionIntake', tokenController.authenticateToken, async (req, res) => {
  const { uid, selectedDate } = req.query;

  try {
    if (!uid || !selectedDate) {
      res.status(400).json({ error: 'Invalid request parameters' });
      return;
    }

    const nutritionIntake = await nutritionController.calculateNutritionIntake(uid, selectedDate);
    res.status(200).json(nutritionIntake);
  } catch (error) {
    console.error(`Error calculating nutrition intake for uid: ${uid}, selectedDate: ${selectedDate}. Error:`, error.message);
    res.status(500).json({ error: 'Error calculating nutrition intake' });
  }
});

//Kalorien Berechnen und speichern
nutritionrouter.post('/saveBasicCalories', tokenController.authenticateToken,nutritionController.saveBasicCalories);

//Nahrung Speichern
nutritionrouter.post('/saveNutritionData', tokenController.authenticateToken,nutritionController.saveNutritionData);


export default nutritionrouter;

