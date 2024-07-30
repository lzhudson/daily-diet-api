import { Meal } from '../@types/meal'

export function getLongestConsecutiveDietSequence(meals: Meal[]): number {
  if (meals.length === 0) return 0
  const mealsOrdered = meals.sort(
    (a, b) =>
      new Date(a.date_and_hour).getTime() - new Date(b.date_and_hour).getTime(),
  )
  let maxSequence = 0
  let currentSequence = 0

  for (const meal of mealsOrdered) {
    if (meal.in_the_diet) {
      currentSequence += 1
      if (currentSequence > maxSequence) {
        maxSequence = currentSequence
      }
    } else {
      currentSequence = 0
    }
  }

  return maxSequence
}
