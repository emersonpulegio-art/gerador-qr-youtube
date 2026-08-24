import React from 'react';
import {
  HelpCircle,
  X,
  ShieldCheck,
  CheckCircle2,
  Video,
  Sparkles,
  Layers,
  Smartphone,
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                GUIA PRÁTICO
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Como criar e aplicar QR Codes de alta conversão em seus vídeos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 leading-relaxed">
          {/* 5 Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>Passo a Passo Rápido</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  num: '1',
                  title: 'Cole o link do canal',
                  desc: 'Insira o link oficial ou @arroba do seu canal do YouTube.',
                },
                {
                  num: '2',
                  title: 'Personalize o visual',
                  desc: 'Escolha estilo, cores, mensagem e ative Fundo Transparente.',
                },
                {
                  num: '3',
                  title: 'Baixe em Alta Resolução',
                  desc: 'Exporte o arquivo PNG nítido e sem perda de qualidade.',
                },
                {
                  num: '4',
                  title: 'Sobreponha no CapCut',
                  desc: 'Importe a imagem como camada sobreposta (Overlay) no editor.',
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center font-bold shrink-0 text-xs font-mono">
                    {step.num}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {step.title}
                    </span>
                    <span className="text-slate-500 text-[11px] font-medium mt-0.5 block">
                      {step.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center font-bold shrink-0 text-xs font-mono">
                5
              </span>
              <div>
                <span className="font-bold text-slate-900 block">
                  Seu público escaneia e acessa seu canal instantaneamente
                </span>
                <span className="text-slate-500 text-[11px] font-medium mt-0.5 block">
                  Ao apontar a câmera do celular para a tela da TV ou monitor, o link do seu canal é aberto no app do YouTube.
                </span>
              </div>
            </div>
          </div>

          {/* CapCut Creator Tips */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-red-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Dicas para Edição no CapCut / Premiere / DaVinci
              </h4>
            </div>

            <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside font-medium">
              <li>
                <strong className="text-slate-900">Camada de Sobreposição:</strong> No CapCut, use a função <em>Camada (Overlay)</em> para adicionar o PNG com fundo transparente.
              </li>
              <li>
                <strong className="text-slate-900">Posicionamento:</strong> Coloque no canto inferior direito ou esquerdo, longe de legendas principais.
              </li>
              <li>
                <strong className="text-slate-900">Duração recomendada:</strong> Exiba por 6 a 10 segundos nos momentos de chamada para ação (CTA) do seu vídeo.
              </li>
              <li>
                <strong className="text-slate-900">Transição suave:</strong> Adicione uma animação de <em>Fade In (Surgir)</em> e <em>Fade Out</em> para um visual profissional.
              </li>
            </ul>
          </div>

          {/* YouTube Subscription Policy Clarification */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                Importante sobre a Inscrição no YouTube
              </h5>
              <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                Por diretrizes e segurança oficial do YouTube e Google, o QR Code direciona o usuário diretamente para a página do canal. <strong>A confirmação da inscrição depende sempre da ação consciente do próprio usuário</strong> ao clicar no botão &quot;Inscrever-se&quot; no aplicativo ou site do YouTube.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Entendi, vamos começar!
          </button>
        </div>
      </div>
    </div>
  );
};
