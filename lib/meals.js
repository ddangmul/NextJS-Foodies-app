import fs from "node:fs"; // 파일 시스템

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

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  // 1. 이미지 확장자 받아오기 (png인지 jpeg인지)
  const extension = meal.image.name.split(".").pop();
  // 2. 사용자 파일명이 아닌 고유한 파일명 생성
  const fileName = `${meal.slug}.${extension}`;
  // 3. public에 파일 쓰기(write)
  // - fs.createWriteStream() : 인수로 넣은 경로에 데이터를 쓸 수 있는 stream 객체를 반환
  const stream = fs.createWriteStream(`public/images/${fileName}`);
  // - 이미지를 buffer로 변환. arrayBuffer가 프라미스를 반환하기 때문에 async와 await 필요
  const bufferedImage = await meal.image.arrayBuffer();

  // - 이미지 파일에 쓰기
  //  write()는 일반 buffer타입이 필요
  //  첫 번째 인수는 저장할 파일
  //  두 번째 인수는 쓰기를 마치면 실행될 함수. error를 받음. 정상 동작되면 null을 받음.
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Saving image failed!");
    }
  });

  // 4. 전체 데이터를 DB에 저장
  // - meal 객체에 저장된 image를 저장된 이미지 경로로 덮어쓰기
  //  데이터페이스는 파일 자체를 저장하는 곳이 아니므로, 파일의 경로만 저장
  //  모든 이미지에 관한 요청은 자동으로 public으로 보내지기 때문에 public 세그먼트는 삭제 (public폴더는 서버의 루트 단계와 동일하게 동작)
  meal.image = `/images/${fileName}`;
  // - db에 저장
  // VALUES ()에 값을 ${}으로 직접 넣으면 보안에 취약
  // 플레이스홀더 ? 방법 사용하거나,
  // sqlite3이 지원하는 @속성명 방식 사용 : 객체 meal 전달해 db에 저장할 때 이름에 맞는 속성 값 찾아 저장
  // @ 방식 사용 시 INTO문과 VALUES문의 속성명 작성 순서가 db와 일치해야 함
  db.prepare(
    `
    INSERT INTO meals (slug, title, image, summary, instructions, creator, creator_email)
    VALUES (@slug, @title, @image, @summary, @instructions, @creator, @creator_email)
  `
  ).run(meal);
}
