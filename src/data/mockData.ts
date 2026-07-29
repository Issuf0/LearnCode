import { ServiceItem, ProductItem, CourseItem, CaseStudy } from '../types';

export const COMPANY_INFO = {
  name: 'Learn Code',
  tagline: 'Transformamos ideias em soluções digitais.',
  subheadline: 'A Learn Code desenvolve websites, aplicações, sistemas inteligentes e soluções tecnológicas para impulsionar negócios, instituições e pessoas.',
  country: 'Moçambique',
  city: 'Maputo',
  email: 'learncode.mz@gmail.com',
  emailSecondary: 'learncode.mz@gmail.com',
  whatsappNumber: '+258828376317',
  whatsappFormatted: '+258 82 837 6317',
  socials: {
    instagram: 'https://www.instagram.com/learncode.mz',
    facebook: 'https://www.facebook.com/share/1DQcdQZ6FL/',
    linkedin: '',
    github: '',
  },
  address: 'Marracuene, Maputo, Moçambique',
  slogan: 'Learn Code — Dignidade, compromisso e humildade em cada linha.',
  aboutBrief: 'A Learn Code é uma startup tecnológica moçambicana dedicada a impulsionar a transformação digital através do desenvolvimento de software de alta qualidade, inteligência artificial, formação em tecnologia e consultoria especializada.',
  mission: 'Criar soluções digitais que resolvem problemas reais.',
  vision: 'Tornar-se uma das startups de tecnologia de referência em Moçambique e em África.',
  values: [
    { title: 'Dignidade', description: 'Trabalhar com integridade, ética e respeito em cada projecto e relação profissional.' },
    { title: 'Compromisso', description: 'Honrar prazos, expectativas e garantir a entrega de soluções eficientes e duradouras.' },
    { title: 'Dedicação', description: 'Empenho contínuo na busca pela excelência técnica e na superação dos desafios.' },
    { title: 'Responsabilidade', description: 'Assumir com seriedade o impacto das nossas soluções na sociedade e nos negócios.' },
    { title: 'Humildade', description: 'Aprender continuamente, escutar o cliente e evoluir com a comunidade.' },
  ],
  stats: [
    { label: 'Projectos Criados', value: '25+' },
    { label: 'Alunos Formados', value: '300+' },
    { label: 'Soluções de IA Active', value: '5+' },
    { label: 'Satisfação do Cliente', value: '99%' }
  ]
};

// priceFrom: valores mínimos da Tabela de Preços oficial da Learn Code
export const SERVICES: ServiceItem[] = [
  {
    id: 'web-dev',
    priceFrom: '15.000 MT',
    title: 'Desenvolvimento de Websites',
    shortDesc: 'Sites modernos, responsivos e optimizados para fortalecer a presença digital.',
    fullDesc: 'Criamos plataformas web personalizadas, desde landing pages institucionais a portais corporativos complexos, focados em velocidade, segurança, SEO e excelente experiência de utilizador.',
    iconName: 'Globe',
    benefits: ['Design responsivo e mobile-first', 'Optimização SEO para motores de busca', 'Painel de gestão intuitivo', 'Integração com redes sociais e WhatsApp'],
    category: 'dev'
  },
  {
    id: 'mobile-apps',
    priceFrom: '25.000 MT',
    title: 'Aplicações Móveis',
    shortDesc: 'Apps Android e iOS com boa experiência de utilização.',
    fullDesc: 'Desenvolvemos aplicações nativas e híbridas intuitivas, com arquitetura rápida e segura, preparadas para funcionamento offline e integração com APIs de pagamentos regionais.',
    iconName: 'Smartphone',
    benefits: ['Compatibilidade Android e iOS', 'Interface fluida e moderna', 'Funcionamento offline optimizado', 'Notificações push em tempo real'],
    category: 'mobile'
  },
  {
    id: 'desktop-systems',
    priceFrom: '50.000 MZN',
    title: 'Sistemas Desktop',
    shortDesc: 'Soluções robustas para automatizar processos e melhorar a gestão.',
    fullDesc: 'Softwares para gestão empresarial, faturação, controlo de stock, gestão de recursos humanos e processos operacionais customizados para as necessidades do mercado moçambicano.',
    iconName: 'Monitor',
    benefits: ['Automação de processos internos', 'Relatórios financeiros e estatísticos', 'Alta segurança e permissões de acesso', 'Sem dependência contínua de internet'],
    category: 'dev'
  },
  {
    id: 'ai-solutions',
    priceFrom: '45.000 MZN',
    title: 'Soluções com Inteligência Artificial',
    shortDesc: 'Assistentes inteligentes, automação e análise de dados.',
    fullDesc: 'Implementamos agentes conversacionais inteligentes para atendimento ao cliente 24/7, modelos de extração de documentos, automação de tarefas repetitivas e análise preditiva.',
    iconName: 'Bot',
    benefits: ['Atendimento ao cliente 24/7 via WhatsApp/Web', 'Processamento de linguagem natural (PLN)', 'Análise inteligente de documentos', 'Integração via API REST'],
    category: 'ai'
  },
  {
    id: 'graphic-design',
    priceFrom: '2.500 MT',
    title: 'Design Gráfico',
    shortDesc: 'Identidade visual, banners, flyers, posts e materiais digitais.',
    fullDesc: 'Construção de marcas memoráveis através de identidades visuais completas, manuais de marca, peças publicitárias para redes sociais, manuais corporativos e material de apresentação.',
    iconName: 'Palette',
    benefits: ['Logótipos e identidades corporativas', 'Kit completo para redes sociais', 'Design de apresentação e propostas comerciais', 'Materiais para impressão de alta qualidade'],
    category: 'design'
  },
  {
    id: 'tech-education',
    title: 'Formação e Programação',
    shortDesc: 'Cursos práticos em tecnologias actuais.',
    fullDesc: 'Capacitamos jovens, estudantes e profissionais com metodologias 100% práticas, orientadas a projectos reais do mercado moçambicano, do básico ao avançado.',
    iconName: 'GraduationCap',
    benefits: ['Projetos práticos do mundo real', 'Mentoria individualizada', 'Certificado de conclusão', 'Acompanhamento pós-curso'],
    category: 'education'
  }
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 'ecomaputo',
    name: 'EcoMaputo',
    tagline: 'Plataforma digital de gestão sustentável de resíduos',
    description: 'Sistema inovador que liga cidadãos, catadores e empresas de reciclagem na cidade de Maputo para rastreamento de pontos de recolha, denúncia de lixeiras e incentivo à reciclagem.',
    status: 'Activo',
    statusColor: 'active',
    category: 'Smart Cities & Sustentabilidade',
    features: ['Mapeamento em tempo real de ecopeças', 'Solicitação de recolha selectiva ao domicílio', 'Relatórios ecológicos para o município', 'Sistema de pontos e recompensas sustentáveis'],
    impactSummary: 'Promove a transição de Maputo para uma cidade inteligente e limpa, reduzindo o impacto ambiental.',
    targetAudience: 'Municípios, empresas de gestão ambiental, catadores e moradores da Região Metropolitana de Maputo.',
    techStack: ['React Native (App Cidadão)', 'Angular (Painel Admin)', 'FastAPI', 'MySQL']
  },
  {
    id: 'roadmz',
    name: 'RoadMZ',
    tagline: 'Código da estrada com assistente inteligente de IA',
    description: 'Plataforma completa de preparação para exames de condução em Moçambique, equipada com um chatbot com IA que esclarece dúvidas do código de estrada em tempo real.',
    status: 'Activo',
    statusColor: 'active',
    category: 'Mobilidade & IA',
    features: ['Simulador de exames com temporizador oficial', 'Chatbot IA especialista no Código da Estrada Moçambicano', 'Sinalização rodoviária explicada', 'Estatísticas de desempenho do aluno'],
    impactSummary: 'Mais de 3.000 exames simulados realizados e taxa de aprovação de 88% entre os utilizadores frequentes.',
    targetAudience: 'Candidatos à carta de condução, escolas de condução e condutores em actualização.',
    techStack: ['React Native', 'FastAPI', 'Gemini AI API']
  },
  {
    id: 'codigo-civil-mz',
    name: 'Código Civil Moçambicano',
    tagline: 'Chatbot e API de acesso democrático à legislação nacional',
    description: 'Ferramenta pioneira de Inteligência Artificial que simplifica a consulta e compreensão das leis civis moçambicanas para juristas, cidadãos e instituições.',
    status: 'Em Desenvolvimento',
    statusColor: 'development',
    category: 'LegalTech & Inteligência Artificial',
    features: ['Pesquisa por linguagem natural ("O que diz a lei sobre contratos de arrendamento?")', 'API REST para integração em sistemas jurídicos', 'Indexação actualizada dos artigos e decretos', 'Resumos simplificados de legislação complexa'],
    impactSummary: 'Democratiza o acesso ao direito e acelera em até 70% a pesquisa jurídica básica em Moçambique.',
    targetAudience: 'Advogados, estudantes de direito, empresas, ONGs e cidadãos em geral.',
    techStack: ['Python', 'FastAPI', 'Gemini AI RAG', 'Vector Embeddings Engine']
  }
];

export const COURSES: CourseItem[] = [
  {
    id: 'html-css',
    title: 'HTML5 + CSS3',
    duration: '6 semanas',
    priceMzn: 3950,
    formattedPrice: '3.950,00 MZN',
    level: 'Iniciante',
    prerequisites: 'Nenhum requisito prévio. Apenas vontade de aprender.',
    summary: 'Aprenda a estruturar e estilizar páginas web profissionais a partir do zero com as tecnologias fundamentais da web.',
    topics: ['Estrutura HTML5 semântica', 'Estilização CSS3 e Flexbox/Grid', 'Design Responsivo para Telemóveis', 'Publicação do primeiro site online'],
    badge: 'Mais Popular'
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    duration: '4 semanas',
    priceMzn: 4100,
    formattedPrice: '4.100,00 MZN',
    level: 'Intermédio',
    prerequisites: 'Conhecimentos básicos de HTML e CSS.',
    summary: 'Domine a linguagem de programação mais utilizada no mundo para adicionar interatividade e dinamismo aos seus sites.',
    topics: ['Sintaxe moderna ES6+', 'Manipulação do DOM', 'Eventos e Assincronismo (Promises/Fetch API)', 'Criação de pequenas aplicações web interactivas'],
    badge: 'Essencial'
  },
  {
    id: 'mysql',
    title: 'MySQL',
    duration: '6 semanas',
    priceMzn: 4500,
    formattedPrice: '4.500,00 MZN',
    level: 'Intermédio',
    prerequisites: 'Lógica de programação básica.',
    summary: 'Aprenda a desenhar, consultar e gerir bases de dados relacionais com eficiência e alta segurança para aplicações corporativas.',
    topics: ['Modelação de dados e relacional (DER)', 'Consultas avançadas SQL (Joins, Aggregations)', 'Chaves primárias e estrangeiras', 'Integração com linguagens de programação'],
  },
  {
    id: 'python-basic',
    title: 'Python',
    duration: '5 semanas',
    priceMzn: 4700,
    formattedPrice: '4.700,00 MZN',
    level: 'Iniciante',
    prerequisites: 'Nenhum requisito prévio.',
    summary: 'Introdução à linguagem Python, ideal para automação de tarefas, análise de dados e início na área de inteligência artificial.',
    topics: ['Variáveis, estruturas de decisão e repetição', 'Funções e manipulação de ficheiros', 'Programação Orientada a Objectos (POO)', 'Desenvolvimento de scripts úteis'],
    badge: 'Recomendado'
  },
  {
    id: 'python-advanced',
    title: 'Python Avançado',
    duration: '6 semanas',
    priceMzn: 4900,
    formattedPrice: '4.900,00 MZN',
    level: 'Avançado',
    prerequisites: 'Domínio dos fundamentos do Python.',
    summary: 'Aprofunde conhecimentos em APIs RESTful, frameworks web (FastAPI/Django), integração com IA e processamento intensivo de dados.',
    topics: ['Criação de APIs REST com FastAPI', 'Consumo de APIs de Inteligência Artificial', 'Manipulação de dados com Pandas', 'Testes automatizados e deploy'],
  },
  {
    id: 'java-basic',
    title: 'Java (Básico)',
    duration: '5 semanas',
    priceMzn: 4600,
    formattedPrice: '4.600,00 MZN',
    level: 'Iniciante',
    prerequisites: 'Lógica de programação.',
    summary: 'Aprenda uma das linguagens corporativas mais sólidas do mercado para desenvolvimento de sistemas empresariais e robustos.',
    topics: ['Estrutura da linguagem Java e JVM', 'Programação Orientada a Objectos pura', 'Tratamento de Excepções', 'Coleções e manipulação de dados'],
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-sispoupa',
    title: 'SisPoupa — Poupança Rotativa (Xitique Digital)',
    clientCategory: 'FinTech & Inclusão Financeira',
    problem: 'Os grupos de poupança rotativa (xitique) em Moçambique dependem de registos manuais em cadernos: erros de contas, disputas sobre contribuições e multas, e falta de transparência entre os membros são frequentes.',
    solution: 'A Learn Code desenvolveu o backend da plataforma SisPoupa: uma API segura que gere grupos, ciclos de distribuição, contribuições e multas em tempo real, com autenticação por número de telefone e PIN, pensada para o utilizador móvel moçambicano.',
    impact: 'Plataforma em produção — os grupos de xitique acompanham contribuições, multas e ciclos em tempo real, com total transparência entre todos os membros.',
    results: [
      'Gestão automatizada de ciclos e distribuições',
      'Autenticação por telefone (+258) e PIN, com recuperação segura',
      'Registo transparente de contribuições e multas em tempo real',
    ],
    technologies: ['API REST', 'Autenticação por PIN', 'Ligação Encriptada (TLS)'],
    imageSeed: 'fintech-savings',
    link: 'https://clientes.poupancarotativa.co.mz/',
  },
  {
    id: 'case-codigo-civil',
    title: 'Código Civil Moçambicano com Chatbot e API',
    clientCategory: 'LegalTech / Acesso à Justiça',
    problem: 'A consulta à legislação civil em Moçambique exigia o manuseio de tomos impressos extensos ou documentos PDF não pesquisáveis, dificultando o trabalho de advogados e o acesso do cidadão comum aos seus direitos.',
    solution: 'Desenvolvemos uma plataforma que digitalizou e estruturou todo o Código Civil, integrada a um assistente com Inteligência Artificial capaz de interpretar perguntas em linguagem natural e retornar o artigo exacto com explicação simplificada.',
    impact: 'Redução do tempo de pesquisa de 45 minutos para menos de 10 segundos, com mais de 12.000 consultas realizadas no primeiro semestre.',
    results: ['Respostas em menos de 3 segundos', '100% de precisão de citação dos artigos', 'API pública utilizada por 3 escritórios de advocacia'],
    technologies: ['Python', 'FastAPI', 'Gemini AI API', 'React', 'Tailwind CSS'],
    featuredProductRef: 'codigo-civil-mz',
    imageSeed: 'legal-tech'
  },
  {
    id: 'case-quiz-code',
    title: 'Quiz Code — App de Aprendizagem de Programação',
    clientCategory: 'Educação Tecnológica & Mobile',
    problem: 'Estudantes que querem aprender programação Java têm poucas opções práticas e acessíveis em dispositivos móveis, sobretudo materiais adaptados a quem estuda por conta própria.',
    solution: 'Desenvolvemos o Quiz Code, uma aplicação Android publicada na Google Play Store que ensina programação Java através de quizzes gamificados, permitindo aprender e testar conhecimentos directamente no telemóvel.',
    impact: 'Aplicação disponível publicamente na Google Play Store, levando a aprendizagem de programação ao dispositivo que os jovens moçambicanos mais utilizam: o telemóvel.',
    results: [
      'Publicada na Google Play Store',
      'Aprendizagem de Java por quizzes gamificados',
      'Estudo offline no telemóvel, ao ritmo de cada um',
    ],
    technologies: ['Android', 'Java', 'Google Play'],
    imageSeed: 'quiz-tech',
    link: 'https://play.google.com/store/apps/details?id=com.karimo02.learnjava',
  },
  {
    id: 'case-ecomaputo',
    title: 'EcoMaputo — Mapeamento Inteligente para Gestão do Lixo',
    clientCategory: 'Cidades Inteligentes & Meio Ambiente',
    problem: 'Falta de informação centralizada sobre pontos de depósito selectivo de lixo e descarte inadequado de resíduos em áreas urbanas de Maputo.',
    solution: 'Criação de um sistema web e mobile de geolocalização que mapeia ecopontos, permite o agendamento de recolhas comunitárias e gera dados para as autoridades de gestão sanitária.',
    impact: 'Mapeamento de mais de 40 ecopontos na cidade de Maputo e engajamento da comunidade jovem na preservação ambiental.',
    results: ['+40 ecopontos registados', 'Mais de 2 toneladas de resíduos recicláveis encaminhados', 'Painel analítico para gestão de rotas'],
    technologies: ['React Native', 'Angular', 'FastAPI', 'MySQL'],
    featuredProductRef: 'ecomaputo',
    imageSeed: 'eco-maputo'
  }
];

export const PROJECT_TYPES = [
  'Desenvolvimento de Website / Landing Page',
  'Aplicação Móvel (Android / iOS)',
  'Sistema Desktop / Gestão Empresarial',
  'Solução com Inteligência Artificial / Chatbot',
  'Identidade Visual / Design Gráfico',
  'Consultoria Tecnológica',
  'Inscrição em Curso de Programação',
  'Outro Projecto Personalizado'
];

export const BUDGET_RANGES = [
  'Até 25.000,00 MZN',
  '25.000,00 MZN — 50.000,00 MZN',
  '50.000,00 MZN — 100.000,00 MZN',
  '100.000,00 MZN — 250.000,00 MZN',
  'Mais de 250.000,00 MZN',
  'Ainda a definir / Preciso de orientação'
];

export const TIMELINES = [
  'Urgente (1 a 2 semanas)',
  'Curto prazo (1 mês)',
  'Médio prazo (2 a 3 meses)',
  'Longo prazo (+ 3 meses)',
  'Flexível / Em fase de planeamento'
];
