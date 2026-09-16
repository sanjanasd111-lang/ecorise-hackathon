-- ============================================================================
-- EcoRise 2.0 – Seed Data (Challenges & Achievements)
-- ============================================================================

-- Seed Challenges
INSERT INTO public.challenges (id, title, description, category, difficulty, points, impact_type, impact_value, icon, active, rotation_week)
VALUES
  ('plant_tree', 'Plant a tree', 'Plant or nurture a tree, sapling, or community green space.', 'nature', 'medium', 25, 'trees', 1, '🌱', true, 1),
  ('refillable_bottle', 'Use a refillable bottle', 'Replace disposable plastic drink bottles with a reusable container.', 'water', 'easy', 10, 'plastic', 2, '💧', true, 1),
  ('cycle_trip', 'Cycle instead of driving', 'Choose cycling or walking for a short trip instead of a motor vehicle.', 'transport', 'medium', 20, 'transport', 6, '🚲', true, 1),
  ('save_electricity', 'Save electricity', 'Unplug standby electronics and switch off appliances when not in use.', 'energy', 'easy', 10, 'energy', 4, '💡', true, 1),
  ('recycle_waste', 'Recycle waste', 'Carefully sort recyclable paper, metals, and clean plastic items.', 'waste', 'easy', 15, 'plastic', 4, '♻️', true, 1),
  ('public_transport', 'Use public transport', 'Take the bus, metro, or shared transport for your daily commute.', 'transport', 'easy', 15, 'transport', 5, '🚌', true, 2),
  ('avoid_plastic', 'Avoid single-use plastic', 'Carry reusable canvas bags and decline plastic packaging.', 'waste', 'easy', 10, 'plastic', 3, '🛍️', true, 2),
  ('save_water', 'Save water', 'Take a shorter shower under 5 minutes and turn off running taps.', 'water', 'easy', 10, 'water', 25, '🚿', true, 2),
  ('switch_lights', 'Switch off unused lights', 'Always extinguish lights when leaving empty rooms or during daylight.', 'energy', 'easy', 10, 'energy', 3, '🔦', true, 3),
  ('community_cleanup', 'Community clean-up', 'Collect discarded litter in your local park, neighborhood, or beach.', 'nature', 'hard', 25, 'plastic', 6, '🧹', true, 3)
ON CONFLICT (id) DO NOTHING;

-- Seed Achievements
INSERT INTO public.achievements (id, name, description, icon, requirement_type, requirement_value)
VALUES
  ('first_step', 'First Step', 'Complete your very first climate action.', '🌱', 'total_activities', 1),
  ('eco_explorer', 'Eco Explorer', 'Complete activities across 3 different categories.', '🧭', 'categories_completed', 3),
  ('water_saver', 'Water Saver', 'Complete 3 water-saving actions.', '💧', 'water_activities', 3),
  ('tree_champion', 'Tree Champion', 'Plant a tree or nurture local greenery.', '🌳', 'nature_activities', 1),
  ('green_commuter', 'Green Commuter', 'Complete 5 cycling or public transit activities.', '🚲', 'transport_activities', 5),
  ('waste_warrior', 'Waste Warrior', 'Complete 5 recycling or plastic reduction actions.', '♻️', 'waste_activities', 5),
  ('energy_saver', 'Energy Saver', 'Complete 5 energy conservation actions.', '⚡', 'energy_activities', 5),
  ('week_warrior', 'Week Warrior', 'Maintain an uninterrupted 7-day eco streak.', '🔥', 'streak_days', 7),
  ('climate_champion', 'Climate Champion', 'Earn 100+ Eco Points in a single week.', '🌍', 'weekly_points', 100),
  ('eco_legend', 'Eco Legend', 'Accumulate 1,000 Total Lifetime Eco Points.', '👑', 'total_points', 1000)
ON CONFLICT (id) DO NOTHING;
