import { useState, useEffect, useRef } from "react";
import { ExternalLink, Megaphone } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const Announcements = () => {
  const { axios } = useAppContext();

  const [isPaused, setIsPaused] = useState(false);
  const [news, setNews] = useState([]);
  const [shouldScroll, setShouldScroll] = useState(false);

  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const fetchNews = async () => {
    try {
      const { data } = await axios.get("/api/news/get-all/visible");

      if (data.success) {
        setNews(data.news);
      }
    } catch (error) {
      console.log("Failed to load news");
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    const checkWidth = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const contentWidth = contentRef.current.scrollWidth;

        setShouldScroll(contentWidth > containerWidth);
      }
    };

    checkWidth();

    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, [news]);

  if (news.length === 0) return null;

  const displayNews = shouldScroll ? [...news, ...news] : news;

  return (
    <>
      <div className="flex items-center gap-2">
        <Megaphone className="text-primary animate-bounce" size={20} />

        <h2 className="font-bold text-slate-800 uppercase tracking-widest text-xs">
          Latest Announcements
        </h2>
      </div>

      <div
        ref={containerRef}
        className="overflow-hidden w-full relative py-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex w-fit ${
            shouldScroll ? "marquee-inner" : ""
          }`}
          style={{
            animationPlayState:
              isPaused || !shouldScroll ? "paused" : "running",
          }}
        >
          <div ref={contentRef} className="flex">
            {displayNews.map((n, index) => (
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
    </>
  );
};

export default Announcements;