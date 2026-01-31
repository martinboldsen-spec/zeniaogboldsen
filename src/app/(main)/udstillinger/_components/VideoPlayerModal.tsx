'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  videoCaption?: string;
}

export function VideoPlayerModal({ isOpen, onClose, videoUrl, videoCaption }: VideoPlayerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-2 bg-black border-none">
        <VisuallyHidden>
          <DialogTitle>{videoCaption || 'Video Player'}</DialogTitle>
        </VisuallyHidden>
        <div className="relative aspect-video">
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
        </div>
        {videoCaption && (
            <div className="text-sm text-white/80 p-2 text-center">
                {videoCaption}
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
