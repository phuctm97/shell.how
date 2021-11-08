import { useCallback, useEffect, useState } from "react";
import copyToClipboard from "copy-to-clipboard";

/**
 * Copy the current URL to clipboard and clear the state after a short delay.
 */
export default function useCopyUrl(): [boolean, () => void] {
  const [hasCopied, setHasCopied] = useState(false);

  const copy = useCallback(() => {
    copyToClipboard(window.location.href);
    setHasCopied(true);
  }, [setHasCopied]);

  // Clear "Copied" after 3 seconds
  useEffect(() => {
    if (!hasCopied) return;
    const timeoutId = window.setTimeout(() => setHasCopied(false), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [hasCopied, setHasCopied]);

  return [hasCopied, copy];
}
