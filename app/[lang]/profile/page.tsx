"use client";

import React, { useEffect, useState, useRef } from "react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { useTranslation } from "@/hooks/useTranslation";
import { profileService, UserProfileResponse } from "@/services/profileService";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Mail, 
  Award, 
  Lock, 
  Camera, 
  Loader2, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Gift, 
  Zap, 
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MembershipBadge from "@/components/ui/MembershipBadge";

const TIER_THRESHOLDS = {
  BRONZE: { limit: 0, next: "SILVER", nextLimit: 5000000, color: "from-amber-600 via-amber-700 to-amber-900", text: "text-amber-500" },
  SILVER: { limit: 5000000, next: "GOLD", nextLimit: 15000000, color: "from-slate-400 via-slate-500 to-slate-700", text: "text-slate-400" },
  GOLD: { limit: 15000000, next: "PLATINUM", nextLimit: 30000000, color: "from-yellow-400 via-amber-500 to-yellow-600", text: "text-yellow-500" },
  PLATINUM: { limit: 30000000, next: null, nextLimit: null, color: "from-cyan-400 via-blue-500 to-indigo-600", text: "text-cyan-400" }
};

export default function UserProfilePage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const { isLoggedIn, isLoading: isLoadingAuth } = useAuthContext();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await profileService.getProfile();
      setProfile(res.data);
      setFirstName(res.data.firstName || "");
      setLastName(res.data.lastName || "");
    } catch (err) {
      console.error("Failed to load user profile", err);
      toast.error(t("profile.orders.errorDetail") || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoadingAuth) {
      if (isLoggedIn) {
        fetchProfile();
      } else {
        router.push(`/${locale}/login`);
      }
    }
  }, [isLoadingAuth, isLoggedIn, locale, router]);

  if (isLoadingAuth) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center pt-32 pb-20 gap-4 text-on-surface-variant">
          <Loader2 size={40} className="animate-spin text-primary" />
          <p className="text-xs font-bold uppercase tracking-widest italic">SYNCING ATHLETE SESSION...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error(t("checkout.fieldsError"));
      return;
    }

    try {
      setIsSaving(true);
      const res = await profileService.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim()
      });
      setProfile(res.data);
      toast.success(t("profile.updateSuccess"));
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error(t("profile.updateError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file must be less than 5MB.");
      return;
    }

    try {
      setIsUploading(true);
      const res = await profileService.updateAvatar(file);
      setProfile(res.data);
      toast.success(t("profile.avatar.success"));
    } catch (err) {
      console.error("Failed to upload avatar", err);
      toast.error("Failed to upload avatar image");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center pt-32 pb-20 gap-4 text-on-surface-variant">
          <Loader2 size={40} className="animate-spin text-primary" />
          <p className="text-xs font-bold uppercase tracking-widest italic">LOADING ATHLETE FILE...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center pt-32 pb-20 gap-4 text-on-surface-variant">
          <p className="text-sm font-bold text-error">Could not load your athlete profile.</p>
          <Button onClick={fetchProfile} className="uppercase tracking-widest font-black text-xs h-12 px-6 rounded-xl">
            Retry
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate membership details
  const userTier = (profile.tier || "BRONZE").toUpperCase() as keyof typeof TIER_THRESHOLDS;
  const tierInfo = TIER_THRESHOLDS[userTier] || TIER_THRESHOLDS.BRONZE;

  // Dynamic spending fetched directly from the backend database!
  const simulatedSpending = profile.totalSpending ?? 0;

  const nextTier = tierInfo.next;
  const nextLimit = tierInfo.nextLimit;
  const currentLimit = tierInfo.limit;

  const progressPercent = nextLimit 
    ? Math.min(100, Math.max(0, ((simulatedSpending - currentLimit) / (nextLimit - currentLimit)) * 100))
    : 100;

  const remainingToNext = nextLimit ? nextLimit - simulatedSpending : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-8 max-w-[1200px] mx-auto w-full animate-in fade-in duration-700">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 font-bold text-[10px] text-on-surface-variant uppercase tracking-[0.15em]">
          <Link href={`/${locale}`} className="hover:text-primary transition-colors">
            HOME
          </Link>
          <span className="text-[14px] leading-none">›</span>
          <span className="text-on-surface">{t("profile.title")}</span>
        </div>

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-outline-variant pb-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-[40px] font-black italic tracking-tighter text-on-surface uppercase leading-none" style={{ fontFamily: 'var(--font-lexend)' }}>
              {t("profile.title")}
            </h1>
            <p className="text-on-surface-variant font-medium text-sm">{t("profile.subtitle")}</p>
          </div>
          <Link href={`/${locale}/profile/orders`}>
            <Button variant="outline" className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 border-outline-variant hover:border-primary">
              <ShoppingBag size={14} />
              {t("profile.orders.title")}
            </Button>
          </Link>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column Left: Membership (Col 7) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Loyalty Membership Card */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`relative overflow-hidden rounded-[2.5rem] p-8 text-white shadow-2xl bg-gradient-to-br ${tierInfo.color} h-[320px] flex flex-col justify-between`}
            >
              {/* Decorative Holographic Chip */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-white/80 animate-pulse" />
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/80">
                      {t("profile.membership.cardTitle")}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black italic uppercase tracking-wider font-lexend mt-2">
                    SPORT PRO <span className="text-white/60">ELITE</span>
                  </h2>
                </div>
                <Award size={40} className="text-white/85" />
              </div>

              {/* User Identity */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Athlete</p>
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-black uppercase tracking-wide">
                      {profile.lastName} {profile.firstName}
                    </p>
                    <MembershipBadge tier={profile.tier} size="sm" showLabel={true} className="bg-white/10 border-white/20 text-white hover:bg-white/20" />
                  </div>
                </div>
                <div className="flex justify-between items-end border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{t("profile.membership.currentTier")}</p>
                    <p className="text-lg font-black italic tracking-wider text-yellow-400">
                      {t(`profile.membership.${profile.tier.toLowerCase()}` as any)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{t("profile.membership.totalSpending")}</p>
                    <p className="text-lg font-black tracking-wide font-mono">
                      {formatCurrency(simulatedSpending)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Membership Progress Block */}
            <div className="bg-surface-container/30 border border-outline-variant p-8 rounded-[2rem] space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="font-lexend font-black text-on-surface uppercase tracking-wider text-sm">
                    {t("profile.membership.benefitsTitle")}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    {userTier === "PLATINUM" 
                      ? t("profile.membership.maxTier") 
                      : t("profile.membership.nextProgress").replace("{amount}", formatCurrency(remainingToNext)).replace("{nextTier}", t(`profile.membership.${nextTier?.toLowerCase()}` as any))}
                  </p>
                </div>
                <TrendingUp size={20} className="text-primary" />
              </div>

              {/* Progress Slider */}
              {nextLimit && (
                <div className="space-y-2">
                  <div className="relative w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full bg-primary rounded-full shadow-lg shadow-primary/30"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                    <span>{formatCurrency(currentLimit)}</span>
                    <span className="text-primary font-bold">{Math.round(progressPercent)}%</span>
                    <span>{formatCurrency(nextLimit)}</span>
                  </div>
                </div>
              )}

              {/* Exclusive Perks List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-outline-variant/50">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-surface-container-low/40">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary mt-0.5">
                    <Gift size={16} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-wider text-on-surface">Member discounts</h4>
                    <p className="text-[11px] text-on-surface-variant font-medium">
                      {userTier === "BRONZE" && "Base access to exclusive sport releases."}
                      {userTier === "SILVER" && "5% discount applied automatically on all orders."}
                      {userTier === "GOLD" && "10% discount applied automatically on all orders."}
                      {userTier === "PLATINUM" && "15% discount applied automatically on all orders."}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-surface-container-low/40">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary mt-0.5">
                    <Zap size={16} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-wider text-on-surface">Customization privilege</h4>
                    <p className="text-[11px] text-on-surface-variant font-medium">
                      {userTier === "BRONZE" && "Standard custom printing services."}
                      {userTier === "SILVER" && "Priority custom logo processing."}
                      {userTier === "GOLD" && "Free text & logo customization on gear."}
                      {userTier === "PLATINUM" && "Free ultimate 3D custom printing & VIP priority."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column Right: Profile Form (Col 5) */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container/30 border border-outline-variant p-8 rounded-[2rem] space-y-8">
              
              {/* Header */}
              <div className="space-y-1">
                <h3 className="font-lexend font-black text-on-surface uppercase tracking-wider text-sm">
                  {t("profile.personalInfo")}
                </h3>
                <p className="text-xs text-on-surface-variant font-medium">
                  Update your athlete file records.
                </p>
              </div>

              {/* Avatar Uploader Section */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                  <div className="w-28 h-28 rounded-full border-4 border-primary/20 overflow-hidden bg-surface-container-highest flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
                    {isUploading ? (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 size={24} className="animate-spin text-white" />
                      </div>
                    ) : null}
                    
                    {profile.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt="Profile Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={48} className="text-outline" />
                    )}

                    {/* Hover Change Trigger Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-300">
                      <Camera size={20} className="mb-1" />
                      <span className="text-[9px] font-black uppercase tracking-wider">{t("profile.avatar.hoverChange")}</span>
                    </div>
                  </div>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden" 
                  accept="image/*"
                />

                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  {isUploading ? t("profile.avatar.uploading") : "Max file size: 5MB"}
                </p>
              </div>

              {/* Form Input fields */}
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                
                {/* Disabled Email Field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface uppercase tracking-widest flex items-center gap-1.5">
                    <Mail size={12} className="text-on-surface-variant" />
                    {t("profile.email")}
                  </label>
                  <div className="relative">
                    <Input 
                      value={profile.email} 
                      disabled 
                      className="h-12 pl-4 pr-10 rounded-xl bg-surface-container-low border-outline-variant/60 text-on-surface-variant font-medium select-none shadow-inner"
                    />
                    <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline" />
                  </div>
                </div>

                {/* Last Name Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface uppercase tracking-widest">
                    {t("profile.lastName")}
                  </label>
                  <Input 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t("checkout.lastName")}
                    required
                    className="h-12 pl-4 rounded-xl bg-surface border-outline-variant/80 focus:border-primary focus:bg-surface transition-all font-inter text-sm shadow-sm"
                  />
                </div>

                {/* First Name Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface uppercase tracking-widest">
                    {t("profile.firstName")}
                  </label>
                  <Input 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t("checkout.firstName")}
                    required
                    className="h-12 pl-4 rounded-xl bg-surface border-outline-variant/80 focus:border-primary focus:bg-surface transition-all font-inter text-sm shadow-sm"
                  />
                </div>

                {/* Save Button */}
                <Button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/95 text-on-primary shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all font-lexend font-bold uppercase tracking-widest text-xs gap-2 mt-4"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {t("profile.saving")}
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      {t("profile.save")}
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
