"use client";

import React from "react";
import { Truck } from "lucide-react";

interface DeliveryInfoFormProps {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  streetAddress: string;
  onEmailChange: (v: string) => void;
  onFirstNameChange: (v: string) => void;
  onLastNameChange: (v: string) => void;
  onPhoneNumberChange: (v: string) => void;
  onStreetAddressChange: (v: string) => void;
  t: (key: string) => string;
}

export function DeliveryInfoForm({
  email,
  firstName,
  lastName,
  phoneNumber,
  streetAddress,
  onEmailChange,
  onFirstNameChange,
  onLastNameChange,
  onPhoneNumberChange,
  onStreetAddressChange,
  t,
}: DeliveryInfoFormProps) {
  return (
    <div className="bg-white border border-[#e2e2e7] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] p-8">
      <div className="flex items-center gap-3 pb-6 border-b border-[#e2e2e7]">
        <Truck className="text-[#0058bc]" size={20} />
        <h3
          className="text-lg font-black uppercase tracking-tight text-[#1a1c1f]"
          style={{ fontFamily: "var(--font-lexend)" }}
        >
          {t("checkout.deliveryInfo")}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Email row (Full width on md) */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-[#414755]">
            {t("checkout.emailAddress")}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="athlete@example.com"
            className="w-full h-12 px-4 rounded-xl border border-[#c1c6d7] bg-[#f9f9fe] text-xs font-semibold focus:border-primary outline-none transition-colors"
          />
        </div>

        {/* First Name */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-[#414755]">
            {t("checkout.firstName")}
          </label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            placeholder="John"
            className="w-full h-12 px-4 rounded-xl border border-[#c1c6d7] bg-[#f9f9fe] text-xs font-semibold focus:border-primary outline-none transition-colors"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-[#414755]">
            {t("checkout.lastName")}
          </label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            placeholder="Doe"
            className="w-full h-12 px-4 rounded-xl border border-[#c1c6d7] bg-[#f9f9fe] text-xs font-semibold focus:border-primary outline-none transition-colors"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-[#414755]">
            {t("checkout.phoneNumber")} *
          </label>
          <input
            type="text"
            required
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            placeholder="0987654321"
            className="w-full h-12 px-4 rounded-xl border border-[#c1c6d7] bg-[#f9f9fe] text-xs font-semibold focus:border-primary outline-none transition-colors"
          />
        </div>

        {/* Street Address */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-[#414755]">
            {t("checkout.streetAddress")}
          </label>
          <input
            type="text"
            required
            value={streetAddress}
            onChange={(e) => onStreetAddressChange(e.target.value)}
            placeholder="123 Performance Way"
            className="w-full h-12 px-4 rounded-xl border border-[#c1c6d7] bg-[#f9f9fe] text-xs font-semibold focus:border-primary outline-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
