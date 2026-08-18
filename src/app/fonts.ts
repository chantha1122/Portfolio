import { Anton, Gupter, Odor_Mean_Chey } from "next/font/google";

export const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

export const gupter = Gupter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-gupter",
  display: "swap",
});

export const odorMeanChey = Odor_Mean_Chey({
  subsets: ["khmer"],
  weight: "400",
  variable: "--font-khmer",
  display: "swap",
});
