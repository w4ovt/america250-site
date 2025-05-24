// components/quillhero/quillhero.tsx
import { useLottie } from "lottie-react";
import { useState, useEffect } from "react";
import styles from "./quillhero.module.css";
import quillWriting from "./animations/quill-writing.json";
import quillReturn from "./animations/quill-return.json";

/**
 * quillhero component animates the Declaration quote and user's signature.
 */
export default function quillhero() {
  const [name, setName] = useState("");
  const [quoteComplete, setQuoteComplete] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const { View: QuoteQuill, play: playQuote } = useLottie({
    animationData: quillWriting,
    loop: false,
  });

  const { View: ReturnQuill, play: playReturn } = useLottie({
    animationData: quillReturn,
    loop: false,
  });

  const { View: SignatureQuill, play: playSignature } = useLottie({
    animationData: quillWriting,
    loop: false,
  });

  useEffect(() => {
    let cancelled = false;
    const runSequence = async () => {
      await playQuote();
      if (cancelled) return;
      await playReturn();
      if (cancelled) return;
      setQuoteComplete(true);
    };
    runSequence();
    return () => {
      cancelled = true;
    };
  }, [playQuote, playReturn]);

  useEffect(() => {
    if (!quoteComplete || name === "") return;
    let cancelled = false;
    const animateSignature = async () => {
      setIsSigning(true);
      await playSignature();
      if (cancelled) return;
      await playReturn();
      if (cancelled) return;
      setIsSigning(false);
    };
    animateSignature();
    return () => {
      cancelled = true;
    };
  }, [name, quoteComplete, playSignature, playReturn]);

  return (
    <div className={styles.container}>
      <svg
        className={styles.quoteSvg}
        aria-label="Animated quote from the Declaration of Independence"
        role="img"
      >
        <text className={styles.quoteText}>
          And for the support of this Declaration, with a firm reliance on the
          protection of divine Providence, we mutually pledge to each other our
          Lives, our Fortunes and our sacred Honor.
        </text>
      </svg>

      <div className={styles.quill}>{QuoteQuill}</div>

      {quoteComplete && (
        <div>
          <label htmlFor="signature-input" className={styles.visuallyHidden}>
            Sign your name (your signature will be animated below)
          </label>
          <input
            id="signature-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            placeholder="Sign your name..."
            className={styles.signatureInput}
            disabled={isSigning}
            aria-required="true"
            aria-describedby="signature-desc"
          />
          <span id="signature-desc" className={styles.visuallyHidden}>
            Your name will appear animated below in cursive script.
          </span>

          <svg
            className={styles.signatureSvg}
            role="img"
            aria-label={`Animated signature: ${name || "No signature yet"}`}
          >
            <text className={styles.signatureText} aria-live="polite">
              {name.split("").map((char, index) => (
                <tspan
                  key={index}
                  className={styles.char}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {char}
                </tspan>
              ))}
            </text>
          </svg>

          <div className={styles.quill}>{SignatureQuill}</div>
        </div>
      )}

      <div className={styles.quill}>{ReturnQuill}</div>
    </div>
  );
}