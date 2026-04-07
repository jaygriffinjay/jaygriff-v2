import { Button } from "@/components/ui/button";
import styles from "./admin.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className={styles.header}>
        <span className={styles.title}>Admin</span>
        <form action="/api/auth/signout" method="POST">
          <Button variant="ghost" size="sm" type="submit">
            Sign out
          </Button>
        </form>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
