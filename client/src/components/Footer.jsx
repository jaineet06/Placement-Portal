import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Instagram,
  Facebook,
  GraduationCap,
  Youtube,
} from "lucide-react";

const Footer = () => {
  return (
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
                Old, National Highway-8, near K J Polytechnic, Bholav, Bharuch,
                Gujarat 392001
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
  );
};

export default Footer;
