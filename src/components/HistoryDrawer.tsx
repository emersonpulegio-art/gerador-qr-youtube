import React from 'react';
import { History, X, Trash2, ArrowRight, Clock, QrCode } from 'lucide-react';
import { HistoryItem, QRConfig } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onLoadItem: (config: QRConfig) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onLoadItem,
  onDeleteItem,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                HISTÓRICO LOCAL
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                QR Codes gerados e salvos recentemente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs font-bold text-slate-500 hover:text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
              >
                Limpar Tudo
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {items.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">
                  Nenhum QR Code salvo ainda
                </p>
                <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto mt-1">
                  Quando você baixar ou gerar um QR Code, ele ficará salvo aqui para reutilização rápida.
                </p>
              </div>
            </div>
          ) : (
            items.map((item) => {
              const dateStr = new Date(item.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 bg-checkerboard p-1 shadow-xs">
                      {item.thumbnailDataUrl ? (
                        <img
                          src={item.thumbnailDataUrl}
                          alt="Thumbnail"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <QrCode className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900">
                        {item.channelName || 'Canal do YouTube'}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs font-mono font-medium">
                        {item.targetUrl}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {dateStr}
                        </span>
                        <span>•</span>
                        <span className="text-red-600 font-bold">{item.message}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onLoadItem(item.config);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                      title="Carregar configurações deste QR Code"
                    >
                      <span>Reutilizar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 shadow-xs transition-colors"
                      title="Excluir do histórico"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
