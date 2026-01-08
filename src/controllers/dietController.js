import Diet from '../models/Diet.js';
import { generateDietPlan } from '../services/dietGenerator.js';
import User from '../models/User.js';
import Points from '../models/Points.js';

// @desc    Generate diet plan
// @route   POST /api/diets/generate
// @access  Private
export const generateDiet = async (req, res) => {
  try {
    const { goal, preference, budget, duration } = req.body;
    const userId = req.user.id;

    // Get user profile
    const user = await User.findById(userId);
    const weight = user.profile?.weight;
    const height = user.profile?.height;
    const age = user.profile?.age;

    if (!weight || !height || !age) {
      return res.status(400).json({
        message: 'Please complete your profile (height, weight, age)'
      });
    }

    // Generate diet plan
    const dietData = generateDietPlan(
      goal,
      preference,
      budget || 'medium',
      weight,
      height,
      age,
      'male', // Default, can be added to user profile
      duration || 7
    );

    // Helper to transform items to objects
    const transformMealItems = (meal) => ({
      ...meal,
      items: meal.items.map(item => ({ text: item, completed: false }))
    });

    const transformedDailyMeals = dietData.dailyMeals.map(day => ({
      ...day,
      breakfast: transformMealItems(day.breakfast),
      lunch: transformMealItems(day.lunch),
      dinner: transformMealItems(day.dinner),
      snacks: day.snacks.map(snack => transformMealItems(snack))
    }));

    // Create diet
    const diet = await Diet.create({
      user: userId,
      goal,
      preference,
      budget: budget || 'medium',
      dailyMeals: transformedDailyMeals,
      duration: dietData.duration,
      targetCalories: dietData.targetCalories,
      targetProtein: dietData.targetProtein,
      targetCarbs: dietData.targetCarbs,
      targetFats: dietData.targetFats,
    });

    res.status(201).json({
      message: 'Diet plan generated successfully',
      diet,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user diets
// @route   GET /api/diets
// @access  Private
export const getDiets = async (req, res) => {
  try {
    const userId = req.user.id;
    const diets = await Diet.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(diets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single diet
// @route   GET /api/diets/:id
// @access  Private
export const getDiet = async (req, res) => {
  try {
    const diet = await Diet.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!diet) {
      return res.status(404).json({ message: 'Diet not found' });
    }

    res.json(diet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update diet
// @route   PUT /api/diets/:id
// @access  Private
export const updateDiet = async (req, res) => {
  try {
    const diet = await Diet.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!diet) {
      return res.status(404).json({ message: 'Diet not found' });
    }

    // Allow updating daily meals
    if (req.body.dailyMeals) {
      diet.dailyMeals = req.body.dailyMeals;
    }
    if (req.body.status) {
      diet.status = req.body.status;
    }

    await diet.save();

    res.json({
      message: 'Diet updated successfully',
      diet,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete diet
// @route   DELETE /api/diets/:id
// @access  Private
export const deleteDiet = async (req, res) => {
  try {
    const diet = await Diet.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!diet) {
      return res.status(404).json({ message: 'Diet not found' });
    }

    res.json({ message: 'Diet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle food item completion status
// @route   PATCH /api/diets/:id/meal/:dayId/:mealType/item/:itemIndex/toggle
// @access  Private
export const toggleItemCompletion = async (req, res) => {
  try {
    const { id, dayId, mealType, itemIndex } = req.params;

    const diet = await Diet.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!diet) {
      return res.status(404).json({ message: 'Diet not found' });
    }

    // Find the day
    const day = diet.dailyMeals.id(dayId);
    if (!day) {
      return res.status(404).json({ message: 'Day not found' });
    }

    // Handle standard meals
    if (['breakfast', 'lunch', 'dinner'].includes(mealType)) {
      if (!day[mealType] || !day[mealType].items[itemIndex]) {
        return res.status(404).json({ message: 'Item not found' });
      }

      // Toggle item
      day[mealType].items[itemIndex].completed = !day[mealType].items[itemIndex].completed;

      // Check if all items are completed, if so, mark meal as completed
      const allCompleted = day[mealType].items.every(item => item.completed);
      day[mealType].completed = allCompleted;

    } else if (mealType === 'snack') {
      // For snacks, we might need extra handling as snacks is an array
      // Assuming the route handles snack index too, but for now skipping complex snack logic 
      // or assuming we just toggle the first snack matching criteria? 
      // Simpler: Let's assume mealType is 'snacks' and we pass snackIndex too? 
      // For now, let's stick to breakfast/lunch/dinner as per request standard.
      return res.status(400).json({ message: 'Snack toggling pending implementation' });
    } else {
      return res.status(400).json({ message: 'Invalid meal type' });
    }

    await diet.save();

    // AWARD POINTS LOGIC
    if (day[mealType].completed) {
      const user = await User.findById(req.user.id);
      let pointsAwarded = 10; // 10 points per meal
      let source = 'diet_completion';
      let description = `Completed ${mealType}`;

      // Check if all meals for the day are completed
      const dayMeals = ['breakfast', 'lunch', 'dinner'];
      const dayCompleted = dayMeals.every(m => day[m] && day[m].completed);

      if (dayCompleted) {
        pointsAwarded += 20; // Bonus 20 points for full day (Total 30 for the final meal if it completes the day)
        // Actually, let's keep it simple: 10 per meal, and if it's the last meal of the day, an extra bonus.
        // Or 10 per meal, and 20 extra if day is finished.
        description = `Completed all meals for ${new Date(day.date).toLocaleDateString()}`;
      }

      user.gamification.points += pointsAwarded;

      // Check for level up
      const newLevel = Math.floor(user.gamification.points / 500) + 1;
      if (newLevel > user.gamification.level) {
        user.gamification.level = newLevel;
      }

      await user.save();

      // Record points in history
      await Points.create({
        user: req.user.id,
        points: pointsAwarded,
        source: 'diet_completion',
        description,
        relatedId: diet._id,
      });

      return res.json({
        message: 'Item updated and points awarded',
        completed: day[mealType].items[itemIndex].completed,
        mealCompleted: day[mealType].completed,
        pointsAwarded,
        dayCompleted
      });
    }

    res.json({
      message: 'Item updated',
      completed: day[mealType].items[itemIndex].completed,
      mealCompleted: day[mealType].completed
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};