import fs from 'node:fs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { Meal } from '@/models/meal-types';
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

const db = sql('meals.db');

export async function getMeals() {
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // throw new Error('Something went wrong!');
  return db
    .prepare('SELECT * FROM meals')
    .all();
}

export async function getMeal(slug: string) {
  return db
    .prepare('SELECT * FROM meals WHERE slug = ?')
    .get(slug);
}

// TODO: do not mutate the received object
export async function createMeal(meal: any) {
  const slug = slugify(meal.title, { lower: true });
  const instructions = xss(meal.instructions);
  const extension = meal.image.name.split('.').pop();
  const filename = `${meal.slug}.${extension}`;
  const bufferedImage = await meal.image.arrayBuffer();

  const stream = fs.createWriteStream(`public/images/${filename}`);
  stream.write(Buffer.from(bufferedImage), (error: any) => {
    if (error) throw error('Saving image failed');
  });

  const image = `/images/${filename}`;
  
  const savedMeal = {
    ...meal,
    slug,
    instructions,
    image
  }

  db.prepare(`
    INSERT INTO meals (
        title,
        slug,
        image,
        summary,
        instructions,
        creator,
        creator_email
    )
    VALUES (
      @title,
      @slug,
      @image,
      @summary,
      @instructions,
      @creator,
      @creator_email
    )`).run(savedMeal);
}