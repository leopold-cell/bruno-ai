"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

// Lightweight code block. The original used Shiki (which bundles ~14 MB of
// syntax-highlighting grammars) — overkill for a CBT coach. Plain monospace
// rendering keeps the Worker bundle under Cloudflare's free-tier size limit.

type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
};

export const CodeBlock = ({
  code,
  language,
  showLineNumbers: _showLineNumbers,
  className,
  children,
  ...props
}: CodeBlockProps) => (
  <div
    className={cn(
      "group relative w-full overflow-hidden rounded-md border bg-muted/40 text-foreground",
      className
    )}
    data-language={language}
    {...props}
  >
    {children}
    <pre className="m-0 overflow-auto p-4 text-sm">
      <code className="font-mono text-sm">{code}</code>
    </pre>
  </div>
);

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  code?: string;
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const CodeBlockCopyButton = ({
  code = "",
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<number>(0);

  const copyToClipboard = useCallback(async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
      onError?.(new Error("Clipboard API not available"));
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      onCopy?.();
      timeoutRef.current = window.setTimeout(() => setIsCopied(false), timeout);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [code, onCopy, onError, timeout]);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <Button
      className={cn("shrink-0", className)}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <Icon size={14} />}
    </Button>
  );
};
