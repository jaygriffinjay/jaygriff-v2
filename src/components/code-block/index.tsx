import { cn } from "@/lib/utils";
import styles from "./code-block.module.css";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  /** Language identifier (e.g. "tsx", "css", "bash") */
  language?: string;
  /** Raw code string */
  children: string;
}

export function CodeBlock({ language, children, className, ...props }: CodeBlockProps) {
  return (
    <pre className={cn(styles.root, className)} data-language={language} {...props}>
      <code className={styles.code}>{children}</code>
    </pre>
  );
}
