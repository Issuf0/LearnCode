import React, { useState } from 'react';
import { GraduationCap, Clock, Banknote, BookOpen, CheckCircle2, ArrowRight, Search, Filter, Award } from 'lucide-react';
import { COURSES } from '../data/mockData';
import { CourseItem } from '../types';

interface CoursesSectionProps {
  onEnrollCourse: (courseTitle: string) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ onEnrollCourse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('Todos');

  const filteredCourses = COURSES.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.topics.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLevel = selectedLevel === 'Todos' || course.level === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  const handleEnroll = (courseTitle: string) => {
    onEnrollCourse(`Inscrição Curso: ${courseTitle}`);
  };

  return (
    <section id="cursos" className="py-20 bg-white text-slate-900 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Formação & Capacitação</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cursos de programação para impulsionar a sua{' '}
            <span className="text-blue-600">
              carreira tecnológica.
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Formação prática, orientada por projectos e adaptada ao mercado de trabalho em Moçambique.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-12 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar curso ou tecnologia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {['Todos', 'Iniciante', 'Intermédio', 'Avançado'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: CourseItem) => (
            <div
              key={course.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 shadow-sm transition-all duration-300 flex flex-col justify-between group relative"
            >
              <div className="space-y-4">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                    {course.level}
                  </span>

                  {course.badge && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                      <Award className="w-3 h-3 text-amber-600" />
                      {course.badge}
                    </span>
                  )}
                </div>

                {/* Course Title & Pricing */}
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-blue-600">
                      {course.formattedPrice}
                    </span>
                  </div>
                </div>

                {/* Duration & Prerequisites */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500">Duração</p>
                      <p className="font-semibold text-slate-800">{course.duration}</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500">Prática</p>
                      <p className="font-semibold text-slate-800">Projetos reais</p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-slate-600 text-xs leading-relaxed">{course.summary}</p>

                {/* Key Topics */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Módulos principais:</p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {course.topics.map((topic, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="pt-5 mt-5 border-t border-slate-100">
                <button
                  onClick={() => handleEnroll(course.title)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
                >
                  <span>Inscrever-se no Curso</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Practical Note Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Garantia de Aprendizagem Prática</h4>
              <p className="text-xs text-slate-600">
                Formação prática, orientada por projectos e adaptada ao mercado. Todos os alunos concluem com projectos no seu portfólio.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleEnroll('Consultar Cursos e Horários')}
            className="whitespace-nowrap px-6 py-3 rounded-full text-xs font-bold text-white bg-[#1a9cd8] hover:bg-[#29b6e8] shadow-md shadow-[#1a9cd8]/25 transition-colors cursor-pointer"
          >
            Consultar Turmas & Horários
          </button>
        </div>

      </div>
    </section>
  );
};
