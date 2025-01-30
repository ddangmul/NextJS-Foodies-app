"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

function isInvalidText(text) {
  return !text || text.trim() === "";
}

export async function shareMeal(prevState, formData) {
  const meal = {
    // 키=db의 데이터명 / get('입력요소 name값')
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  // 유효성 검사 규칙 설정
  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    // throw new Error("Invalid input");
    return {
      // Response를 반환
      // 클라이언트로 보내지는 동안 손실될 수 있으므로 객체 형태는 직렬화가 가능해야 한다. (메소드가 있으면 x)
      message: "Invalid input.",
    };
  }
  // saveMeal이 프라미스 반환하므로 async-await 작성
  await saveMeal(meal);
  revalidatePath("/meals", "layout"); // 두 번째 인수에 'LAYOUT'을 작성하면 /meals와 중첩된 페이지도 캐시 재검사
  redirect("/meals");
}
