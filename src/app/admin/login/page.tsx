"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { H2, Paragraph } from "@/components/typography";
import styles from "./login.module.css";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <H2 className={styles.heading}>Admin</H2>
        <Paragraph className={styles.subtitle}>
          Enter password to continue
        </Paragraph>

        <form action={formAction} className={styles.form}>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoFocus
              required
            />
          </div>

          {state?.error && <p className={styles.error}>{state.error}</p>}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
