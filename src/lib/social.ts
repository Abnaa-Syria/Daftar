export type SocialKey = "facebook" | "instagram" | "tiktok" | "threads" | "x" | "youtube";

export const SOCIAL_LINKS: Record<SocialKey, { label: string; url: string }> = {
  facebook: { label: "فيسبوك", url: "https://www.facebook.com/share/1UMDUtvXZQ/" },
  instagram: { label: "إنستغرام", url: "https://www.instagram.com/aldaftarr?igsh=Ym4wYWoxdGlsdXUz" },
  tiktok: { label: "تيك توك", url: "https://www.tiktok.com/@eldaftarnews?_r=1&_t=ZS-9515SZBeADf" },
  threads: { label: "ثريدز", url: "https://www.threads.com/@aldaftarr" },
  x: { label: "X", url: "https://x.com/eldaftarnews" },
  youtube: { label: "يوتيوب", url: "https://youtube.com/@aldaftarnews?si=cQG6l6JXj3EZ2AUo" },
};

