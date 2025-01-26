"use server";

export async function shareMeal(formData) {
  const meal = {
    // 키=db의 데이터명 / get('입력요소 name값')
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  console.log(meal);
}
