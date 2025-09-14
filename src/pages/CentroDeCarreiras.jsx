import ImpactoHero from '../components/ImpactoHero'
import ImpactoAbout from '../components/ImpactoAbout'
import CentroComoFunciona from '../components/CentroComoFunciona'
import CentroTestimonial from '../components/CentroTestimonial'
import ImpactoFAQ from '../components/ImpactoFAQ'
import TrilhaCTA from '../components/TrilhaCTA'

function CentroDeCarreiras() {
  const paragraphs = [
    'O Fundo Patronos deu um passo decisivo na missão de apoiar a trajetória profissional dos estudantes da Unicamp com o lançamento do Centro de Carreiras, estruturado como uma plataforma digital. A iniciativa representa uma nova era na formação complementar dos alunos, ampliando significativamente o acesso a recursos de desenvolvimento profissional.',
    'Por meio da plataforma, estudantes têm acesso a mentores residentes — profissionais experientes de diversas áreas de atuação — com quem poderão discutir o dia a dia de diferentes carreiras, entender como se preparar para processos seletivos e desenvolver estratégias para expandir suas redes de contato em qualquer setor.',
    'Nossos mentores abrangem todas as áreas de expertise e indústrias, incluindo carreiras globais, oportunidades de pós-graduação e empreendedorismo. Os estudantes podem se conectar com um número ilimitado de mentores e ter reuniões ilimitadas, sempre com o objetivo de auxiliá-los a tomar as melhores decisões em suas carreiras. A plataforma está disponível 24/7/365, oferecendo aconselhamento de carreira, expansão de rede entre alunos e ex-alunos, e conexões com empresas parceiras.'
  ]

  const faqs = [
    {
      question: "Quem pode utilizar o Centro de Carreiras?",
      answer: "O Centro de Carreiras é exclusivo para estudantes de graduação e pós-graduação da Unicamp de todos os cursos e áreas. Para acessar a plataforma, é necessário se registrar preferencialmente com o email da DAC para validação automática."
    },
    {
      question: "Como funciona a mentoria com os mentores residentes?",
      answer: "Os encontros com mentores residentes são geralmente de 30 minutos, agendados conforme a disponibilidade do mentor. Os estudantes podem se conectar com um número ilimitado de mentores e ter reuniões ilimitadas, sempre com o objetivo de auxiliá-los a tomar as melhores decisões em suas carreiras."
    },
    {
      question: "O Centro de Carreiras está sempre disponível?",
      answer: "Sim, o Centro de Carreiras é uma plataforma digital disponível 24/7/365. Os estudantes podem acessar mentores, oportunidades e recursos de desenvolvimento profissional a qualquer momento, oferecendo flexibilidade total para encaixar o networking em sua rotina acadêmica."
    },
    {
      question: "Como posso me tornar um mentor residente?",
      answer: (
        <>
          Profissionais interessados em se tornar mentores residentes podem se inscrever através do formulário disponível{' '}
          <a
            href="https://airtable.com/app4uSEqO2S03EO5X/pag4g0cv7spU3ZjtX/form"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            aqui
          </a>
          . Todas as inscrições passam por uma validação do Fundo Patronos antes de serem publicados na plataforma.
        </>
      )
    },
    {
      question: "Para que posso usar o Centro de Carreiras?",
      answer: "O Centro de Carreiras pode ser usado para encontrar a carreira ideal, conectar-se com profissionais do mercado, preparar-se para processos seletivos, expandir sua rede de contatos, obter mentoria especializada em diferentes indústrias, explorar oportunidades de pós-graduação e empreendedorismo, e receber orientação personalizada para desenvolvimento profissional."
    },
    {
      question: "Que tipo de mentores estão disponíveis na plataforma?",
      answer: "Nossos mentores residentes abrangem todas as áreas de expertise e indústrias, incluindo carreiras globais, oportunidades de pós-graduação e empreendedorismo. São profissionais experientes de diversas áreas de atuação, categorizados por expertise, que oferecem orientação sobre diferentes carreiras, processos seletivos e estratégias de networking."
    }
  ]

  return (
    <div className="min-h-screen">
      <ImpactoHero
        announcementText="Centro de Carreiras está sempre disponível"
        title="Centro de Carreiras"
        description="Conectamos talentos da Unicamp com oportunidades profissionais e oferecemos recursos para desenvolvimento de carreira e networking."
        primaryButtonText="Acessar Centro de Carreiras"
        primaryButtonLink="https://carreiras.patronos.org/"
        secondaryButtonText="Inscrição de Mentores"
        secondaryButtonLink="https://airtable.com/app4uSEqO2S03EO5X/pag4g0cv7spU3ZjtX/form"
      />
      <ImpactoAbout
        categoryText="Desenvolvimento Profissional"
        title="Centro de Carreiras da Unicamp"
        paragraphs={paragraphs}
        imageUrl="/centro_carreiras_screenshot.png"
        learnMoreText="Acessar Centro de Carreiras"
        learnMoreLink="https://carreiras.patronos.org/"
      />
      <CentroComoFunciona />
      <CentroTestimonial />
      <ImpactoFAQ faqs={faqs} title="Perguntas Frequentes" />
      <TrilhaCTA />
    </div>
  )
}

export default CentroDeCarreiras