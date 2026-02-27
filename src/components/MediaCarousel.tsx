
import React, { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MediaCarouselProps {
  media: string[];
  altPrefix?: string;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({ media, altPrefix = "Media" }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const handleMediaClick = (src: string) => {
    setPreviewSrc(src);
    setPreviewOpen(true);
  };

  return (
    <div className="relative">
      <Carousel className="w-full max-w-lg mx-auto">
        <CarouselContent>
          {media.map((src, i) => (
            <CarouselItem key={i}>
              <AspectRatio ratio={16 / 9} className="bg-gray-100 rounded-lg cursor-pointer flex items-center justify-center hover:ring-2 hover:ring-blue-400 transition">
                <img
                  src={src}
                  alt={`${altPrefix} ${i + 1}`}
                  className="object-cover w-full h-full max-h-[360px] rounded-lg hover:scale-110 transition-transform duration-300 cursor-zoom-in"
                  onClick={() => handleMediaClick(src)}
                  style={{ maxHeight: 360 }}
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        {media.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="bg-white dark:bg-zinc-900 max-w-3xl flex items-center justify-center shadow-xl rounded-2xl">
          {previewSrc && (
            <img
              src={previewSrc}
              alt="Full Image"
              className="max-w-full max-h-[80vh] mx-auto rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaCarousel;
