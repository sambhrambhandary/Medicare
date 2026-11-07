import React, { useState } from 'react';
import { Medicine } from '../types';
import { X, Send, CheckCheck, MessageSquare, ArrowLeft } from 'lucide-react';

interface WhatsAppSimulationModalProps {
  isOpen: boolean;
  medicine: Medicine | null;
  scheduledTime: string;
  patientName: string;
  onClose: () => void;
  onMarkTaken: (medicineId: string, time: string) => void;
  onOpenSkipModal: (medicine: Medicine, time: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  hasButtons?: boolean;
}

export const WhatsAppSimulationModal: React.FC<WhatsAppSimulationModalProps> = ({
  isOpen,
  medicine,
  scheduledTime,
  patientName,
  onClose,
  onMarkTaken,
  onOpenSkipModal,
}) => {
  if (!isOpen || !medicine) return null;

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const initialMessages: ChatMessage[] = [
    {
      id: 'm1',
      sender: 'bot',
      text: `Hello ${patientName} 🌸\n\nIt is time for your scheduled medicine:\n💊 *${medicine.name}* (${medicine.dosage})\n📋 Note: ${medicine.instructions}\n\nPlease reply with:\n*1* = Taken\n*2* = Skipped`,
      time: scheduledTime || nowTime,
      hasButtons: true,
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');

  const handleReplyTaken = () => {
    onMarkTaken(medicine.id, scheduledTime);
    setMessages((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        sender: 'user',
        text: '1 - Taken',
        time: nowTime,
      },
      {
        id: `b-${Date.now() + 1}`,
        sender: 'bot',
        text: `Wonderful! ✅ Recorded as *Taken* at ${nowTime}. Your pill supply is updated. Have a restful evening!`,
        time: nowTime,
      },
    ]);
  };

  const handleReplySkipped = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        sender: 'user',
        text: '2 - Skipped',
        time: nowTime,
      },
      {
        id: `b-${Date.now() + 1}`,
        sender: 'bot',
        text: `Understood, it is completely okay! Opening the quick reason selector to log why...`,
        time: nowTime,
      },
    ]);
    setTimeout(() => {
      onClose();
      onOpenSkipModal(medicine, scheduledTime);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-[#efeae2] dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-300 dark:border-slate-800 overflow-hidden flex flex-col h-[580px]">
        {/* WhatsApp App Header */}
        <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
              NM
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-1.5">
                <span>NudgeMed Reminders</span>
                <span className="text-[10px] bg-emerald-700/80 px-1 rounded">Verified</span>
              </div>
              <div className="text-[11px] text-teal-100">WhatsApp Health Assistant</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Message Canvas */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#d1d7db_1px,transparent_1px)] dark:bg-none dark:bg-slate-950 [background-size:16px_16px]">
          <div className="text-center">
            <span className="text-[10px] bg-amber-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-md shadow-xs">
              End-to-end encrypted · Patient privacy protected
            </span>
          </div>

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 shadow-xs text-xs leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-[#dcf8c6] text-slate-900 dark:bg-emerald-900 dark:text-white rounded-tr-xs'
                    : 'bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 rounded-tl-xs'
                }`}
              >
                <div>{m.text}</div>
                <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 mt-1">
                  <span>{m.time}</span>
                  {m.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                </div>
              </div>

              {/* Interactive Quick Reply Buttons for Senior Ease */}
              {m.hasButtons && (
                <div className="mt-2.5 flex flex-col gap-2 w-full max-w-[85%]">
                  <button
                    onClick={handleReplyTaken}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>Tap to Reply: "1 - Taken"</span>
                  </button>
                  <button
                    onClick={handleReplySkipped}
                    className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Tap to Reply: "2 - Skipped"</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* WhatsApp Input Bar */}
        <div className="bg-[#f0f2f5] dark:bg-slate-900 px-3 py-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type '1' for taken or '2' for skipped..."
            className="flex-1 px-3.5 py-2 text-xs bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (inputText.trim() === '1') {
                  handleReplyTaken();
                  setInputText('');
                } else if (inputText.trim() === '2') {
                  handleReplySkipped();
                  setInputText('');
                }
              }
            }}
          />
          <button
            onClick={() => {
              if (inputText.trim() === '1') {
                handleReplyTaken();
                setInputText('');
              } else if (inputText.trim() === '2') {
                handleReplySkipped();
                setInputText('');
              }
            }}
            className="w-9 h-9 rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0 hover:bg-[#008f70] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
