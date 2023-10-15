"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

import { RecommendResponse } from "@/app/api/v-beta/recommend";
import { RectButton } from "@/components/buttons/RectButton";
import { CardHorizontal } from "@/components/cards/CardHorizontal";
import { PaymentShort, PaymentType } from "@/components/lists/PaymentShort";

import styles from "./page.module.scss";

/** @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config} */
export const dynamic = "force-dynamic"; // SSR

/** @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional} */
export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const params = new URLSearchParams(searchParams as Record<string, string>);
  console.log(params.toString());
  /** おすすめ */

  const [recommends, setRecommends] = useState<RecommendResponse[]>([]);
  const [payments, setPayments] = useState<
    {
      type: PaymentType;
      accepted: boolean;
    }[][]
  >([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v-beta/recommend?${params.toString()}`, {
      method: "GET",
    })
      .then(async (res) => {
        const r = (await res.json()) as RecommendResponse[];
        setRecommends(r);
      })
      .catch((err) => {
        console.error(err);
        return notFound();
      });
  }, []);

  useEffect(() => {
    const p = recommends.map((item) => {
      return item.restaurant.payments.map((payment) => ({
        type: payment.paymentType.name as PaymentType,
        accepted: payment.accepted,
      }));
    });

    setPayments(p);
  }, [recommends]);

  /** 支払方法 */

  // const sortedPayments = payments.sort((a, b) => a.type.localeCompare(b.type));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>あなたへのおすすめ</h1>
      </div>
      <div className={styles.content}>
        {recommends.length == 0 ? (
          <>
            <div className={styles.zero}>検索結果: 0件</div>
            <div className={styles.noresult}>
              ご希望に沿う料理は見つかりませんでした…
              <div className={styles.retry}>
                <Link href="/recommend/explore" replace>
                  もう一度検索する
                </Link>
              </div>
            </div>
          </>
        ) : (
          recommends.map((recommend, index) => (
            <CardHorizontal
              key={recommend.id}
              url={`/dish/${recommend.id}`}
              title={recommend.name}
              tag={index + 1}
              image={`/dish/id/${recommend.id}.webp`}
              description={<PaymentShort payments={payments[index]} />}
            />
          ))
        )}
      </div>
      <div className={styles.footer}>
        <div className={styles.button}>
          <RectButton color="red">
            <Link href="/webapp/home" replace>
              ホームへ戻る
            </Link>
          </RectButton>
        </div>
      </div>
    </div>
  );
}
