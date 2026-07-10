import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import {
  Award,
  Globe,
  Calendar,
  Link as LinkIcon,
  BadgeCheck,
  CheckCircle2,
  UserPlus,
  BookOpen,
  Crown,
  Gem,
  Activity,
  Edit2,
  Save,
  X,
  Sparkles,
  ShieldCheck,
  Star,
  Settings,
  User as UserIcon
} from "lucide-react";
import { getUserProfileStats, saveUserProfile } from "../lib/db";
import { auth } from "../lib/firebase";
import { updateProfile } from "firebase/auth";
import { GsapCoverBackground } from "../components/GsapCoverBackground";
import { SocialSupportLinks } from "../components/SocialSupportLinks";
export default function UserProfile({
  profileId,
  currentUserId,
  currentUserName,
  currentUserEmail,
  onUpdateName,
  onUpdatePhoto,
  onUpdateCustomId,
  onStartQuiz,
  onShareQuiz,
  lang = "ar",
  colorTheme = "indigo",
  setColorTheme,
  onPremiumStatusChange = () => {
  }
}) {
  const isAr = lang === "ar";
  const isOwnProfile = profileId === currentUserId;
  const [profileData, setProfileData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [followersCount, setFollowersCount] = React.useState(0);
  const [followingCount, setFollowingCount] = React.useState(0);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(currentUserName);
  const [editBio, setEditBio] = React.useState("");
  const [editPhotoURL, setEditPhotoURL] = React.useState("");
  const [editRole, setEditRole] = React.useState("");
  const [editCountry, setEditCountry] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [editCustomId, setEditCustomId] = React.useState("");
  const [customIdError, setCustomIdError] = React.useState("");
  const [customIdSuggestions, setCustomIdSuggestions] = React.useState([]);
  const [isVerifyingCustomId, setIsVerifyingCustomId] = React.useState(false);
  const [promoCodeInput, setPromoCodeInput] = React.useState("");
  const [isRedeemingPromo, setIsRedeemingPromo] = React.useState(false);
  const [badgeSymbol, setBadgeSymbol] = React.useState("\u{1F6E1}\uFE0F");
  const [badgeColor, setBadgeColor] = React.useState("#3b82f6");
  const [githubUrl, setGithubUrl] = React.useState("");
  const [instagramUrl, setInstagramUrl] = React.useState("");
  const [linkedinUrl, setLinkedinUrl] = React.useState("");
  const [facebookUrl, setFacebookUrl] = React.useState("");
  const [chosenBg, setChosenBg] = React.useState("cosmic");
  const [bgSettings, setBgSettings] = React.useState({
    speed: 1,
    brightness: 100,
    glow: 1,
    density: 1,
    waveHeight: 1,
    theme: "default",
    blur: 5
  });
  const [coverText, setCoverText] = React.useState("");
  const [verifiedIcon, setVerifiedIcon] = React.useState("BadgeCheck");
  const [verifiedColor, setVerifiedColor] = React.useState("#3b82f6");
  const [verifiedShow, setVerifiedShow] = React.useState(true);
  const renderVerifiedIcon = (iconName, color, sizeClass = "w-6 h-6") => {
    const props = { className: `${sizeClass} drop-shadow-sm transition-transform hover:scale-110 duration-200 shrink-0`, style: { color } };
    switch (iconName) {
      case "CheckCircle2":
        return /* @__PURE__ */ jsx(CheckCircle2, { ...props });
      case "ShieldCheck":
        return /* @__PURE__ */ jsx(ShieldCheck, { ...props });
      case "Award":
        return /* @__PURE__ */ jsx(Award, { ...props });
      case "Crown":
        return /* @__PURE__ */ jsx(Crown, { ...props });
      case "Gem":
        return /* @__PURE__ */ jsx(Gem, { ...props });
      case "Star":
        return /* @__PURE__ */ jsx(Star, { ...props });
      case "BadgeCheck":
      default:
        return /* @__PURE__ */ jsx(BadgeCheck, { ...props });
    }
  };
  const [activeTab, setActiveTab] = React.useState("overview");
  const fetchFollowStats = async () => {
    if (!profileId) return;
    try {
      const res = await fetch(`/api/follows/${profileId}?viewerId=${currentUserId}`);
      if (res.ok) {
        const data = await res.json();
        setFollowersCount(data.followersCount || 0);
        setFollowingCount(data.followingCount || 0);
        setIsFollowing(data.isFollowing || false);
      }
    } catch (err) {
      console.error("Error fetching follow stats:", err);
    }
  };
  const handleToggleFollow = async () => {
    if (!currentUserId || currentUserId === profileId) return;
    try {
      const res = await fetch(`/api/follows/${profileId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId: currentUserId })
      });
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.following);
        fetchFollowStats();
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };
  const handleCheckCustomId = async (id) => {
    if (!id.trim()) {
      setCustomIdError("");
      setCustomIdSuggestions([]);
      return;
    }
    const clean = id.trim().toLowerCase().replace(/^@/, "");
    if (!/^[a-zA-Z0-9_]+$/.test(clean)) {
      setCustomIdError(isAr ? "\u064A\u062C\u0628 \u0623\u0646 \u064A\u062D\u062A\u0648\u064A \u0627\u0644\u0645\u0639\u0631\u0641 \u0639\u0644\u0649 \u0623\u062D\u0631\u0641 \u0648\u0623\u0631\u0642\u0627\u0645 \u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 \u0648\u0634\u0631\u0637\u0629 \u0633\u0641\u0644\u064A\u0629 (_) \u0641\u0642\u0637." : "ID must contain only alphanumeric characters and underscores (_).");
      setCustomIdSuggestions([]);
      return;
    }
    setIsVerifyingCustomId(true);
    try {
      const res = await fetch(`/api/profiles/check-custom-id/${clean}?userId=${profileId}`);
      if (res.ok) {
        const data = await res.json();
        if (!data.available) {
          setCustomIdError(isAr ? "\u0639\u0630\u0631\u0627\u064B\u060C \u0647\u0630\u0627 \u0627\u0644\u0645\u0639\u0631\u0651\u0641 \u0645\u0623\u062E\u0648\u0630 \u0628\u0627\u0644\u0641\u0639\u0644!" : "Sorry, this ID is taken!");
          setCustomIdSuggestions(data.suggestions || []);
        } else {
          setCustomIdError("");
          setCustomIdSuggestions([]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifyingCustomId(false);
    }
  };
  React.useEffect(() => {
    fetchFollowStats();
  }, [profileId, currentUserId]);
  React.useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      try {
        const stats = await getUserProfileStats(profileId);
        setProfileData(stats);
        if (stats) {
          if (stats.name) setEditName(stats.name);
          if (stats.bio) setEditBio(stats.bio);
          if (stats.photoURL) setEditPhotoURL(stats.photoURL);
          if (stats.customId) setEditCustomId(stats.customId);
          if (stats.badgeSymbol) setBadgeSymbol(stats.badgeSymbol);
          if (stats.badgeColor) setBadgeColor(stats.badgeColor);
          const locStr = stats.location || "";
          let parsedBg = "cosmic";
          let parsedCoverText = "";
          let parsedGithub = "";
          let parsedInstagram = "";
          let parsedLinkedin = "";
          let parsedFacebook = "";
          let parsedRole = "";
          let parsedCountry = "";
          let parsedVerifiedIcon = "BadgeCheck";
          let parsedVerifiedColor = "#3b82f6";
          let parsedVerifiedShow = stats.isPremium || false;
          if (locStr.includes("||verifiedIcon:")) {
            const iconPart = locStr.split("||verifiedIcon:")[1] || "";
            parsedVerifiedIcon = iconPart.split("||")[0] || "BadgeCheck";
          }
          if (locStr.includes("||verifiedColor:")) {
            const colorPart = locStr.split("||verifiedColor:")[1] || "";
            const rawCol = colorPart.split("||")[0] || "#3b82f6";
            try {
              parsedVerifiedColor = decodeURIComponent(rawCol);
            } catch (e) {
              parsedVerifiedColor = rawCol;
            }
          }
          if (locStr.includes("||verifiedShow:")) {
            const showPart = locStr.split("||verifiedShow:")[1] || "";
            parsedVerifiedShow = showPart.split("||")[0] === "true";
          } else if (stats.isPremium) {
            parsedVerifiedShow = true;
          }
          if (locStr.includes("||bg:")) {
            const afterBg = locStr.split("||bg:")[1] || "";
            const bgChunks = afterBg.split("||");
            parsedBg = bgChunks[0] || "cosmic";
            bgChunks.forEach((chunk) => {
              if (chunk.startsWith("coverText:")) parsedCoverText = chunk.substring(10);
              if (chunk.startsWith("github:")) parsedGithub = chunk.substring(7);
              if (chunk.startsWith("instagram:")) parsedInstagram = chunk.substring(10);
              if (chunk.startsWith("linkedin:")) parsedLinkedin = chunk.substring(9);
              if (chunk.startsWith("facebook:")) parsedFacebook = chunk.substring(9);
              if (chunk.startsWith("role:")) parsedRole = chunk.substring(5);
              if (chunk.startsWith("country:")) parsedCountry = chunk.substring(8);
            });
          } else {
            const parts = locStr.split("||");
            parts.forEach((p) => {
              if (p.startsWith("github:")) parsedGithub = p.substring(7);
              if (p.startsWith("instagram:")) parsedInstagram = p.substring(10);
              if (p.startsWith("linkedin:")) parsedLinkedin = p.substring(9);
              if (p.startsWith("facebook:")) parsedFacebook = p.substring(9);
              if (p.startsWith("role:")) parsedRole = p.substring(5);
              if (p.startsWith("country:")) parsedCountry = p.substring(8);
            });
          }
          let parsedBgSpeed = 1;
          let parsedBgBrightness = 100;
          let parsedBgGlow = 1;
          let parsedBgDensity = 1;
          let parsedBgWaveHeight = 1;
          let parsedBgTheme = "default";
          let parsedBgBlur = 5;
          if (locStr.includes("||bgSpeed:")) {
            const val = locStr.split("||bgSpeed:")[1]?.split("||")[0];
            if (val) parsedBgSpeed = parseFloat(val);
          }
          if (locStr.includes("||bgBrightness:")) {
            const val = locStr.split("||bgBrightness:")[1]?.split("||")[0];
            if (val) parsedBgBrightness = parseInt(val);
          }
          if (locStr.includes("||bgGlow:")) {
            const val = locStr.split("||bgGlow:")[1]?.split("||")[0];
            if (val) parsedBgGlow = parseFloat(val);
          }
          if (locStr.includes("||bgDensity:")) {
            const val = locStr.split("||bgDensity:")[1]?.split("||")[0];
            if (val) parsedBgDensity = parseFloat(val);
          }
          if (locStr.includes("||bgWaveHeight:")) {
            const val = locStr.split("||bgWaveHeight:")[1]?.split("||")[0];
            if (val) parsedBgWaveHeight = parseFloat(val);
          }
          if (locStr.includes("||bgTheme:")) {
            const val = locStr.split("||bgTheme:")[1]?.split("||")[0];
            if (val) parsedBgTheme = val;
          }
          if (locStr.includes("||bgBlur:")) {
            const val = locStr.split("||bgBlur:")[1]?.split("||")[0];
            if (val) parsedBgBlur = parseInt(val);
          }
          setChosenBg(parsedBg);
          setBgSettings({
            speed: parsedBgSpeed,
            brightness: parsedBgBrightness,
            glow: parsedBgGlow,
            density: parsedBgDensity,
            waveHeight: parsedBgWaveHeight,
            theme: parsedBgTheme,
            blur: parsedBgBlur
          });
          setCoverText(parsedCoverText);
          setGithubUrl(parsedGithub);
          setInstagramUrl(parsedInstagram);
          setLinkedinUrl(parsedLinkedin);
          setFacebookUrl(parsedFacebook);
          setEditRole(parsedRole);
          setEditCountry(parsedCountry);
          setVerifiedIcon(parsedVerifiedIcon);
          setVerifiedColor(parsedVerifiedColor);
          setVerifiedShow(parsedVerifiedShow);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, [profileId]);
  const handleSaveProfile = async () => {
    if (editCustomId.trim()) {
      const cleanCustomId = editCustomId.trim().toLowerCase().replace(/^@/, "");
      if (!/^[a-zA-Z0-9_]+$/.test(cleanCustomId)) {
        alert(isAr ? "\u0639\u0630\u0631\u0627\u064B\u060C \u064A\u062C\u0628 \u0623\u0646 \u064A\u062D\u062A\u0648\u064A \u0627\u0644\u0645\u0639\u0631\u0651\u0641 \u0627\u0644\u0645\u062E\u0635\u0635 \u0639\u0644\u0649 \u0623\u062D\u0631\u0641 \u0648\u0623\u0631\u0642\u0627\u0645 \u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 \u0648\u0634\u0631\u0637\u0629 \u0633\u0641\u0644\u064A\u0629 (_) \u0641\u0642\u0637." : "Custom ID must contain only alphanumeric characters and underscores (_).");
        return;
      }
      try {
        const res = await fetch(`/api/profiles/check-custom-id/${cleanCustomId}?userId=${profileId}`);
        if (res.ok) {
          const data = await res.json();
          if (!data.available) {
            alert(isAr ? "\u0645\u0639\u0631\u0651\u0641 \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u062E\u0635\u0635 \u0645\u0623\u062E\u0648\u0630 \u0628\u0627\u0644\u0641\u0639\u0644 \u0645\u0646 \u0642\u0650\u0628\u0644 \u0645\u0633\u062A\u062E\u062F\u0645 \u0622\u062E\u0631!" : "This Custom ID is already taken by another user!");
            if (data.suggestions && data.suggestions.length > 0) {
              setCustomIdSuggestions(data.suggestions);
            }
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    setIsSaving(true);
    try {
      if (auth.currentUser) {
        try {
          const safePhotoURL = editPhotoURL && !editPhotoURL.startsWith("data:") && editPhotoURL.length <= 2048 ? editPhotoURL : auth.currentUser.photoURL && !auth.currentUser.photoURL.startsWith("data:") && auth.currentUser.photoURL.length <= 2048 ? auth.currentUser.photoURL : "";
          await updateProfile(auth.currentUser, {
            displayName: editName,
            photoURL: safePhotoURL || null
          });
        } catch (authError) {
          console.warn("Could not update Firebase Auth profile attributes (photo URL too long or invalid), but continuing with DB save:", authError);
          try {
            await updateProfile(auth.currentUser, {
              displayName: editName
            });
          } catch (displayNameError) {
            console.error("Failed to update displayName on auth user:", displayNameError);
          }
        }
      }
      const serializedLocation = `||bg:${chosenBg}||coverText:${coverText.trim()}||github:${githubUrl.trim()}||instagram:${instagramUrl.trim()}||linkedin:${linkedinUrl.trim()}||facebook:${facebookUrl.trim()}||role:${editRole.trim()}||country:${editCountry.trim()}||verifiedIcon:${verifiedIcon}||verifiedColor:${encodeURIComponent(verifiedColor)}||verifiedShow:${verifiedShow}||bgSpeed:${bgSettings.speed}||bgBrightness:${bgSettings.brightness}||bgGlow:${bgSettings.glow}||bgDensity:${bgSettings.density}||bgWaveHeight:${bgSettings.waveHeight}||bgTheme:${bgSettings.theme}||bgBlur:${bgSettings.blur}`;
      await saveUserProfile(
        profileId,
        editName,
        editPhotoURL || void 0,
        currentUserEmail || void 0,
        editBio || void 0,
        serializedLocation,
        badgeSymbol,
        badgeColor,
        editCustomId || void 0
      );
      onUpdateName(editName);
      if (onUpdatePhoto) {
        onUpdatePhoto(editPhotoURL);
      }
      if (onUpdateCustomId) {
        onUpdateCustomId(editCustomId);
      }
      setIsEditing(false);
      setProfileData((prev) => prev ? {
        ...prev,
        name: editName,
        bio: editBio,
        photoURL: editPhotoURL,
        badgeSymbol,
        badgeColor,
        customId: editCustomId,
        location: serializedLocation
      } : null);
      alert(isAr ? "\u062A\u0645 \u062D\u0641\u0638 \u0645\u0644\u0641\u0643 \u0627\u0644\u0634\u062E\u0635\u064A \u0648\u0645\u0639\u0631\u0651\u0641\u0643 \u0627\u0644\u0645\u062E\u0635\u0635 \u0628\u0646\u062C\u0627\u062D!" : "Profile and Custom ID saved successfully!");
    } catch (e) {
      console.error(e);
      alert(isAr ? "\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A." : "Error saving profile modifications.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleRedeemPromo = async () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) {
      alert(isAr ? "\u064A\u0631\u062C\u0649 \u0643\u062A\u0627\u0628\u0629 \u0643\u0648\u062F \u0627\u0644\u062E\u0635\u0645 \u0623\u0648\u0644\u0627\u064B." : "Please enter a promocode first.");
      return;
    }
    setIsRedeemingPromo(true);
    try {
      let discountPercent = 0;
      let couponValid = false;
      let couponObj = null;
      if (code === "QUIZ50" || code === "SUPER50" || code === "GEMINI55") {
        discountPercent = 50;
        couponValid = true;
      } else if (code === "FREE100" || code === "ADMAN100") {
        discountPercent = 100;
        couponValid = true;
      } else {
        const res = await fetch(`/api/coupons/${code}`);
        if (res.ok) {
          couponObj = await res.json();
          if (couponObj.isActive) {
            if (couponObj.expiryDate) {
              const expDate = new Date(couponObj.expiryDate);
              const now = /* @__PURE__ */ new Date();
              if (expDate < now) {
                alert(isAr ? "\u0639\u0630\u0631\u0627\u064B\u060C \u0643\u0648\u062F \u0627\u0644\u062E\u0635\u0645 \u0647\u0630\u0627 \u0645\u0646\u062A\u0647\u064A \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629." : "Sorry, this promocode has expired.");
                setIsRedeemingPromo(false);
                return;
              }
            }
            if (couponObj.maxUses && couponObj.usedCount !== void 0 && couponObj.usedCount >= couponObj.maxUses) {
              alert(isAr ? "\u0639\u0630\u0631\u0627\u064B\u060C \u0627\u0633\u062A\u0646\u0641\u062F \u0647\u0630\u0627 \u0627\u0644\u0643\u0648\u062F \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645." : "Sorry, this coupon has reached its maximum uses.");
              setIsRedeemingPromo(false);
              return;
            }
            discountPercent = couponObj.discountPercent;
            couponValid = true;
          }
        }
      }
      if (!couponValid) {
        alert(isAr ? "\u0639\u0630\u0631\u0627\u064B\u060C \u0643\u0648\u062F \u0627\u0644\u062E\u0635\u0645 \u0647\u0630\u0627 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D \u0623\u0648 \u0627\u0646\u062A\u0647\u062A \u0635\u0644\u0627\u062D\u064A\u062A\u0647." : "Invalid or expired discount code.");
        setIsRedeemingPromo(false);
        return;
      }
      if (discountPercent === 100) {
        const requestId = "req-auto-" + Math.random().toString(36).substring(2, 11);
        const autoUpgradeRes = await fetch("/api/premium-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: requestId,
            userId: profileId,
            name: profileData?.name || currentUserName,
            email: currentUserEmail || "",
            planName: "Educator Gold (Instant Promo)",
            planPrice: "\u0641\u0648\u0631\u064A 100%",
            paymentScreenshot: "PROMO_100_FREE_PROFILE",
            promoCodeUsed: `${code} (100%)`,
            status: "approved",
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          })
        });
        if (autoUpgradeRes.ok) {
          alert(
            isAr ? `\u062A\u0647\u0627\u0646\u064A\u0646\u0627! \u{1F389} \u062A\u0645 \u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u062E\u0635\u0645 \u0627\u0644\u062D\u0635\u0631\u064A \u0628\u0646\u0633\u0628\u0629 100% \u0628\u0646\u062C\u0627\u062D \u0648\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0630\u0647\u0628\u064A\u0629 \u0644\u062D\u0633\u0627\u0628\u0643 \u0645\u0628\u0627\u0634\u0631\u0629 \u062F\u0648\u0646 \u0627\u0644\u062D\u0627\u062C\u0629 \u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0645\u0634\u0631\u0641!` : `Congratulations! \u{1F389} 100% discount applied. Educator Gold active directly without admin review!`
          );
          onPremiumStatusChange(true, "Educator Gold (300 EGP)");
          const stats = await getUserProfileStats(profileId);
          setProfileData(stats);
          setPromoCodeInput("");
        } else {
          alert(isAr ? "\u0639\u0630\u0631\u0627\u064B\u060C \u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A." : "Error performing automatic upgrade.");
        }
      } else {
        alert(
          isAr ? `\u0643\u0648\u062F \u0627\u0644\u062E\u0635\u0645 \u0627\u0644\u0645\u0643\u062A\u0648\u0628 \u0635\u0627\u0644\u062D \u0648\u064A\u0648\u0641\u0631 \u0644\u0643 \u062E\u0635\u0645 %${discountPercent}. \u064A\u0631\u062C\u0649 \u0627\u0633\u062A\u062E\u062F\u0627\u0645\u0647 \u0639\u0646\u062F \u0627\u0644\u062A\u0631\u0642\u064A\u0629 \u0648\u0627\u0644\u062F\u0641\u0639 \u0645\u0646 \u062A\u0628\u0648\u064A\u0628 "\u0628\u0627\u0642\u0627\u062A \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643" \u0644\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u062E\u0641\u0636 \u0639\u0644\u0649 \u0627\u0644\u0633\u0639\u0631.` : `This code is valid and provides a ${discountPercent}% discount! Please apply it in the "Subscription Plans" tab upon checkout.`
        );
      }
    } catch (err) {
      console.error(err);
      alert(isAr ? "\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0641\u062D\u0635 \u0627\u0644\u0643\u0648\u062F." : "Error validating discount code.");
    } finally {
      setIsRedeemingPromo(false);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-96", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) });
  }
  const displayBio = profileData?.bio || (isAr ? "\u0645\u0639\u0644\u0645 \u0648\u0645\u0647\u062A\u0645 \u0628\u062A\u0642\u0646\u064A\u0627\u062A \u0627\u0644\u062A\u0639\u0644\u064A\u0645 \u0627\u0644\u062D\u062F\u064A\u062B\u0629 \u0648\u0646\u0634\u0631 \u0627\u0644\u0645\u0639\u0631\u0641\u0629." : "Educator & EdTech enthusiast spreading knowledge.");
  const displayPhotoURL = profileData?.photoURL || auth.currentUser?.photoURL;
  const role = editRole || (isAr ? "\u0637\u0627\u0644\u0628" : "Student");
  const country = editCountry || (isAr ? "\u0645\u0635\u0631" : "Egypt");
  const joinDate = new Date(profileData?.joinedDate || /* @__PURE__ */ new Date()).toLocaleDateString(isAr ? "ar-EG" : "en-US", { year: "numeric", month: "long" });
  const isPremium = profileData?.planName && profileData.planName !== "Free";
  const planName = profileData?.planName || "Free";
  const completionsCount = profileData?.completions?.length || 0;
  const quizzesCreatedCount = profileData?.createdQuizzes?.length || 0;
  const level = Math.max(1, Math.floor(completionsCount / 2) + 1);
  let spaceBadgeName = isAr ? "\u0631\u0627\u0626\u062F \u0641\u0636\u0627\u0621 \u0645\u0628\u062A\u062F\u0626" : "Space Cadet";
  let spaceBadgeIcon = "\u{1F680}";
  if (completionsCount >= 50) {
    spaceBadgeName = isAr ? "\u0639\u0628\u0642\u0631\u064A \u0627\u0644\u062B\u0642\u0628 \u0627\u0644\u0623\u0633\u0648\u062F" : "Black Hole Genius";
    spaceBadgeIcon = "\u{1F30C}";
  } else if (completionsCount >= 20) {
    spaceBadgeName = isAr ? "\u0643\u0627\u0628\u062A\u0646 \u0627\u0644\u0645\u062C\u0631\u0629" : "Galaxy Captain";
    spaceBadgeIcon = "\u{1F6F8}";
  } else if (completionsCount >= 5) {
    spaceBadgeName = isAr ? "\u0645\u0644\u0627\u062D \u0627\u0644\u0646\u062C\u0648\u0645" : "Star Navigator";
    spaceBadgeIcon = "\u2B50";
  }
  const xpForNextLevel = 2;
  const currentLevelProgress = completionsCount % 2 / 2 * 100;
  const totalKnowledgePoints = (profileData?.completions || []).reduce((sum, c) => sum + c.score * 150, 0);
  const hasPerfectScore = (profileData?.completions || []).some((c) => c.score === c.totalQuestions && c.totalQuestions > 0);
  const achievements = [
    {
      id: "step_one",
      titleAr: "\u0627\u0644\u062E\u0637\u0648\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 \u0627\u0644\u0643\u0648\u0646\u064A\u0629",
      titleEn: "Cosmo First Step",
      descAr: "\u0627\u062A\u062E\u0637\u0649 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u0627\u0644\u0623\u0648\u0644 \u0648\u0627\u0641\u062A\u062D \u0628\u0648\u0627\u0628\u0627\u062A \u0627\u0644\u0645\u0639\u0631\u0641\u0629.",
      descEn: "Cross the first educational test successfully.",
      unlocked: completionsCount >= 1,
      progress: completionsCount >= 1 ? "1 / 1" : "0 / 1",
      percentage: completionsCount >= 1 ? 100 : 0,
      icon: "\u{1F393}",
      accentColor: "border-blue-500 text-blue-500 bg-blue-500/10"
    },
    {
      id: "knowledge_gatherer",
      titleAr: "\u062C\u0627\u0645\u0639 \u0627\u0644\u0646\u0642\u0627\u0637 \u0627\u0644\u0643\u0648\u0646\u064A",
      titleEn: "Cosmo Gatherer",
      descAr: "\u0627\u062C\u0645\u0639 500 \u0646\u0642\u0637\u0629 \u0641\u0645\u0627 \u0641\u0648\u0642 \u0645\u0646 \u0625\u062A\u0642\u0627\u0646 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A \u0627\u0644\u0639\u0644\u0645\u064A\u0629.",
      descEn: "Amass 500 Knowledge Points through quiz scores.",
      unlocked: totalKnowledgePoints >= 500,
      progress: `${Math.min(totalKnowledgePoints, 500)} / 500`,
      percentage: Math.min(Math.round(totalKnowledgePoints / 500 * 100), 100),
      icon: "\u26A1",
      accentColor: "border-amber-500 text-amber-500 bg-amber-500/10"
    },
    {
      id: "active_scholar",
      titleAr: "\u0627\u0644\u0645\u0643\u062A\u0634\u0641 \u0627\u0644\u062F\u0627\u0626\u0645",
      titleEn: "Persistent Scholar",
      descAr: "\u0642\u0645 \u0628\u0625\u0646\u0647\u0627\u0621 5 \u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A \u0639\u0644\u0645\u064A\u0629 \u0645\u0645\u064A\u0632\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644.",
      descEn: "Complete 5 educational quizzes completely.",
      unlocked: completionsCount >= 5,
      progress: `${Math.min(completionsCount, 5)} / 5`,
      percentage: Math.min(Math.round(completionsCount / 5 * 100), 100),
      icon: "\u{1F525}",
      accentColor: "border-orange-500 text-orange-500 bg-orange-500/10"
    },
    {
      id: "perfectionist",
      titleAr: "\u0642\u0646\u0627\u0635 \u0627\u0644\u062F\u0642\u0629 \u0627\u0644\u0641\u0627\u0626\u0642\u0629",
      titleEn: "Ultimate Perfectionist",
      descAr: "\u0627\u062D\u0635\u0644 \u0639\u0644\u0649 \u0646\u062A\u064A\u062C\u0629 \u0643\u0627\u0645\u0644\u0629 \u0628\u0646\u0633\u0628\u0629 %100 \u0641\u064A \u0623\u064A \u0627\u062E\u062A\u0628\u0627\u0631.",
      descEn: "Attain a flawless 100% score on any solved quiz.",
      unlocked: hasPerfectScore,
      progress: hasPerfectScore ? "1 / 1" : "0 / 1",
      percentage: hasPerfectScore ? 100 : 0,
      icon: "\u2B50",
      accentColor: "border-emerald-500 text-emerald-500 bg-emerald-500/10"
    },
    {
      id: "creator_architect",
      titleAr: "\u0635\u0627\u0646\u0639 \u0627\u0644\u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u0645\u0628\u062F\u0639",
      titleEn: "Enlightened Architect",
      descAr: "\u0627\u0646\u0634\u0631 \u0623\u0648\u0644 \u0627\u062E\u062A\u0628\u0627\u0631 \u062A\u0641\u0627\u0639\u0644\u064A \u0641\u064A \u0627\u0644\u0645\u062C\u062A\u0645\u0639 \u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u0628\u0642\u064A\u0629 \u0627\u0644\u0637\u0644\u0627\u0628.",
      descEn: "Publish your first interactive study quiz.",
      unlocked: quizzesCreatedCount >= 1,
      progress: quizzesCreatedCount >= 1 ? "1 / 1" : "0 / 1",
      percentage: quizzesCreatedCount >= 1 ? 100 : 0,
      icon: "\u{1F451}",
      accentColor: "border-purple-500 text-purple-500 bg-purple-500/10"
    },
    {
      id: "points_guru",
      titleAr: "\u062D\u0643\u064A\u0645 \u0627\u0644\u0645\u0639\u0631\u0641\u0629 \u0627\u0644\u0645\u0637\u0644\u0642",
      titleEn: "Academic Guru",
      descAr: "\u0627\u062D\u0635\u062F \u0623\u0643\u062B\u0631 \u0645\u0646 2000 \u0646\u0642\u0637\u0629 \u0643\u0648\u0632\u0645\u0648 \u0639\u0644\u0645\u064A\u0629 \u0645\u062E\u0635\u0635\u0629.",
      descEn: "Accumulate more than 2,000 knowledge points.",
      unlocked: totalKnowledgePoints >= 2e3,
      progress: `${Math.min(totalKnowledgePoints, 2e3)} / 2000`,
      percentage: Math.min(Math.round(totalKnowledgePoints / 2e3 * 100), 100),
      icon: "\u{1F3C6}",
      accentColor: "border-rose-500 text-rose-500 bg-rose-500/10"
    }
  ];
  const availableBadges = [
    { icon: "\u{1F6E1}\uFE0F", label: isAr ? "\u062D\u0627\u0645\u064A \u0627\u0644\u0645\u0639\u0631\u0641\u0629" : "Knowledge Shield" },
    { icon: "\u{1F680}", label: isAr ? "\u0645\u0633\u062A\u0643\u0634\u0641 \u0627\u0644\u0641\u0636\u0627\u0621" : "Cosmo Rocket" },
    { icon: "\u{1F393}", label: isAr ? "\u0628\u0627\u062D\u062B \u0623\u0643\u0627\u062F\u064A\u0645\u064A" : "Scholar" },
    { icon: "\u{1F525}", label: isAr ? "\u0635\u0627\u062D\u0628 \u0627\u0644\u0634\u063A\u0641" : "Passion Fire" },
    { icon: "\u{1F3C6}", label: isAr ? "\u0627\u0644\u0628\u0637\u0644 \u0627\u0644\u0643\u0648\u0646\u064A" : "Champion" },
    { icon: "\u{1F48E}", label: isAr ? "\u0627\u0644\u0639\u0636\u0648 \u0627\u0644\u0646\u0627\u062F\u0631" : "Rare Gem" },
    { icon: "\u{1F451}", label: isAr ? "\u0627\u0644\u0645\u0644\u0643 \u0627\u0644\u0643\u0648\u0646\u064A" : "Cosmo King" },
    { icon: "\u2705", label: isAr ? "\u062A\u0648\u062B\u064A\u0642 \u0642\u064A\u0627\u0633\u064A" : "Standard Verified" },
    { icon: "\u2611\uFE0F", label: isAr ? "\u062A\u0648\u062B\u064A\u0642 \u0627\u062D\u062A\u0631\u0627\u0641\u064A" : "Pro Verified" },
    { icon: "\u2714\uFE0F", label: isAr ? "\u062A\u0648\u062B\u064A\u0642 \u0623\u0633\u0627\u0633\u064A" : "Basic Verified" },
    { icon: "\u{1F31F}", label: isAr ? "\u0646\u062C\u0645 \u0627\u0644\u062A\u0648\u062B\u064A\u0642" : "Star Verified" },
    { icon: "\u{1F3C5}", label: isAr ? "\u0634\u0627\u0631\u0629 \u0627\u0644\u062A\u0648\u062B\u064A\u0642 \u0627\u0644\u0645\u0627\u0633\u064A\u0629" : "Diamond VerifiedBadge" },
    { icon: "\u{1F947}", label: isAr ? "\u062A\u0648\u062B\u064A\u0642 \u0630\u0647\u0628\u064A" : "Gold Verified" },
    { icon: "\u2B50", label: isAr ? "\u062A\u0648\u062B\u064A\u0642 \u0645\u0645\u064A\u0632" : "Featured Verified" },
    { icon: "\u2747\uFE0F", label: isAr ? "\u062A\u0648\u062B\u064A\u0642 \u0623\u062E\u0636\u0631" : "Green Verified" }
  ];
  const badgeColors = [
    { value: "#3b82f6", label: isAr ? "\u0623\u0632\u0631\u0642 \u0641\u0636\u0627\u0626\u064A" : "Space Blue" },
    { value: "#8b5cf6", label: isAr ? "\u0628\u0646\u0641\u0633\u062C\u064A \u0627\u0644\u0633\u062F\u064A\u0645" : "Nebula Purple" },
    { value: "#10b981", label: isAr ? "\u0623\u062E\u0636\u0631 \u0632\u0645\u0631\u062F\u064A" : "Emerald Green" },
    { value: "#f59e0b", label: isAr ? "\u0630\u0647\u0628\u064A \u0646\u0627\u0635\u0639" : "Solar Gold" },
    { value: "#ef4444", label: isAr ? "\u0642\u0631\u0645\u0632\u064A \u0643\u0648\u0646\u064A" : "Cosmo Crimson" },
    { value: "#ec4899", label: isAr ? "\u0648\u0631\u062F\u064A \u0641\u0636\u0627\u0626\u064A" : "Space Pink" }
  ];
  const displayLocation = profileData?.location || "";
  let displayVerifiedIcon = "BadgeCheck";
  let displayVerifiedColor = "#3b82f6";
  let displayVerifiedShow = profileData?.isPremium || false;
  if (displayLocation.includes("||verifiedIcon:")) {
    const iconPart = displayLocation.split("||verifiedIcon:")[1] || "";
    displayVerifiedIcon = iconPart.split("||")[0] || "BadgeCheck";
  }
  if (displayLocation.includes("||verifiedColor:")) {
    const colorPart = displayLocation.split("||verifiedColor:")[1] || "";
    const rawCol = colorPart.split("||")[0] || "#3b82f6";
    try {
      displayVerifiedColor = decodeURIComponent(rawCol);
    } catch (e) {
      displayVerifiedColor = rawCol;
    }
  }
  if (displayLocation.includes("||verifiedShow:")) {
    const showPart = displayLocation.split("||verifiedShow:")[1] || "";
    displayVerifiedShow = showPart.split("||")[0] === "true";
  } else if (profileData?.isPremium) {
    displayVerifiedShow = true;
  } else {
    if (displayLocation.includes("||verifiedIcon:")) {
      displayVerifiedShow = true;
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto space-y-8 animate-fade-in pb-12 text-slate-800 dark:text-slate-100", style: { direction: isAr ? "rtl" : "ltr" }, children: [
    /* @__PURE__ */ jsxs("section", { className: "relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "h-44 md:h-56 relative rounded-t-3xl overflow-hidden", children: [
        /* @__PURE__ */ jsx(GsapCoverBackground, { mode: chosenBg || "cosmic" }),
        isPremium && coverText && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center p-4 z-10 pointer-events-none", children: /* @__PURE__ */ jsx("div", { className: "bg-white/15 dark:bg-black/35 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/25 dark:border-white/10 text-center max-w-lg shadow-xl animate-fade-in translate-y-2", children: /* @__PURE__ */ jsx("p", { className: "text-white text-xs md:text-sm font-black tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]", children: coverText }) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "px-6 pb-6 md:px-10 md:pb-8 relative", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center sm:items-end gap-4 md:gap-6 text-center sm:text-right", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-800 shrink-0 relative flex items-center justify-center", children: [
            displayPhotoURL ? /* @__PURE__ */ jsx("img", { src: displayPhotoURL, alt: "Profile", className: "w-[100%] h-[100%] object-cover rounded-full" }) : /* @__PURE__ */ jsx("span", { className: "text-4xl font-black text-primary uppercase", children: (profileData?.name || currentUserName).charAt(0) }),
            isPremium && /* @__PURE__ */ jsx("div", { className: "absolute bottom-1 right-1 w-7 h-7 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-lg", children: planName.toLowerCase().includes("diamond") ? /* @__PURE__ */ jsx(Gem, { className: "w-3.5 h-3.5 text-white" }) : /* @__PURE__ */ jsx(Crown, { className: "w-3.5 h-3.5 text-white" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-2 w-full text-right", style: { textAlign: isAr ? "right" : "left" }, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center sm:justify-start gap-2.5", children: [
              /* @__PURE__ */ jsxs("h1", { className: "text-2xl md:text-3xl font-black font-display text-slate-900 dark:text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)] dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)] flex items-center gap-1.5", children: [
                profileData?.name || currentUserName,
                displayVerifiedShow && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5 shrink-0 bg-white/55 dark:bg-slate-900/55 rounded-full px-1.5 py-1 backdrop-blur-sm border border-slate-200/40 dark:border-slate-800/40", children: [
                  /* @__PURE__ */ jsx("span", { title: isAr ? "\u062A\u0648\u062B\u064A\u0642 \u0627\u0644\u062D\u0633\u0627\u0628" : "Account Verified", children: renderVerifiedIcon(displayVerifiedIcon, displayVerifiedColor, "w-6 h-6") }),
                  isPremium && (planName.toLowerCase().includes("pro") || planName.toLowerCase().includes("premium") || planName.toLowerCase().includes("diamond") || planName.toLowerCase().includes("founder")) && /* @__PURE__ */ jsx("span", { title: isAr ? "\u062A\u0648\u062B\u064A\u0642 \u0627\u0644\u0645\u0628\u062F\u0639\u064A\u0646" : "Pro Verified", children: /* @__PURE__ */ jsx(BadgeCheck, { className: "w-6 h-6 text-emerald-500 drop-shadow-sm" }) })
                ] })
              ] }),
              isPremium && /* @__PURE__ */ jsxs(
                "span",
                {
                  className: "px-2.5 py-1 text-[10px] font-black rounded-lg text-white flex items-center gap-1 hover:scale-105 transition-transform",
                  style: { backgroundColor: profileData?.badgeColor || badgeColor },
                  children: [
                    /* @__PURE__ */ jsx("span", { children: profileData?.badgeSymbol || badgeSymbol }),
                    /* @__PURE__ */ jsx("span", { children: isAr ? "\u0634\u0627\u0631\u0629 \u062A\u0648\u062B\u064A\u0642 \u0645\u062E\u0635\u0635\u0629" : "Custom Verified" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-1.5 justify-center sm:justify-start", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-primary dark:text-violet-400 font-mono", children: [
                "@",
                profileData?.customId || `${profileData?.name?.toLowerCase().replace(/\s+/g, "") || "user"}_${profileId.substring(0, 4)}`
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    const username = profileData?.customId || `${profileData?.name?.toLowerCase().replace(/\s+/g, "") || "user"}_${profileId.substring(0, 4)}`;
                    navigator.clipboard.writeText(username);
                    alert(isAr ? "\u062A\u0645 \u0646\u0633\u062E \u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0628\u0646\u062C\u0627\u062D!" : "Username copied successfully!");
                  },
                  className: "flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary hover:border-primary-light transition-all cursor-pointer font-extrabold select-none hover:scale-105 active:scale-95",
                  title: isAr ? "\u0646\u0633\u062E \u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645" : "Copy Username",
                  id: "copy-username-btn",
                  children: [
                    /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 text-slate-400 dark:text-slate-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" }) }),
                    /* @__PURE__ */ jsx("span", { children: isAr ? "\u0646\u0633\u062E" : "Copy" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center sm:justify-start gap-4 mt-2.5 text-xs font-bold text-slate-600 dark:text-slate-350 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/40 py-1.5 px-3 rounded-xl w-fit max-w-full", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("span", { className: "font-extrabold text-slate-900 dark:text-white text-sm", children: followersCount }),
                /* @__PURE__ */ jsx("span", { className: "text-slate-400 dark:text-slate-500 font-medium", children: isAr ? "\u0645\u062A\u0627\u0628\u0639" : "followers" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("span", { className: "font-extrabold text-slate-900 dark:text-white text-sm", children: followingCount }),
                /* @__PURE__ */ jsx("span", { className: "text-slate-400 dark:text-slate-500 font-medium", children: isAr ? "\u064A\u062A\u0627\u0628\u0639" : "following" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center sm:justify-end gap-3 w-full md:w-auto", children: [
          isOwnProfile ? /* @__PURE__ */ jsx(Fragment, { children: isEditing ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("button", { onClick: handleSaveProfile, disabled: isSaving, className: "px-5 py-2.5 rounded-full font-bold text-xs bg-primary text-white shadow hover:bg-primary/95 transition-colors flex items-center gap-2 cursor-pointer", children: [
              /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
              isAr ? "\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A" : "Save Changes"
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setIsEditing(false), className: "px-5 py-2.5 rounded-full font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer", children: [
              /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }),
              isAr ? "\u0625\u0644\u063A\u0627\u0621" : "Cancel"
            ] })
          ] }) : /* @__PURE__ */ jsxs("button", { onClick: () => setIsEditing(true), className: "px-5 py-2.5 rounded-full font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700 transition-colors flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx(Edit2, { className: "w-3.5 h-3.5 text-primary" }),
            isAr ? "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u0627\u0645\u0644" : "Comprehensive Edit"
          ] }) }) : /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleToggleFollow,
              className: `px-5 py-2.5 rounded-full font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${isFollowing ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200" : "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90"}`,
              children: isFollowing ? isAr ? "\u0645\u064F\u062A\u0627\u0628\u0639" : "Following" : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(UserPlus, { className: "w-3.5 h-3.5" }),
                isAr ? "\u0645\u062A\u0627\u0628\u0639\u0629" : "Follow"
              ] })
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                const url = window.location.origin + "/#/profile/" + profileId;
                navigator.clipboard.writeText(url);
                alert(isAr ? "\u062A\u0645 \u0646\u0633\u062E \u0631\u0627\u0628\u0637 \u0645\u0644\u0641\u0643 \u0627\u0644\u0634\u062E\u0635\u064A \u0628\u0646\u062C\u0627\u062D!" : "Profile Link copied!");
              },
              className: "px-5 py-2.5 rounded-full font-bold text-xs bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/35 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] shadow-sm animate-pulse-subtle",
              children: [
                /* @__PURE__ */ jsx(LinkIcon, { className: "w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" }),
                isAr ? "\u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u062D\u0633\u0627\u0628" : "Share Account"
              ]
            }
          )
        ] })
      ] }) })
    ] }),
    isEditing && /* @__PURE__ */ jsxs("section", { className: "bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] p-6 sm:p-8 space-y-8 animate-fade-in shadow-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-primary/10 rounded-xl", children: /* @__PURE__ */ jsx(Settings, { className: "w-6 h-6 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-black text-lg text-slate-800 dark:text-white", children: isAr ? "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u0634\u0627\u0645\u0644\u0629" : "Comprehensive Settings" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium", children: isAr ? "\u0642\u0645 \u0628\u062A\u0647\u064A\u0626\u0629 \u0645\u0638\u0647\u0631 \u0648\u062A\u0641\u0627\u0635\u064A\u0644 \u062D\u0633\u0627\u0628\u0643 \u0627\u0644\u0634\u062E\u0635\u064A \u0648\u0633\u0645\u0629 \u0627\u0644\u062A\u0637\u0628\u064A\u0642" : "Configure your profile details and application theme" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-100 dark:border-slate-800/60 space-y-4 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2 border-b border-slate-100 dark:border-slate-800/60 pb-2", children: [
              /* @__PURE__ */ jsx(UserIcon, { className: "w-4 h-4 text-slate-400" }),
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-black text-slate-700 dark:text-slate-300", children: isAr ? "\u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629" : "Basic Info" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-black text-slate-500 block mb-1.5", children: isAr ? "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u062A\u0639\u0631\u064A\u0641\u064A" : "Display Name" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: editName,
                  onChange: (e) => setEditName(e.target.value),
                  className: "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-primary transition-all font-medium",
                  placeholder: isAr ? "\u0627\u0643\u062A\u0628 \u0627\u0633\u0645\u0643 \u0647\u0646\u0627..." : "Enter your name..."
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-slate-500 block mb-1.5", children: isAr ? "\u0627\u0644\u0646\u0628\u0630\u0629 \u0627\u0644\u0630\u0627\u062A\u064A\u0629" : "Biography" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: editBio,
                  onChange: (e) => setEditBio(e.target.value),
                  rows: 3,
                  className: "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-primary transition-all leading-relaxed font-medium",
                  placeholder: isAr ? "\u0627\u0643\u062A\u0628 \u0646\u0628\u0630\u0629 \u0634\u062E\u0635\u064A\u0629 \u0639\u0646\u0643 \u0648\u0639\u0646 \u0627\u0647\u062A\u0645\u0627\u0645\u0627\u062A\u0643 \u0627\u0644\u0639\u0644\u0645\u064A\u0629..." : "Tell us about yourself..."
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-100 dark:border-slate-800/60 space-y-4 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2 border-b border-slate-100 dark:border-slate-800/60 pb-2", children: [
              /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4 text-slate-400" }),
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-black text-slate-700 dark:text-slate-300", children: isAr ? "\u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0625\u0636\u0627\u0641\u064A\u0629" : "Additional Details" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-slate-500 block mb-1.5", children: isAr ? "\u0627\u0644\u062F\u0648\u0631/\u0627\u0644\u0648\u0638\u064A\u0641\u0629" : "Role" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: editRole,
                    onChange: (e) => setEditRole(e.target.value),
                    className: "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-primary transition-all font-medium",
                    placeholder: isAr ? "\u0637\u0627\u0644\u0628\u060C \u0645\u0639\u0644\u0645..." : "Student, Teacher..."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-slate-500 block mb-1.5", children: isAr ? "\u0627\u0644\u0628\u0644\u062F" : "Country" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: editCountry,
                    onChange: (e) => setEditCountry(e.target.value),
                    className: "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-primary transition-all font-medium",
                    placeholder: isAr ? "\u0628\u0644\u062F\u0643..." : "Your country..."
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-slate-500 block", children: isAr ? "\u062A\u062D\u0645\u064A\u0644 \u0635\u0648\u0631\u0629 \u0634\u062E\u0635\u064A\u0629 \u0645\u0646 \u062C\u0647\u0627\u0632\u0643" : "Upload Profile Picture" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50", children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center", children: editPhotoURL ? /* @__PURE__ */ jsx("img", { src: editPhotoURL, alt: "Preview", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-slate-400", children: "?" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "file",
                        id: "local-avatar-upload",
                        accept: "image/*",
                        className: "hidden",
                        onChange: (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              alert(isAr ? "\u0639\u0630\u0631\u0627\u064B\u060C \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u062D\u062C\u0645 \u0627\u0644\u0635\u0648\u0631\u0629 \u0647\u0648 2 \u0645\u064A\u063A\u0627\u0628\u0627\u064A\u062A." : "Sorry, the maximum file size is 2MB.");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              if (evt.target?.result) {
                                setEditPhotoURL(evt.target.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "label",
                      {
                        htmlFor: "local-avatar-upload",
                        className: "px-3 py-1.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-[11px] font-black cursor-pointer transition-colors shadow-sm",
                        children: isAr ? "\u0627\u062E\u062A\u0631 \u0645\u0644\u0641 \u0635\u0648\u0631\u0629 \u{1F4C1}" : "Choose File \u{1F4C1}"
                      }
                    ),
                    editPhotoURL && /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setEditPhotoURL(""),
                        className: "px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[11px] font-black transition-colors",
                        children: isAr ? "\u0625\u0632\u0627\u0644\u0629" : "Remove"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-[9px] text-slate-400 dark:text-slate-500", children: isAr ? "\u0635\u064A\u063A \u0645\u062F\u0639\u0648\u0645\u0629: JPG, PNG, WebP (\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649: 2 \u0645\u064A\u063A\u0627\u0628\u0627\u064A\u062A)." : "Supported: JPG, PNG, WebP (Max 2MB)." })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-slate-500 block mb-1.5", children: isAr ? "\u0623\u0648 \u0623\u062F\u062E\u0644 \u0631\u0627\u0628\u0637 \u0635\u0648\u0631\u0629 \u0634\u062E\u0635\u064A\u0629" : "Or enter Profile Picture URL" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: editPhotoURL,
                  onChange: (e) => setEditPhotoURL(e.target.value),
                  className: "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-primary font-mono text-left transition-all",
                  placeholder: "https://images.unsplash.com/..."
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-black text-slate-500 block mb-1", children: isAr ? "\u0645\u0639\u0631\u0651\u0641 \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u062E\u0635\u0635 (\u0627\u0644\u0630\u064A \u064A\u0641\u0639\u0644 \u0628\u0647 \u0627\u0644\u0622\u062F\u0645\u0646 \u0627\u0644\u0628\u0627\u0642\u0627\u062A):" : "Custom User ID (Used by Admin to activate plans):" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-2.5 text-xs text-slate-400 font-bold font-mono", children: "@" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: editCustomId,
                onChange: (e) => {
                  const val = e.target.value.trim().toLowerCase().replace(/^@/, "");
                  setEditCustomId(val);
                  handleCheckCustomId(val);
                },
                className: `w-full bg-white dark:bg-slate-950 border rounded-xl p-2.5 pl-6 text-xs outline-none focus:ring-2 focus:ring-primary font-mono ${customIdError ? "border-red-500 ring-red-200" : "border-slate-200 dark:border-slate-850"}`,
                placeholder: "e.g. ahmed_teacher"
              }
            )
          ] }),
          isVerifyingCustomId && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-primary/85 mt-1 animate-pulse", children: isAr ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u062A\u0648\u0641\u0631..." : "Verifying availability..." }),
          customIdError && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-red-500 font-bold mt-1", children: customIdError }),
          customIdSuggestions.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-2 space-y-1 bg-amber-500/5 border border-amber-500/20 p-2.5 rounded-xl", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-amber-600 dark:text-amber-400 font-extrabold", children: isAr ? "\u0627\u0642\u062A\u0631\u0627\u062D\u0627\u062A \u0645\u0639\u0631\u0651\u0641\u0627\u062A \u0645\u062A\u0627\u062D\u0629:" : "Suggested available IDs:" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5 mt-1", children: customIdSuggestions.map((sug, idx) => /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setEditCustomId(sug);
                  setCustomIdError("");
                  setCustomIdSuggestions([]);
                },
                className: "px-2.5 py-1 text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary rounded-lg font-black border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer",
                children: [
                  "@",
                  sug
                ]
              },
              idx
            )) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-slate-200 dark:border-slate-800 pt-4 space-y-4", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider", children: isAr ? "\u0631\u0648\u0627\u0628\u0637 \u0634\u0628\u0643\u0627\u062A \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0648 \u0627\u0644\u062F\u0639\u0645 (\u0633\u064A\u062A\u0645 \u0625\u0636\u0627\u0641\u062A\u0647\u0627 \u0648\u062A\u0646\u0634\u064A\u0637\u0647\u0627 \u0641\u0648\u0631 \u0643\u062A\u0627\u0628\u062A\u0647\u0627)" : "Configure Support & Social Links (will only show when filled)" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-slate-500 block mb-1", children: "GitHub URL" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: githubUrl,
                  onChange: (e) => setGithubUrl(e.target.value),
                  className: "w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-2 text-xs outline-none focus:ring-2 focus:ring-primary font-mono",
                  placeholder: "github.com/username"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-slate-500 block mb-1", children: "Instagram URL" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: instagramUrl,
                  onChange: (e) => setInstagramUrl(e.target.value),
                  className: "w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-2 text-xs outline-none focus:ring-2 focus:ring-primary font-mono",
                  placeholder: "instagram.com/username"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-slate-500 block mb-1", children: "LinkedIn URL" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: linkedinUrl,
                  onChange: (e) => setLinkedinUrl(e.target.value),
                  className: "w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-2 text-xs outline-none focus:ring-2 focus:ring-primary font-mono",
                  placeholder: "linkedin.com/in/username"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-slate-500 block mb-1", children: "Facebook URL" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: facebookUrl,
                  onChange: (e) => setFacebookUrl(e.target.value),
                  className: "w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-2 text-xs outline-none focus:ring-2 focus:ring-primary font-mono",
                  placeholder: "facebook.com/username"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-slate-200 dark:border-slate-800 pt-5 space-y-6", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider", children: isAr ? "\u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u063A\u0644\u0627\u0641 \u0627\u0644\u0645\u062A\u062D\u0631\u0643\u0629" : "Animated Cover Background" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setChosenBg("cosmic"),
                className: `p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${chosenBg === "cosmic" || !chosenBg ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-primary/50"}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: "text-2xl mb-2", children: "\u{1F30C}" }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-slate-800 dark:text-slate-200", children: isAr ? "\u0627\u0644\u0641\u0636\u0627\u0621 \u0627\u0644\u0643\u0648\u0646\u064A" : "Cosmic Space" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setChosenBg("waves"),
                className: `p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${chosenBg === "waves" ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-indigo-500/50"}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: "text-2xl mb-2", children: "\u{1F30A}" }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-slate-800 dark:text-slate-200", children: isAr ? "\u0627\u0644\u0623\u0645\u0648\u0627\u062C \u0627\u0644\u0646\u064A\u0648\u0646" : "Neon Waves" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-900/10 dark:bg-slate-950/20 p-5 rounded-3xl border border-slate-200 dark:border-slate-850 space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-4 h-4 text-primary animate-pulse", children: "\u2728" }),
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider", children: isAr ? "\u0639\u0628\u0627\u0631\u0629 \u0627\u0644\u063A\u0644\u0627\u0641 \u0627\u0644\u0645\u0643\u062A\u0648\u0628\u0629 (Slogan) \u270D\uFE0F" : "Cover Slogan Text \u270D\uFE0F" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: coverText,
                onChange: (e) => setCoverText(e.target.value),
                maxLength: 100,
                className: "w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-3.5 text-xs outline-none focus:ring-2 focus:ring-primary font-bold",
                placeholder: isAr ? "\u0645\u062B\u0627\u0644: \u0623\u0647\u0644\u0627\u064B \u0628\u0643\u0645 \u0641\u064A \u0635\u0641\u064A \u0627\u0644\u062A\u0639\u0644\u064A\u0645\u064A \u0627\u0644\u0631\u0642\u0645\u064A! \u{1F680}" : "e.g. Welcome to my elite digital learning space! \u{1F680}"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end border-t border-slate-200 dark:border-slate-800 pt-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleSaveProfile,
            disabled: isSaving,
            className: "px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-primary/10",
            children: isSaving ? isAr ? "\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638..." : "Saving..." : isAr ? "\u062D\u0641\u0638 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u0627\u0645\u0644" : "Save Profile Config"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsEditing(false),
            className: "px-6 py-2.5 bg-slate-200 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-300 transition-colors cursor-pointer",
            children: isAr ? "\u062A\u0631\u0627\u062C\u0639" : "Discard"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 space-y-8", children: [
        /* @__PURE__ */ jsxs("section", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black text-slate-850 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-primary", children: "\u2022" }),
            isAr ? "\u0646\u0628\u0630\u0629 \u0634\u062E\u0635\u064A\u0629" : "About Me"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-medium", children: displayBio }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 border-t border-slate-100 dark:border-slate-800/80 pt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs font-bold text-slate-650 dark:text-slate-300", children: [
              /* @__PURE__ */ jsx(Award, { className: "w-4 h-4 text-slate-400 shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: role })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs font-bold text-slate-650 dark:text-slate-300", children: [
              /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4 text-slate-400 shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: country })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs font-bold text-slate-650 dark:text-slate-300", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-slate-400 shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: isAr ? `\u0627\u0646\u0636\u0645 \u0641\u064A ${joinDate}` : `Joined ${joinDate}` })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xs font-black text-slate-850 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 text-center", children: isAr ? "\u0634\u0628\u0643\u0629 \u0627\u0644\u062F\u0639\u0645 \u0648\u0627\u0644\u0631\u0648\u0627\u0628\u0637 \u0627\u0644\u0627\u062C\u062A\u0645\u0627\u0639\u064A\u0629" : "Support & Social Networks" }),
          /* @__PURE__ */ jsx(
            SocialSupportLinks,
            {
              github: githubUrl,
              instagram: instagramUrl,
              linkedin: linkedinUrl,
              facebook: facebookUrl,
              isAr
            }
          )
        ] }),
        isOwnProfile && /* @__PURE__ */ jsxs("section", { className: "bg-gradient-to-br from-violet-500/5 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-6 shadow-md relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" }),
          /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black text-slate-850 dark:text-white uppercase tracking-wider mb-4 border-b border-primary/10 pb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-primary animate-pulse" }),
            isAr ? "\u0627\u0633\u062A\u0631\u062F\u0627\u062F \u0643\u0648\u062F \u0627\u0644\u062E\u0635\u0645 (Promo Code)" : "Redeem Promo Code"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 dark:text-slate-400 font-bold mb-4 leading-relaxed", children: isAr ? "\u0625\u0630\u0627 \u0643\u0627\u0646 \u0644\u062F\u064A\u0643 \u0643\u0648\u062F \u062E\u0635\u0645 \u0628\u0646\u0633\u0628\u0629 100%\u060C \u0633\u064A\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0628\u0627\u0642\u0629 \u0645\u0628\u0627\u0634\u0631\u0629 \u0641\u064A \u062D\u0633\u0627\u0628\u0643 \u0641\u0648\u0631\u064A\u0651\u0627\u064B \u062F\u0648\u0646 \u0627\u0644\u062D\u0627\u062C\u0629 \u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0645\u0634\u0631\u0641!" : "If you have a 100% discount code, your premium subscription will activate instantly for free." }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: promoCodeInput,
                onChange: (e) => setPromoCodeInput(e.target.value),
                className: "flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-black outline-none focus:ring-2 focus:ring-primary uppercase text-center tracking-widest placeholder-slate-400",
                placeholder: "e.g. FREE100",
                disabled: isRedeemingPromo
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleRedeemPromo,
                disabled: isRedeemingPromo,
                className: "px-4 py-2 bg-primary text-white font-extrabold text-xs rounded-xl hover:bg-primary-hover active:scale-95 transition-all cursor-pointer select-none shadow-md shadow-primary/15 disabled:opacity-50 flex items-center justify-center min-w-[70px]",
                children: isRedeemingPromo ? /* @__PURE__ */ jsx("div", { className: "w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" }) : isAr ? "\u062A\u0641\u0639\u064A\u0644" : "Redeem"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8 space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex border-b border-slate-200 dark:border-slate-800 p-1 gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveTab("overview"),
              className: `px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors ${activeTab === "overview" ? "bg-primary text-white shadow-md shadow-primary/10" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`,
              children: isAr ? "\u0627\u0644\u0625\u062D\u0635\u0627\u0621\u0627\u062A \u0648\u0627\u0644\u0646\u0634\u0627\u0637" : "Stats & Activity"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveTab("quizzes"),
              className: `px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors ${activeTab === "quizzes" ? "bg-primary text-white shadow-md shadow-primary/10" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`,
              children: isAr ? "\u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A\u0647 \u0627\u0644\u0645\u0645\u064A\u0632\u0629" : "Featured Quizzes"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveTab("achievements"),
              className: `px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors ${activeTab === "achievements" ? "bg-primary text-white shadow-md shadow-primary/10" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`,
              children: isAr ? "\u0644\u0648\u062D\u0629 \u0634\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0648\u062B\u064A\u0642" : "Verification Badges"
            }
          )
        ] }),
        activeTab === "overview" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 md:p-8 border border-indigo-500/30 shadow-2xl overflow-hidden relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col md:flex-row items-center gap-6", children: [
              /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-slate-800/80 rounded-2xl border border-indigo-500/40 flex items-center justify-center text-5xl shadow-inner backdrop-blur-sm", children: spaceBadgeIcon }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 text-center md:text-start", children: [
                /* @__PURE__ */ jsx("div", { className: "inline-block px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-bold tracking-widest uppercase mb-2", children: isAr ? `\u0627\u0644\u0645\u0633\u062A\u0648\u0649 ${level}` : `Level ${level}` }),
                /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black text-white mb-1 font-display", children: spaceBadgeName }),
                /* @__PURE__ */ jsx("p", { className: "text-indigo-200/70 text-sm font-medium", children: isAr ? "\u0623\u0643\u0645\u0644 \u0627\u0644\u0645\u0632\u064A\u062F \u0645\u0646 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A \u0644\u0644\u0648\u0635\u0648\u0644 \u0644\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062A\u0627\u0644\u064A" : "Complete more quizzes to reach the next level" }),
                /* @__PURE__ */ jsx("div", { className: "mt-4 bg-slate-950/50 rounded-full h-3 w-full border border-white/5 overflow-hidden", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full relative",
                    style: { width: `${currentLevelProgress}%` },
                    children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/20 animate-pulse" })
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "hidden md:flex flex-col items-center justify-center px-6 py-4 bg-slate-950/40 rounded-2xl border border-white/5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-3xl font-black text-white", children: completionsCount }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-indigo-300/70 uppercase tracking-widest font-bold mt-1", children: isAr ? "\u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A" : "Quizzes" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: isAr ? "\u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u062D\u0644\u0648\u0644\u0629" : "Solved Quizzes" }),
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-black text-slate-800 dark:text-white mt-1.5 font-display", children: completionsCount })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: isAr ? "\u0627\u0644\u0646\u0642\u0627\u0637 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629" : "Knowledge Points" }),
              /* @__PURE__ */ jsxs("div", { className: "text-3xl font-black text-primary mt-1.5 font-display", children: [
                totalKnowledgePoints,
                " XP"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: isAr ? "\u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A \u0645\u0646\u0634\u0648\u0631\u0629" : "Quizzes Created" }),
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-black text-indigo-500 mt-1.5 font-display", children: quizzesCreatedCount })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-black font-display text-slate-850 dark:text-white mb-6", children: isAr ? "\u0627\u0644\u0646\u0634\u0627\u0637 \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A \u0627\u0644\u0623\u062E\u064A\u0631" : "Interactive Activity logs" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent", children: profileData?.completions && profileData.completions.length > 0 ? profileData.completions.slice(0, 5).map((comp, idx) => /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group select-none", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 bg-primary/20 text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 font-bold", children: idx + 1 }),
              /* @__PURE__ */ jsxs("div", { className: "w-[calc(100%-3.5rem)] md:w-[calc(50%-2rem)] p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/40 duration-200", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-primary font-black uppercase", children: isAr ? "\u062F\u0631\u062C\u0629 \u0643\u0627\u0645\u0644\u0629!" : "Solved" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-mono", children: comp.createdAt ? comp.createdAt.split("T")[0] : "" })
                ] }),
                /* @__PURE__ */ jsx("h4", { className: "font-extrabold text-slate-800 dark:text-white text-xs truncate", children: comp.quizTitle }),
                /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-500 mt-1 font-bold", children: [
                  isAr ? "\u0627\u0644\u062F\u0631\u062C\u0629 \u0627\u0644\u0645\u062D\u0642\u0642\u0629:" : "Achieved Score:",
                  " ",
                  /* @__PURE__ */ jsxs("strong", { className: "text-slate-800 dark:text-white", children: [
                    comp.score,
                    " / ",
                    comp.totalQuestions
                  ] })
                ] })
              ] })
            ] }, idx)) : /* @__PURE__ */ jsxs("div", { className: "relative flex items-center select-none", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 text-slate-400 shrink-0 z-10", children: /* @__PURE__ */ jsx(Activity, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsx("div", { className: "w-[calc(100%-3.5rem)] p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm ml-3", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-bold", children: isAr ? "\u0644\u0627 \u064A\u0648\u062C\u062F \u062D\u0644\u0648\u0644 \u0645\u0633\u062C\u0644\u0629 \u0639\u0644\u0649 \u0647\u0630\u0627 \u0627\u0644\u062D\u0633\u0627\u0628 \u062D\u0627\u0644\u064A\u0627\u064B." : "No quizzes solved yet." }) })
            ] }) })
          ] })
        ] }),
        activeTab === "quizzes" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-fade-in", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-black font-display text-slate-800 dark:text-white mb-2", children: isAr ? "\u0628\u0646\u0643 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u0629 \u0628\u0648\u0627\u0633\u0637\u0629 \u0647\u0630\u0627 \u0627\u0644\u0639\u0636\u0648" : "Educational quizzes published by this member" }),
          profileData?.createdQuizzes && profileData.createdQuizzes.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: profileData.createdQuizzes.map((quiz, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-black text-slate-850 dark:text-white truncate mb-1.5", children: quiz.title }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-slate-450 line-clamp-2 min-h-[32px]", children: quiz.description || (isAr ? "\u0644\u0627 \u064A\u0648\u062C\u062F \u0648\u0635\u0641 \u0645\u062A\u0627\u062D." : "No description provided.") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-slate-400 font-black flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(BookOpen, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  quiz.questions?.length || 0,
                  " ",
                  isAr ? "\u0633\u0624\u0627\u0644" : "Questions"
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => onStartQuiz(quiz.id),
                  className: "px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[10px] font-black transition-all hover:scale-102 cursor-pointer shadow-sm shadow-primary/10",
                  children: isAr ? "\u0628\u062F\u0621 \u0627\u0644\u062D\u0644 \u0641\u0648\u0631\u0627" : "Solve Now"
                }
              )
            ] })
          ] }, idx)) }) : /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-10 rounded-2xl text-center", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "w-10 h-10 text-slate-300 mx-auto mb-3" }),
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm text-slate-705 dark:text-slate-200 mb-1", children: isAr ? "\u0644\u0645 \u064A\u0646\u0634\u0631 \u0623\u064A \u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A" : "No Public Quizzes" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 max-w-sm mx-auto", children: isAr ? "\u0647\u0630\u0627 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0644\u0645 \u064A\u0642\u0645 \u0628\u0635\u064A\u0627\u063A\u0629 \u0623\u0648 \u0646\u0634\u0631 \u0623\u064A \u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A \u0639\u0644\u0645\u064A\u0629 \u0645\u0645\u064A\u0632\u0629 \u062D\u062A\u0649 \u0627\u0644\u0644\u062D\u0638\u0629." : "This user has not authored or published any educational quizzes yet." })
          ] })
        ] }),
        activeTab === "achievements" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-fade-in", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-black font-display text-slate-800 dark:text-white mb-1", children: isAr ? "\u0644\u0648\u062D\u0629 \u0634\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0648\u062B\u064A\u0642 \u0627\u0644\u0645\u0643\u062A\u0633\u0628\u0629" : "Earned Verification Badges" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-450 dark:text-slate-400 font-bold", children: isAr ? "\u0647\u0630\u0647 \u0627\u0644\u0634\u0627\u0631\u0627\u062A \u062A\u0648\u062B\u0642 \u0625\u0646\u062C\u0627\u0632\u0627\u062A\u0643 \u0648 \u062A\u062A\u062D\u062F\u062B \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0648\u0628\u0634\u0643\u0644 \u062D\u064A." : "These badges verify your achievements and update in real-time." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: achievements.map((ach) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: `border rounded-2xl p-4 flex gap-4 transition-all relative overflow-hidden ${ach.unlocked ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm" : "bg-slate-50/50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-850/50 opacity-60"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 text-2xl font-black ${ach.accentColor}`, children: ach.icon }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start gap-2", children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-extrabold text-slate-800 dark:text-white text-xs truncate", children: isAr ? ach.titleAr : ach.titleEn }),
                    /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded-md text-[9px] font-black shrink-0 ${ach.unlocked ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-450" : "bg-slate-150 text-slate-400 dark:bg-slate-800"}`, children: ach.unlocked ? isAr ? "\u0645\u064F\u0643\u062A\u0633\u0628" : "Unlocked" : isAr ? "\u0645\u064F\u0642\u0641\u0644" : "Locked" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-450 dark:text-slate-400 mt-1 font-bold leading-normal", children: isAr ? ach.descAr : ach.descEn }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-[9px] text-slate-550 dark:text-slate-450 font-bold font-mono", children: [
                      /* @__PURE__ */ jsx("span", { children: isAr ? "\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062A\u0642\u062F\u0645:" : "Progress:" }),
                      /* @__PURE__ */ jsx("span", { children: ach.progress })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "w-full h-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "bg-primary h-full transition-all duration-500 rounded-full",
                        style: { width: `${ach.percentage}%` }
                      }
                    ) })
                  ] })
                ] })
              ]
            },
            ach.id
          )) })
        ] })
      ] })
    ] })
  ] });
}
