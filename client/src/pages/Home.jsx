import React, { useState } from "react";
import {
  ArrowRight,
  GraduationCap,
  Briefcase,
  Building2,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [stopScroll, setStopScroll] = useState(false);

  // Stats specific to a Placement Portal
  const stats = [
    { label: "Partner Companies", value: "120+", icon: Building2 },
    { label: "Student Placements", value: "450+", icon: Briefcase },
    { label: "Higher Studies", value: "15%", icon: GraduationCap },
  ];

  const cardData = [
    {
      title: "Unlock Your Creative Flow",
      image:
        "https://images.unsplash.com/photo-1543487945-139a97f387d5?w=1200&auto=format&fit=crop&q=60",
    },
    {
      title: "Design Your Digital Future",
      image:
        "https://images.unsplash.com/photo-1529254479751-faeedc59e78f?w=1200&auto=format&fit=crop&q=60",
    },
    {
      title: "Build with Passion",
      image:
        "https://images.unsplash.com/photo-1618327907215-4e514efabd41?w=1200&auto=format&fit=crop&q=60",
    },
    {
      title: "Think Big, Code Smart",
      image:
        "https://images.unsplash.com/photo-1583407723467-9b2d22504831?w=1200&auto=format&fit=crop&q=60",
    },
  ];

  return (
    <div className="space-y-8 pb-12 overflow-x-hidden">
      <div className="flex items-center justify-center w-full">
        <img
          src="https://gecbharuch.com/wp-content/uploads/2022/02/Logo-strip.png"
          alt="GEC Bharuch Logo"
          className="w-[90%] object-contain"
        />
      </div>
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-12 flex flex-col lg:flex-row items-center gap-10 bg-gradient-to-br from-white to-slate-50">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Placement Season 2025-26 Live
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Empowering Careers at <br />
              <span className="text-primary italic">GEC Bharuch</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Access exclusive job opportunities, track your applications, and
              prepare for your future with our unified Training & Placement
              portal.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={"/company"}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dull text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-primary/25 active:scale-95"
              >
                Apply Now <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          <div className="relative w-full lg:w-[450px] aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1523240715639-953894982996?auto=format&fit=crop&q=80&w=1000"
              alt="Students"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <p className="text-white font-medium text-sm">
                Building India's Technical Future since 2004
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
