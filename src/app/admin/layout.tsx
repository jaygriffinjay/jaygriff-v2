import Link from "next/link";
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
        <nav className={styles.nav}>
          <span className={styles.title}>Admin</span>
          <Link href="/admin/content" className={styles.navLink}>Content</Link>
          <Link href="/admin/pool" className={styles.navLink}>Pool</Link>
        </nav>
        <form action="/admin/signout" method="POST">
          <Button variant="ghost" size="sm" type="submit">
            Sign out
          </Button>
        </form>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
