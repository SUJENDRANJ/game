import { Sparkles } from 'lucide-react';

interface CelebrationOverlayProps {
  show: boolean;
  message: string;
}

export default function CelebrationOverlay({ show, message }: CelebrationOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
        <Sparkles className="w-6 h-6" />
        <span className="text-xl font-bold">{message}</span>
        <Sparkles className="w-6 h-6" />
      </div>
    </div>
  );
}
