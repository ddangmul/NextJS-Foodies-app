import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

// db 연결
const db = sql("meals.db");

// db객체로 데이터베이스 작업
export default async function getMeals() {
  // 추가 지연
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // db.prepare('sql문'): 새 sql문 준비
  // [sql문 실행]
  // - .all() : 데이터를 가져올 때 사용
  // - .run() : 데이터를 주입(변경)시킬 때 사용
  // throw new Error("Loading meals failed");
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);
}
