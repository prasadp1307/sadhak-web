"use client";

type AppToastProps = {
  message: string;
  variant?: "success" | "error";
  onDismiss?: () => void;
};

export function AppToast({ message, variant = "success", onDismiss }: AppToastProps) {
  const isError = variant === "error";
  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-[100] max-w-sm rounded-lg border px-4 py-3 shadow-lg ${
        isError
          ? "border-red-200 bg-red-50 text-red-900"
          : "border-emerald-200 bg-emerald-50 text-emerald-900"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium">{message}</p>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 text-xs font-semibold opacity-70 hover:opacity-100"
            aria-label="Dismiss"
          >
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
}
