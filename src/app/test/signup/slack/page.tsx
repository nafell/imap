"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import React from "react";

import { RectButton } from "@/components/buttons/RectButton";

export default function Page() {
  const router = useRouter();

  const handleSignupSlack = async () => {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "slack",
      options: {
        scopes: "profile,email,openid",
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/`,
      },
    });

    if (error) {
      console.log(error);
      return;
    }

    router.push(data.url);
  };

  return (
    <div className="mx-auto my-16 w-64">
      <RectButton onClick={handleSignupSlack} color="blue">
        Slack Login
      </RectButton>
    </div>
  );
}
