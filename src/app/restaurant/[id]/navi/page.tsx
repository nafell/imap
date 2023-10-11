import NavArrowDown from "@icons/nav-arrow-down.svg";
import WarningCircle from "@icons/warning-circle.svg";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { Route } from "@/app/api/v-beta/restaurant/[id]/navi";
import { RectButton } from "@/components/buttons/RectButton";
import { CardFull, NavigationType } from "@/components/cards/CardFull";

import styles from "./page.module.scss";

async function getRoutes(id: string) {
  const routes = (await fetch(`${process.env.BASE_URL}/api/v-beta/restaurant/${id}/navi`)
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return notFound();
    })) as Route;

  return routes;
}

export default async function Page({ params }: { params: { id: string } }) {
  const routes = await getRoutes(params.id);
  const restaurant = routes[0].restaurant ?? null;

  /**
   * 1行の文字数を指定して、文字列を改行する (空白を単語の区切りとする)
   * @param {string} str 文字列
   * @param {number} lineLength 1行の文字数
   * @returns {React.ReactNode} `[<p>{string}</p>, ...]`
   */
  const normalizeText = (str: string, lineLength: number): React.ReactNode => {
    lineLength = 14; // 1行の文字数
    let line: string[] = []; // 1行分の単語を格納する配列

    if (str.length < lineLength) return <p>{str}</p>;

    const htmls = str.split(/\s+/g).map((word, index) => {
      const nextString = [...line, word].join(""); // 1行の文字数に満たない文字列 + 単語
      /** 文字列と単語を結合した際に1行の文字数を超えないか */
      if (nextString.length >= lineLength) {
        const html = <p key={index}>{nextString}</p>; // 1行分の文字列をpタグで囲む
        line = []; // 1行分の単語を格納する配列を初期化
        return html;
      } else {
        line.push(word); // 1行分の単語を格納する配列に単語を追加
      }
    });

    const filtered = htmls.filter((html) => html !== undefined); // undefinedを除外
    const res = [...filtered, <p key={str.length}>{...line}</p>]; // 入り切らなかった単語を1行にまとめて追加
    return res;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>ルート案内</div>
        <div className={styles.info}>
          <section>
            <div className={styles.distance}>
              <span>{`約${Math.floor(restaurant.travelTime / 60)}分`}</span>
              <span>{`(${restaurant.travelDistance}m)`}</span>
            </div>
            <div className={styles.route}>
              <div className={styles.origin}>{normalizeText("コクーンタワー2F出入口", 14)}</div>
              <span className={styles.icon}>
                <NavArrowDown />
              </span>
              <div className={styles.destination}>{normalizeText(restaurant.name, 14)}</div>
            </div>
          </section>
          <section>
            <div className={styles.mapParent}>
              <Image
                className={styles.map}
                src="/mockup/map.webp"
                alt="map"
                fill
                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 50vw, 50vw"
              />
              <span className={styles.preview}>Coming Soon!</span>
            </div>
            <a
              className={styles.link}
              href={`https://www.google.com/maps/place/${restaurant.address}/@${restaurant.latitude},${restaurant.longitude},17.5z`}
              target="_blank"
              rel="noopener noreferrer"
            >
              アプリを開く
            </a>
          </section>
        </div>
        <div className={styles.message}>
          <span className={styles.warn}>
            <WarningCircle />
          </span>
          <span className={styles.text}>歩きながらの使用はお控えください。</span>
        </div>
      </div>
      <div className={styles.main}>
        {routes.map((route, index) => (
          <CardFull
            key={index}
            image={`/${route.thumbnailId}.webp`}
            description={route.description ?? ""}
            navigation={route.routeType.name as NavigationType}
          />
        ))}
      </div>
      <div className={styles.footer}>
        <div className={styles.button}>
          <RectButton color="red">
            <Link href={"/webapp/home"} replace>
              終了する
            </Link>
          </RectButton>
        </div>
      </div>
    </div>
  );
}
