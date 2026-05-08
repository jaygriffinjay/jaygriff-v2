import Image from "next/image";
import { cn } from "@/lib/utils";
import styles from "./my-stack.module.css";

export type ToolStatus = "active" | "occasional" | "benched" | "shelved";

interface ToolCardProps {
  logo: string;
  title: string;
  description: string;
  logoSize?: number;
  invert?: boolean;
  status?: ToolStatus;
}

export function ToolCard({ logo, title, description, logoSize = 60, invert = false }: ToolCardProps) {
  return (
    <div className={styles.toolCard}>
      <div className={styles.toolLogo} style={{ width: logoSize, height: logoSize }}>
        <Image
          src={logo}
          alt={`${title} logo`}
          width={logoSize}
          height={logoSize}
          className={cn(styles.toolLogoImg, invert && styles.toolLogoInvert)}
        />
      </div>
      <div>
        <strong className={styles.toolTitle}>{title}</strong>
        <p className={styles.toolDescription}>{description}</p>
      </div>
    </div>
  );
}
