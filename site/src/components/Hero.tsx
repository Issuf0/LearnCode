import React, { useState, useEffect } from 'react';
import { ArrowRight, Code2, CheckCircle2, ShieldCheck, Terminal, Cpu, Bot, Award } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

interface HeroProps {
  onContactClick: () => void;
  onServicesClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onContactClick, onServicesClick }) => {
  const [codeIndex, setCodeIndex] = useState(0);

  const codeSnippets = [
    `// Learn Code Mozambique
const startup = {
  name: "Learn Code",
  mission: "Transformar ideias em soluções digitais",
  tech: ["React", "Python", "AI", "Mobile", "Node.js"],
  impact: "Nacional & Regional"
};
startup.buildSolution(yourIdea);`,
    `// Inteligência Artificial Moçambicana
import { GeminiAI } from "@learncode/ai";

const bot = new GeminiAI({
  context: "Código Civil & Legislação MZ",
  language: "pt-MZ",
  speed: "Instantânea"
});
await bot.answerQuestion(query);`,
    `// Desenvolvimento Sob Medida
async function deployProject(client) {
  const app = await createWebAndMobileApp({
    responsive: true,
    secure: true,
    cloudReady: true
  });
  return app.launchSuccess();
}`
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCodeIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="inicio" className="pt-28 pb-12 sm:pt-32 sm:pb-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Minimalist Hero Card — fundo claro, acentos na cor da marca */}
        <div className="p-8 sm:p-12 lg:p-16 bg-white dark:bg-slate-900 rounded-3xl text-slate-900 dark:text-white relative overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#29b6e8] rounded-full opacity-[0.07] blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-[#1a9cd8] rounded-full opacity-[0.05] blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-slate-900 dark:text-white">
                Transformamos ideias em <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#29b6e8] to-[#1a9cd8] bg-clip-text text-transparent">soluções digitais.</span>
              </h1>

              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
                {COMPANY_INFO.subheadline}
              </p>

              {/* Value checks */}
              <div className="flex flex-wrap gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1a9cd8] shrink-0" />
                  <span>Websites & Apps</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-[#1a9cd8] shrink-0" />
                  <span>Agentes & IA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1a9cd8] shrink-0" />
                  <span>Qualidade & Segurança</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onContactClick}
                  className="px-7 py-3.5 bg-[#1a9cd8] hover:bg-[#29b6e8] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#1a9cd8]/25 inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Fale Connosco</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onServicesClick}
                  className="px-7 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl font-bold text-sm transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Conhecer Serviços</span>
                  <Code2 className="w-4 h-4 text-[#1a9cd8]" />
                </button>
              </div>

              {/* Trust Stats */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg">
                {COMPANY_INFO.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 italic flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span>"{COMPANY_INFO.slogan}"</span>
              </div>
            </div>

            {/* Right Terminal Column */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-slate-950/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-sm">
                <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                    <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-blue-400" />
                      learncode-mz.ts
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                    <Cpu className="w-3 h-3 animate-spin text-blue-400" />
                    <span>ONLINE</span>
                  </div>
                </div>

                <div className="p-5 font-mono text-xs text-slate-200 leading-relaxed bg-slate-950 min-h-[220px] flex flex-col justify-between">
                  <pre className="text-blue-300 overflow-x-auto whitespace-pre-wrap font-mono">
                    <code>{codeSnippets[codeIndex]}</code>
                  </pre>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-sans font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      Prontos para o seu projecto
                    </span>
                    <span className="font-mono text-slate-400">Maputo, Moçambique</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
