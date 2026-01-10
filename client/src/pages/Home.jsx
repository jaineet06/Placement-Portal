import React, { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  ExternalLink,
  Megaphone,
  Quote,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  GraduationCap,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
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
    <>
      <div className="flex items-center justify-center w-full py-2">
        <img
          src="https://gecbharuch.com/wp-content/uploads/2022/02/Logo-strip.png"
          alt="GEC Bharuch Logo"
          className="w-[90%] object-contain opacity-90"
        />
      </div>

      <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mx-8">
        <div className="p-8 md:p-14 flex flex-col lg:flex-row items-center gap-12 bg-gradient-to-br from-white via-white to-blue-50/30">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Placement Season 2025-26 Live
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1]">
              Empowering Careers at <br />
              <span className="text-primary italic font-serif">
                GEC Bharuch
              </span>
            </h1>

            <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
              Access exclusive job opportunities, track your applications, and
              prepare for your future with our unified T&P portal.
            </p>

            <div className="flex flex-wrap gap-5 pt-2">
              <Link
                to={"/company"}
                className="flex items-center gap-3 bg-primary hover:bg-primary-dull text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-2xl shadow-primary/30 active:scale-95 text-lg"
              >
                Apply Now <ArrowRight size={22} />
              </Link>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-2xl group-hover:bg-primary/10 transition-all"></div>
            <div className="relative w-full lg:w-[480px] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white">
              <img
                src="https://images.unsplash.com/photo-1523240715639-953894982996?auto=format&fit=crop&q=80&w=1000"
                alt="Students"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-white/50 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Sparkles size={20} />
                  </div>
                  <p className="text-slate-800 font-bold text-sm">
                    Shaping Excellence since 2004
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10 mx-8">
        <div className="flex items-center gap-2">
          <Megaphone className="text-primary animate-bounce" size={20} />
          <h2 className="font-bold text-slate-800 uppercase tracking-widest text-xs">
            Latest Announcements
          </h2>
        </div>

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

        <section className="mt-5 px-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col lg:flex-row items-stretch">
            <div className="lg:w-1/3 relative min-h-[350px]">
              <img
                src="https://gecbharuch.com/wp-content/uploads/2022/09/PPL-passport-photo-2022-e1695362980638-300x300.jpg"
                alt="Principal Dr. Jay M Joshi"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 p-8 md:p-14 space-y-8 relative bg-gradient-to-br from-white to-slate-50/50">
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-primary">
                  <div className="h-[2px] w-12 bg-primary" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">
                    Message from Principal
                  </span>
                  <div className="h-[2px] w-12 bg-primary" />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  A Vision for{" "}
                  <span className="text-primary italic">Global Excellence</span>
                </h2>
              </div>

              <div className="relative">
                <Quote className="absolute -top-6 -left-8 text-slate-100 w-16 h-16 -z-10" />
                <p className="text-slate-700 leading-relaxed text-xl italic font-medium">
                  "As we step into another academic year, I reflect on our
                  journey with immense pride and optimism. Last year was a
                  testament to our resilience, adaptability, and commitment to
                  excellence."
                </p>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-100">
                <p className="text-slate-500 leading-relaxed font-medium">
                  We celebrated significant milestones, including the NBA
                  accreditation of our Mechanical and Civil Engineering
                  departments, marking a leap toward global competitiveness.
                  This year, we build on our strengths and achievements.
                </p>

                <div className="flex items-center gap-5 pt-2">
                  <div className="h-14 w-1.5 bg-primary rounded-full shadow-lg shadow-primary/20" />
                  <div>
                    <p className="font-black text-slate-900 text-xl uppercase tracking-tighter">
                      Dr. P P Lodha
                    </p>
                    <p className="text-primary text-sm font-bold uppercase tracking-[0.1em]">
                      Principal, GEC Bharuch
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-2 mt-12">
          <div className="flex flex-col lg:flex-row-reverse items-stretch bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="lg:w-1/3 relative min-h-[350px] bg-slate-200">
              <img
                src="https://gecbharuch.com/wp-content/uploads/2025/06/namrata_photo-300x300.jpg"
                alt="HOD Computer Engineering"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-0" />
            </div>

            <div className="flex-1 p-8 md:p-14 space-y-8 bg-gradient-to-bl from-white to-blue-50/20 text-right lg:text-left">
              <div className="space-y-3">
                <div className="flex items-center justify-end lg:justify-start gap-4 text-primary">
                  <div className="h-[2px] w-12 bg-primary hidden lg:block" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">
                    Computer Engineering Department
                  </span>
                  <div className="h-[2px] w-12 bg-primary" />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  Bridging the Gap to{" "}
                  <span className="text-primary italic">Innovation</span>
                </h2>
              </div>

              <div className="relative">
                <p className="text-slate-700 leading-relaxed text-xl italic font-medium border-r-4 lg:border-r-0 lg:border-l-4 border-primary px-6">
                  "Our department is dedicated to fostering an environment where
                  logic meets creativity. We don't just teach code; we cultivate
                  the problem-solving mindset required to lead the next digital
                  revolution."
                </p>
              </div>

              <div className="space-y-6 pt-6">
                <p className="text-slate-500 leading-relaxed font-medium max-w-2xl ml-auto lg:ml-0">
                  In the Computer Engineering department at GEC Bharuch, we
                  focus on emerging technologies like AI, Machine Learning, and
                  Cybersecurity. Our goal is to ensure every student is not just
                  'job-ready', but 'future-ready' to tackle global technological
                  challenges.
                </p>

                <div className="flex items-center justify-end lg:justify-start gap-5 pt-2">
                  <div className="h-14 w-1.5 bg-primary rounded-full shadow-lg shadow-primary/20" />
                  <div className="text-right lg:text-left">
                    <p className="font-black text-slate-900 text-xl uppercase tracking-tighter">
                      Prof. Namrata Shroff
                    </p>
                    <p className="text-primary text-sm font-bold uppercase tracking-[0.1em]">
                      HOD of CE, GEC Bharuch
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 px-6 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-slate-800 pb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <GraduationCap size={24} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Placement Portal
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Official Training & Placement portal of Government Engineering
              College, Bharuch. Bridging the gap between academic excellence and
              industrial requirements.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/gec.bharuch.16"
                className="p-2 bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-all"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/gecbharuch.official/"
                className="p-2 bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-all"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/government-engineering-college-bharuch/"
                className="p-2 bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-all"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://www.youtube.com/channel/UCKAfT2s9NepXptfIyoG7xNg"
                className="p-2 bg-slate-800 rounded-lg hover:bg-primary hover:text-white transition-all"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">
              Departments
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://gecbharuch.com/departments/computer-engineering-2/"
                  className="hover:text-primary transition-colors"
                >
                  Computer Engineering
                </a>
              </li>
              <li>
                <a
                  href="https://gecbharuch.com/departments/mechanical-engineering/"
                  className="hover:text-primary transition-colors"
                >
                  Mechanical Engineering
                </a>
              </li>
              <li>
                <a
                  href="https://gecbharuch.com/departments/electrical-engineering/"
                  className="hover:text-primary transition-colors"
                >
                  Electrical Engineering
                </a>
              </li>
              <li>
                <a
                  href="https://gecbharuch.com/departments/chemical-engineering/"
                  className="hover:text-primary transition-colors"
                >
                  Chemical Engineering
                </a>
              </li>
              <li>
                <a
                  href="https://gecbharuch.com/departments/civil-engineering/"
                  className="hover:text-primary transition-colors"
                >
                  Civil Engineering
                </a>
              </li>
              <li>
                <a
                  href="https://gecbharuch.com/departments/electronics-communication-engineering/"
                  className="hover:text-primary transition-colors"
                >
                  Electronics & Communication Engineering
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">
              Student Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="http://gecbharuch.com/feedback/"
                  className="hover:text-primary transition-colors"
                >
                  Feedback
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">
              Contacts
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0" />
                <span>
                  Old, National Highway-8, near K J Polytechnic, Bholav,
                  Bharuch, Gujarat 392001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <span>+91 2642 227054</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <span>gec-bharuch-dte@gujarat.gov.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
          <p>
            © 2026 Government Engineering College, Bharuch. All rights reserved.
          </p>

          <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
            <span>Developed with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>by</span>
            <div className="flex gap-2">
              <span className="text-primary font-bold hover:text-white transition-colors cursor-default">
                Shah Jaineet
              </span>
              <span className="text-slate-700">|</span>
              <span className="text-primary font-bold hover:text-white transition-colors cursor-default">
                Rajan Bhatti
              </span>
              <span className="text-slate-700">|</span>
              <span className="text-primary font-bold hover:text-white transition-colors cursor-default">
                Khooshi Tiwari
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
