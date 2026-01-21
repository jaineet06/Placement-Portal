import { useState } from "react";
import { ExternalLink } from "lucide-react";

const Announcements = () => {
  const [isPaused, setIsPaused] = useState(false);

  const news = [
    {
      headline:
        "GeM bid (QCBS) for Establishment of advanced manufacturing and robotics center of excellence",
      link: "https://drive.google.com/file/d/1qDvzcaHLyQx95OYjMfNN3hIBFwVckLYj/view?usp=sharing",
      tag: "Tender",
    },
    {
      headline:
        "Bid Document for Establishment of robotics center bid number. GEM/2025/B/5945450",
      link: "https://drive.google.com/file/d/18SffKyZU4iBBx_m_0tQJJMBa5W4mm84P/view?usp=sharing",
      tag: "New",
    },
    {
      headline: "Dr Jay M Joshi Publish Paper in SCI index Journal",
      link: "https://www.instagram.com/p/DR4JfFpk--n/",
      tag: "Achievement",
    },
    {
      headline:
        "Students Paper Accepted in ICASSP 2026 conference at Barcelona, Spain",
      link: "https://www.instagram.com/p/DRziLdjCPLu/",
      tag: "Global",
    },
    {
      headline: "Dr. A K Giri Design Patent granted on microgrid control unit",
      link: "https://www.instagram.com/p/DRygHwCiHru/",
      tag: "Patent",
    },
  ];

  return (
    <div
      className="overflow-hidden w-full relative py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="marquee-inner flex w-fit"
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        <div className="flex">
          {[...news, ...news].map((n, index) => (
            <a
              key={index}
              href={n.link}
              target="_blank"
              rel="noreferrer"
              className="mx-6 flex items-center gap-3 group bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm hover:border-primary/50 transition-all"
            >
              <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                {n.tag}
              </span>
              <p className="text-slate-600 font-bold group-hover:text-primary transition-colors whitespace-nowrap">
                {n.headline}
              </p>
              <ExternalLink
                size={14}
                className="text-slate-300 group-hover:text-primary"
              />
            </a>
          ))}
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default Announcements;
