"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiClient, type ApiResponse } from "@/lib/api-client";

type OrderIntakeState = { paused: boolean; loading: boolean; unavailable: boolean };
export const ORDER_INTAKE_CHANGED_EVENT = "order-intake-changed";
const OrderIntakeContext = createContext<OrderIntakeState>({ paused: true, loading: true, unavailable: false });

export function OrderIntakeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OrderIntakeState>({ paused: true, loading: true, unavailable: false });
  useEffect(() => {
    let disposed = false;
    let pending = false;
    async function refresh() {
      if (pending) return;
      pending = true;
      try {
        const response = await apiClient.get<ApiResponse<{ paused: boolean }>>("/public-configs/order-intake", {
          cache: "no-store",
          signal: AbortSignal.timeout(10_000),
        });
        if (typeof response.data?.paused !== "boolean") throw new Error("Invalid order intake response");
        if (!disposed) setState({ paused: response.data.paused, loading: false, unavailable: false });
      } catch {
        if (!disposed) setState({ paused: true, loading: false, unavailable: true });
      } finally {
        pending = false;
      }
    }
    void refresh();
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    window.addEventListener(ORDER_INTAKE_CHANGED_EVENT, refresh);
    return () => {
      disposed = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener(ORDER_INTAKE_CHANGED_EVENT, refresh);
    };
  }, []);
  return <OrderIntakeContext.Provider value={state}>{children}</OrderIntakeContext.Provider>;
}

export const useOrderIntake = () => useContext(OrderIntakeContext);
