"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type LoadingButtonProps = Omit<ButtonProps, "asChild"> & { loading?: boolean };

/** Keep the original label/width while preventing repeated submissions. */
export function LoadingButton({ loading = false, disabled, children, ...props }: LoadingButtonProps) {
  return <Button {...props} disabled={disabled || loading} aria-busy={loading}>
    <span className="relative inline-grid place-items-center">
      <span className={`col-start-1 row-start-1 inline-flex items-center gap-2 ${loading ? "opacity-0" : ""}`}>{children}</span>
      {loading && <Spinner aria-hidden="true" className="col-start-1 row-start-1" />}
    </span>
  </Button>;
}
