
import React from 'react';

interface TermsOfServiceProps {
  onClose: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-white z-[200] flex flex-col animate-in slide-in-from-bottom duration-500">
      <header className="p-6 border-b border-gray-100 flex items-center bg-[#162a3d] text-white">
        <button onClick={onClose} className="mr-4 p-2 hover:bg-white/10 rounded-xl transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-sm font-black uppercase tracking-widest">Termos e Licença Beta</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 text-gray-700 leading-relaxed pb-20">
        <section className="space-y-3">
          <h3 className="text-[#162a3d] font-black text-lg uppercase tracking-tight">1. Aceitação dos Termos</h3>
          <p className="text-sm">
            Ao acessar o <strong>Bazzar Digital</strong>, você concorda em cumprir estes termos. O Bazzar é um marketplace focado no território africano e brasileiro, facilitando a conexão entre compradores e vendedores.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-[#162a3d] font-black text-lg uppercase tracking-tight">2. Negociações e Chat</h3>
          <p className="text-sm">
            O chat integrado é uma ferramenta para negociação direta. O Bazzar Digital atua apenas como <strong>intermediário tecnológico</strong>. Não garantimos a qualidade dos produtos nem nos responsabilizamos por pagamentos feitos fora da plataforma. Recomendamos sempre verificar o vendedor antes de concluir qualquer transação.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-[#162a3d] font-black text-lg uppercase tracking-tight">3. Geolocalização (GPS)</h3>
          <p className="text-sm">
            Para a função <strong>"Perto de Mim"</strong>, o app utiliza sua localização GPS. Esses dados são usados exclusivamente para filtrar anúncios relevantes em seu raio de distância e não são compartilhados com terceiros sem consentimento explícito em transações de entrega.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-[#162a3d] font-black text-lg uppercase tracking-tight">4. Inteligência Artificial e Gostos</h3>
          <p className="text-sm">
            Nosso algoritmo de IA organiza o feed com base em seus cliques, pesquisas e categorias favoritas. Ao usar o app, você autoriza o processamento anônimo desses dados para melhorar sua experiência de compra e venda personalizada.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-[#162a3d] font-black text-lg uppercase tracking-tight">5. Subscrição Premium</h3>
          <p className="text-sm">
            A conta Premium oferece visibilidade prioritária, semelhante ao modelo de anúncios do Facebook. A subscrição pode ser cancelada a qualquer momento nas configurações de perfil, mas reembolsos de períodos já iniciados não serão processados.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-[#162a3d] font-black text-lg uppercase tracking-tight">6. Itens Proibidos</h3>
          <p className="text-sm">
            É terminantemente proibida a venda de itens ilegais, armas, substâncias controladas ou qualquer produto que viole as leis locais dos países de operação (Angola, Moçambique, Brasil, Nigéria, etc.). Contas que violarem esta regra serão banidas permanentemente.
          </p>
        </section>

        <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase text-center">
            Bazzar Digital Beta v1.0 • Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
