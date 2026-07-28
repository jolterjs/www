"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import GitHubIcon from "@/icons/github";

type RatingType = "yes" | "no";
type TurnstileStatus = "idle" | "verifying" | "success" | "error";

interface DocsFeedbackProps {
  slug: string;
  title: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "dark" | "light" | "auto";
          size?: "normal" | "compact" | "flexible";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export function DocsFeedback({ slug, title }: DocsFeedbackProps) {
  const [selectedRating, setSelectedRating] = useState<RatingType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [comment, setComment] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileStatus, setTurnstileStatus] =
    useState<TurnstileStatus>("idle");
  const [isTurnstileDisabledSession, setIsTurnstileDisabledSession] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const pendingSubmitRef = useRef(false);

  const editOnGithubUrl = `https://github.com/jolterjs/www/edit/main/src/content/docs/${slug}.mdx`;
  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

  // Load Cloudflare Turnstile script in background when form is opened
  useEffect(() => {
    if (!showForm || isSubmitted || isTurnstileDisabledSession) return;

    setTurnstileStatus("verifying");

    const renderWidget = () => {
      if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
            sitekey: siteKey,
            theme: "dark",
            size: "flexible",
            callback: (token: string) => {
              setTurnstileToken(token);
              setTurnstileStatus("success");
              setErrorMessage(null);

              if (pendingSubmitRef.current) {
                pendingSubmitRef.current = false;
                executeSubmit(token);
              }
            },
            "error-callback": () => {
              setTurnstileStatus("error");
              setIsTurnstileDisabledSession(true);
              setIsSubmitting(false);
              setErrorMessage(
                "Verification failed. Feedback is disabled for this session.",
              );
              pendingSubmitRef.current = false;
            },
            "expired-callback": () => {
              setTurnstileStatus("error");
              setIsTurnstileDisabledSession(true);
              setIsSubmitting(false);
              setErrorMessage(
                "Verification expired. Feedback is disabled for this session.",
              );
              pendingSubmitRef.current = false;
            },
          });
        } catch (e) {
          console.warn("Turnstile render warning:", e);
        }
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const existingScript = document.getElementById("cf-turnstile-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "cf-turnstile-script";
        script.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          renderWidget();
        };
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener("load", renderWidget);
      }
    }

    return () => {
      if (widgetIdRef.current && window.turnstile?.remove) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Ignore cleanup error if already removed
        }
        widgetIdRef.current = null;
      }
    };
  }, [showForm, isSubmitted, siteKey, isTurnstileDisabledSession]);

  const handleRatingClick = (rating: RatingType) => {
    setSelectedRating(rating);
    setErrorMessage(null);
    setShowForm(true);
  };

  const executeSubmit = async (token: string) => {
    if (!selectedRating) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          title,
          rating: selectedRating,
          comment,
          turnstileToken: token,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit feedback.");
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRating || isTurnstileDisabledSession) return;

    if (turnstileToken) {
      executeSubmit(turnstileToken);
    } else if (turnstileStatus === "error") {
      setIsTurnstileDisabledSession(true);
      setErrorMessage(
        "Verification failed. Feedback is disabled for this session.",
      );
    } else {
      // Waiting for background verification to finish
      setIsSubmitting(true);
      pendingSubmitRef.current = true;
    }
  };

  return (
    <div className="mt-12 border-t border-white/[0.09] pt-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={editOnGithubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-xs text-white/50 transition hover:text-white"
        >
          <GitHubIcon className="size-4 fill-current" />
          <span>Edit this page on GitHub</span>
        </a>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-white/60">
            Was this page helpful?
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleRatingClick("yes")}
              aria-label="Yes, this page was helpful"
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                selectedRating === "yes"
                  ? "border-white/60 bg-white/15 text-white shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                  : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              <ThumbsUp className="size-3.5" />
              <span>Yes</span>
            </button>

            <button
              type="button"
              onClick={() => handleRatingClick("no")}
              aria-label="No, this page was not helpful"
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                selectedRating === "no"
                  ? "border-white/60 bg-white/15 text-white shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                  : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              <ThumbsDown className="size-3.5" />
              <span>No</span>
            </button>
          </div>
        </div>
      </div>

      {showForm && !isSubmitted && (
        <form onSubmit={handleSubmit} className="mt-6 transition-all">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">
              {selectedRating === "yes"
                ? "Glad to hear it! Anything to add?"
                : "Sorry about that! What was confusing or missing?"}
            </h4>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setSelectedRating(null);
              }}
              className="cursor-pointer text-xs text-white/40 transition hover:text-white"
            >
              Cancel
            </button>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              selectedRating === "yes"
                ? "Optional: Tell us what worked well..."
                : "Describe what could be improved or fixed..."
            }
            rows={3}
            className="focus:ring-none mt-3 w-full rounded-2xl border border-white/10 bg-black/60 p-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
          />

          <div className="hidden" aria-hidden="true">
            <div ref={turnstileRef} />
          </div>

          <div className="mt-3 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting || isTurnstileDisabledSession}
              className="text-background inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  {turnstileToken ? "Sending..." : "Verifying..."}
                </>
              ) : isTurnstileDisabledSession ? (
                <>
                  <AlertCircle className="size-3.5 text-rose-500" />
                  Disabled (Verification Failed)
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  Submit Feedback
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-2.5 text-xs text-rose-400">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </form>
      )}

      {isSubmitted && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-300">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
          <p className="text-xs font-medium">
            Thank you for your feedback! Your response has been submitted to the
            maintainers.
          </p>
        </div>
      )}
    </div>
  );
}
