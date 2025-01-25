import Link from "next/link";

import classes from "./page.module.css";
import MealsGrid from "@/components/meals/meals-grid";
import getMeals from "@/lib/meals";
import { Suspense } from "react";

async function Meals() {
  const meals = await getMeals();

  return <MealsGrid meals={meals} />;
}

export default function MealsPage() {
  // Next앱은 백엔드와 프론트엔드가 결합된 풀스택 앱이므로 백엔드를 분리시킬 필요가 없다.
  // 기본적으로 모두 서버 컴포넌트이기 때문에 이미 백엔드 서버를 가지고 있다.
  // ==> useEffect, fetch 사용할 필요 x
  // useEffect(() => {
  //   fetch()
  // }, [])

  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious meals, created{" "}
          <span className={classes.highlight}>by you</span>
        </h1>
        <p>
          Choose your favorite recipe and cook it yourself. It is easy and fun!
        </p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share Tour Favorite Recipe</Link>
        </p>
      </header>
      <main className={classes.main}>
        <Suspense
          fallback={<p className={classes.loading}>Fetching meals...</p>}
        >
          <Meals />
        </Suspense>
      </main>
    </>
  );
}
