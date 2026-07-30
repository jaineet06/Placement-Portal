import { ArrowRight, Sparkles, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Announcements from "../components/Announcements";

import deptImg from "../assets/deptImg.png"; // Adjust the path if needed

const Home = () => {
  return (
    <>
      <div className="flex items-center justify-center w-full py-2">
        <img
          src="https://gecbharuch.com/wp-content/uploads/2022/02/Logo-strip.png"
          alt="GEC Bharuch Logo"
          className="w-[90%] object-contain opacity-90"
        />
      </div>


<section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mx-4 md:mx-8">
  <div className="p-6 md:p-14 flex flex-col lg:flex-row items-center gap-10 lg:gap-12 bg-gradient-to-br from-white via-white to-blue-50/30">
    {/* Left Content */}
    <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
        </span>
        Placement Season 2025-26 Live
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
        Empowering Careers at <br />
        <span className="text-primary italic font-serif">
          GEC Bharuch
        </span>
      </h1>

      <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
        Access exclusive job opportunities, track your applications, and
        prepare for your future with our unified T&amp;P portal.
      </p>

      <div className="flex justify-center lg:justify-start">
        <Link
          to="/company"
          className="inline-flex items-center gap-2 sm:gap-3 bg-primary hover:bg-primary-dull text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-2xl font-bold transition-all shadow-2xl shadow-primary/30 active:scale-95 text-base sm:text-lg"
        >
          Apply Now
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>

    {/* Right Image */}
    <div className="relative group w-full max-w-[480px]">
      <div className="absolute -inset-4 rounded-[2.5rem] bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10"></div>

      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl lg:rounded-[2rem] border-4 lg:border-[6px] border-white shadow-2xl">
        <img
          src={deptImg}
          alt="Students"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute bottom-3 left-3 right-3 lg:bottom-6 lg:left-6 lg:right-6 rounded-xl border border-white/50 bg-white/90 p-3 lg:p-4 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
              <Sparkles size={18} />
            </div>

            <p className="text-xs sm:text-sm font-bold leading-tight text-slate-800">
              Shaping Excellence since 2004
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      <div className="mt-10 mx-8">
        <Announcements />

        <section className="mt-5 px-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col lg:flex-row items-stretch">
            <div className="lg:w-1/3 relative min-h-[350px]">
              <img
                src="https://gecbharuch.com/wp-content/uploads/2022/09/PPL-passport-photo-2022-e1695362980638-300x300.jpg"
                alt="Principal Dr. P P Lodha"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 p-8 md:p-12 space-y-6 relative bg-gradient-to-br from-white to-slate-50/50">
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-primary">
                  <div className="h-[2px] w-12 bg-primary" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">
                    Message from Principal
                  </span>
                  <div className="h-[2px] w-12 bg-primary" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  A Vision for{" "}
                  <span className="text-primary italic">Global Excellence</span>
                </h2>
              </div>

              <div className="relative">
                <p className="text-slate-700 leading-snug text-lg italic font-medium border-l-4 border-primary px-6">
                  "Last year was a testament to our resilience and commitment to
                  excellence. With NBA accreditation in Mechanical and Civil
                  Engineering, we continue to build on our strengths toward
                  global competitiveness."
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                  As we step into another academic year, we reflect on our
                  journey with pride. We remain dedicated to fostering an
                  environment that empowers students to achieve significant
                  milestones and contribute to the engineering landscape.
                </p>

                <div className="flex items-center gap-5 pt-2 border-t border-slate-100">
                  <div className="h-12 w-1.5 bg-primary rounded-full shadow-lg shadow-primary/20" />
                  <div>
                    <p className="font-black text-slate-900 text-lg uppercase tracking-tighter">
                      Dr. P P Lodha
                    </p>
                    <p className="text-primary text-[10px] font-bold uppercase tracking-[0.1em]">
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
                alt="HOD Computer Department"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 hover:scale-105"
              />
            </div>

            <div className="flex-1 p-8 md:p-12 space-y-6 bg-gradient-to-bl from-white to-blue-50/20 text-right lg:text-left">
              <div className="space-y-3">
                <div className="flex items-center justify-end lg:justify-start gap-4 text-primary">
                  <div className="h-[2px] w-12 bg-primary hidden lg:block" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">
                    Computer Engineering Department
                  </span>
                  <div className="h-[2px] w-12 bg-primary" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Nurturing{" "}
                  <span className="text-primary italic">Industry Leaders</span>
                </h2>
              </div>

              <div className="relative">
                <p className="text-slate-700 leading-snug text-[15px] italic font-medium border-r-4 lg:border-r-0 lg:border-l-4 border-primary px-6">
                  "We are committed to nurturing industry-ready professionals
                  equipped with technical expertise, problem-solving ability,
                  and ethical values. We welcome recruiters to explore our
                  talent pool and collaborate for internships and placements."
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-slate-500 text-sm leading-relaxed font-medium max-w-2xl ml-auto lg:ml-0">
                  Our curriculum covers{" "}
                  <span className="text-slate-800 font-medium">
                    Data Structures, AI, Machine Learning, Cloud, and Cyber
                    Security.
                  </span>{" "}
                  We emphasize practical exposure through hackathons and
                  industrial training to ensure our graduates are future-ready
                  for the IT industry and research organizations.
                </p>

                <div className="flex items-center justify-end lg:justify-start gap-5 pt-2 border-t border-slate-100">
                  <div className="h-12 w-1.5 bg-primary rounded-full shadow-lg shadow-primary/20" />
                  <div className="text-right lg:text-left">
                    <p className="font-black text-slate-900 text-lg uppercase tracking-tighter leading-none">
                      Dr. Namrata Shroff
                    </p>
                    <p className="text-primary text-[10px] font-bold uppercase tracking-[0.1em] mt-1">
                      Head of Department, CE
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Home;
