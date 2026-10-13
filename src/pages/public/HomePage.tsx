import ClayBackdrop from "../../components/ui/ClayBackdrop";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Users,
  Sparkles,
  Quote,
  Mail,
  Phone,
  Star,
  FileText,
  Heart,
  Brain,
  TrendingUp,
  Clock,
  Zap,
  Flame,
  MapPin,
  DollarSign,
  Target,
  Rocket,
} from "lucide-react";
import { useApp } from "../../store/AppContext";

const profilePhoto =
  "https://images.pexels.com/photos/14664508/pexels-photo-14664508.jpeg?auto=compress&cs=tinysrgb&h=600&w=600";

export default function HomePage() {
  const { jobs, candidates } = useApp();
  const openJobs = jobs.filter((j) => j.status === "Open");
  const featuredJobs = openJobs.slice(0, 3);

  const aboutStats = [
    { label: "IT Recruitment", icon: Briefcase },
    { label: "Talent Pool", icon: Users },
    { label: "Candidate & Client Support", icon: Heart },
  ];

  const testimonials = [
    { quote: "Kylie understood exactly what we needed and sent us three great candidates in a week. Hired two.", author: "Engineering Manager", company: "Nimbus Tech" },
    { quote: "She didn't just find me a job — she found me the right team. Still loving it 6 months in.", author: "Senior Backend Dev", company: "Placed at PayBridge" },
    { quote: "Fast, honest, and genuinely cares. Kylie is the recruiter I recommend to everyone.", author: "Full-Stack Developer", company: "Placed at Lumen Labs" },
  ];

  return (
    <div>
      {/* Hero — profile + headline in one block */}
      <section className="relative isolate overflow-hidden bg-soft-landing dark:bg-slate-950">
        <ClayBackdrop variant="landing" />

        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10"
          >
            {/* Left — square profile photo */}
            <div className="shrink-0">
              <img
                src={profilePhoto}
                alt="Kylie (Ngan) — IT Headhunter & Talent Acquisition Specialist"
                className="h-32 w-32 rounded-2xl border border-slate-200 object-cover shadow-sm dark:border-slate-700 sm:h-40 sm:w-40"
                loading="eager"
              />
            </div>

            {/* Right — name + role + headline + intro + CTAs */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl dark:text-white">
                Kylie (Ngan)
              </h2>
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                IT Headhunter & Talent Acquisition Specialist
              </p>

              <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Connecting great talent with the{" "}
                <span className="text-brand-600 dark:text-brand-400">right opportunities</span>.
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:mx-0 dark:text-slate-300">
                I specialize in IT recruitment and talent acquisition, connecting
                professionals with opportunities that match their experience, skills,
                and career goals.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                >
                  View Open Jobs
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/talent-pool"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Users className="h-4 w-4" />
                  Join Talent Pool
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-slate-400 sm:justify-start">
                <a href="mailto:ngan.tran4@reco-vn.com" className="inline-flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400">
                  <Mail className="h-3.5 w-3.5" /> ngan.tran4@reco-vn.com
                </a>
                <a href="tel:0776931508" className="inline-flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400">
                  <Phone className="h-3.5 w-3.5" /> 0776 931 508
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Me */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 className="text-lg font-bold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            About Me
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            I'm Kylie, an IT Headhunter & Talent Acquisition Specialist focused on
            connecting technology professionals with the right career opportunities.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Through RecruMate, I share open positions, build a talent pool, and help
            companies connect with suitable tech talent.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {aboutStats.map((s) => (
              <div key={s.label} className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
                <s.icon className="h-4 w-4 text-brand-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured Open Positions */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Featured Open Positions
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Explore the latest opportunities
            </p>
          </div>
          <Link
            to="/jobs"
            className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 sm:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredJobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                to="/jobs"
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{job.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{job.company}</p>
                  </div>
                  {job.tags.length > 0 && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${job.tags.includes("Urgent") ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"}`}>
                      {job.tags[0]}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {job.location}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="h-3 w-3" /> {job.workMode} · {job.experience}</span>
                  <span className="flex items-center gap-1.5"><DollarSign className="h-3 w-3" /> {job.salaryRange}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.techStack.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{t}</span>
                  ))}
                </div>
                <p className="mt-auto pt-4 text-xs text-slate-400 dark:text-slate-500">Posted {job.postedDaysAgo}d ago</p>
              </Link>
            </motion.div>
          ))}
        </div>
        <Link to="/jobs" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 sm:hidden">
          View all jobs <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Why RecruMate */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">Why RecruMate?</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Briefcase, title: "For Candidates", desc: "Find suitable opportunities and connect directly with a recruiter who understands your goals." },
            { icon: Users, title: "For Recruiters", desc: "Manage candidates and recruitment pipelines in one place — from sourcing to onboard." },
            { icon: Heart, title: "Talent Pool", desc: "Keep your profile in our database for future opportunities that match your skills." },
            { icon: Brain, title: "Smart Matching", desc: "Quickly identify how well a candidate matches a specific role with AI-powered analysis." },
          ].map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-600/10 dark:text-brand-400"><f.icon className="h-6 w-6" /></div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">What people say</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div key={t.author} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
              <Quote className="mt-3 h-6 w-6 text-brand-400" />
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">"{t.quote}"</p>
              <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.author}</p>
                <p className="text-xs text-slate-400">{t.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-brand-600 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="absolute inset-0 -z-10 opacity-20"><div className="absolute -top-16 -right-10 h-60 w-60 rounded-full bg-white blur-3xl" /></div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Let's find your next move</h2>
          <p className="mx-auto mt-3 max-w-md text-brand-100">Join {candidates.length}+ professionals in my talent pool. I'll reach out when the right opportunity comes up.</p>
          <Link to="/talent-pool" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50">
            Upload CV & Join Talent Pool <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
