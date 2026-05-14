import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Upload, Trash2, Heart, Plus, Sparkles } from "lucide-react";

interface Memory {
  id: string;
  imageUrl: string;
  caption: string;
  subcaption?: string;
}

interface PolaroidGalleryProps {
  memories: Memory[];
  onAddMemory: (imageUrl: string, caption: string, subcaption: string) => Promise<void>;
  onDeleteMemory: (id: string) => Promise<void>;
  isCreatorMode: boolean;
}

export default function PolaroidGallery({
  memories,
  onAddMemory,
  onDeleteMemory,
  isCreatorMode
}: PolaroidGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [captionInput, setCaptionInput] = useState("");
  const [subcaptionInput, setSubcaptionInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handlePrev = () => {
    if (memories.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? memories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (memories.length === 0) return;
    setCurrentIndex((prev) => (prev === memories.length - 1 ? 0 : prev + 1));
  };

  // Process standard click file upload to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorText("File size is too big! Please upload photos under 8MB to preserve server storage.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrlInput(reader.result as string);
      };
      reader.onerror = () => {
        setErrorText("Failed to read image file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    if (!imageUrlInput) {
      setErrorText("Please attach a photo or input a web image link first.");
      return;
    }
    if (!captionInput) {
      setErrorText("Please type a sweet romantic caption for this polaroid.");
      return;
    }

    setIsPosting(true);
    try {
      await onAddMemory(imageUrlInput, captionInput, subcaptionInput || "Special memory.");
      setCaptionInput("");
      setSubcaptionInput("");
      setImageUrlInput("");
      setCurrentIndex(0); // slide to newest
    } catch (err: any) {
      setErrorText(err?.message || "Failed to submit polaroid.");
    } finally {
      setIsPosting(false);
    }
  };

  const currentMemory = memories[currentIndex];

  return (
    <div className="space-y-8">
      {/* Photo Frame Deck Carousel */}
      {memories.length === 0 ? (
        <div className="text-center py-12 bg-stone-900/40 border border-dashed border-stone-800 rounded-3xl">
          <p className="text-stone-500 italic text-sm">Our Memories ledger is empty. Upload some polaroids using Ayush's keys!</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          {/* Polaroid container with smooth interactive lift */}
          <div className="relative group w-full max-w-[340px] aspect-[1/1.22] bg-stone-100 p-4 pb-10 rounded-xl shadow-2xl border border-stone-200/80 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:scale-[1.01] transition-all duration-500">
            {/* Real tape design */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-500/10 border border-amber-600/10 backdrop-blur-sm -rotate-2 select-none" />

            {/* Inner Polaroid Photo Card Panel */}
            <div className="relative w-full aspect-square overflow-hidden rounded bg-stone-900 border border-stone-200/25">
              <img
                src={currentMemory.imageUrl}
                alt={currentMemory.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              {/* Soft overlay representing authentic photography glare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/[0.08]" />
              
              {/* Mini heart-glow flag */}
              <div className="absolute bottom-3 right-3 p-1.5 rounded-full bg-stone-950/60 backdrop-blur-sm shadow border border-white/15 text-rose-400">
                <Heart className="w-4 h-4 fill-rose-500 animate-pulse" />
              </div>
            </div>

            {/* Handwritten Title Card */}
            <div className="mt-5 text-center px-2 select-none">
              <h3 className="font-serif text-lg text-stone-800 italic leading-tight uppercase font-semibold">
                {currentMemory.caption}
              </h3>
              {currentMemory.subcaption && (
                <p className="font-serif italic text-stone-500 text-xs mt-1.5 leading-snug">
                  {currentMemory.subcaption}
                </p>
              )}
            </div>

            {/* Deletion tool for Ayush */}
            {isCreatorMode && (
              <button
                onClick={() => onDeleteMemory(currentMemory.id)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-red-600 text-white shadow border border-red-500 hover:bg-red-700 hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
                title="Burn polaroid memory"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Carousel Slider Controls UI bar */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-xs font-mono text-stone-500 bg-stone-900/80 px-3 py-1 rounded-full border border-stone-800/40">
              {currentIndex + 1} of {memories.length}
            </span>

            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-all active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Creator Panel Custom Polaroid Generator */}
      {isCreatorMode && (
        <div className="w-full max-w-xl mx-auto rounded-2xl border border-stone-800 bg-stone-950 p-5 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Plus className="w-4 h-4 text-rose-300" />
            <h4 className="text-stone-200 font-serif text-sm">Ayush's Custom Polaroid Frame Uploader</h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase text-stone-500 tracking-wider mb-1">
                  Step 1: Choose image file
                </label>
                <div className="relative group p-3.5 rounded-xl border border-dashed border-stone-800 bg-stone-900/40 hover:bg-stone-900/70 hover:border-rose-900/60 text-center transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="w-4 h-4 text-stone-500 group-hover:text-rose-400 transition-colors" />
                    <span className="text-[10px] text-stone-400 font-mono">
                      {imageUrlInput ? "✨ Image Loaded" : "Upload Image"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-stone-500 tracking-wider mb-1">
                  Or Paste image URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/photo.jpg"
                  value={imageUrlInput.startsWith("data:") ? "" : imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-rose-900 p-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase text-stone-500 tracking-wider mb-1">
                  Step 2: Handwriting Title Caption
                </label>
                <input
                  type="text"
                  placeholder="E.g., Walking Lazy Under the Rain 🌧️"
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-rose-900 p-2.5"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-stone-500 tracking-wider mb-1">
                  Step 3: Sweet Subtext (Optional)
                </label>
                <input
                  type="text"
                  placeholder="E.g., You looked so pretty in your grey coat."
                  value={subcaptionInput}
                  onChange={(e) => setSubcaptionInput(e.target.value)}
                  className="w-full text-xs rounded-xl bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-rose-900 p-2.5"
                />
              </div>
            </div>

            {errorText && (
              <p className="text-[10px] text-red-400 bg-red-950/20 px-2 py-1 rounded">{errorText}</p>
            )}

            <button
              type="submit"
              disabled={isPosting}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-[11px] tracking-widest uppercase text-stone-950 bg-gradient-to-r from-rose-300 to-amber-200 hover:shadow-lg disabled:opacity-50"
            >
              {isPosting ? "DEVELOPING FILM..." : "Add to Memories Ledger ✨"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
