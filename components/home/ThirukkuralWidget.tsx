import { getTodaysKural } from "@/lib/thirukkural-helpers";
import { BookOpen, Sparkles, Heart } from "lucide-react";

export default function ThirukkuralWidget() {
  const kural = getTodaysKural();

  return (
    <section
      className="py-2 bg-gradient-to-r from-tn-primary to-tn-highlight text-white"
      aria-labelledby="thirukkural-heading"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-1 mb-1.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
              <BookOpen size={20} />
            </div>
            <div>
              <h2
                id="thirukkural-heading"
                className="text-base md:text-lg font-bold flex items-center gap-1"
              >
                Today&apos;s Kural
                <Sparkles size={14} className="text-emerald-100" />
              </h2>
              <p className="text-[10px] text-emerald-100 tamil">குறள்</p>
            </div>
          </div>
          <div className="md:ml-auto">
            <span className="inline-block text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium">
              #{kural.number} of 1330
            </span>
          </div>
        </div>

        {/* Kural Content - Responsive Grid */}
        <div className="grid md:grid-cols-2 gap-2">
          {/* Left: Tamil Kural */}
          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2">
            <div className="flex items-start gap-1 mb-1">
              <Heart size={14} className="text-emerald-100 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold text-white">
                  {kural.chapter}
                </h3>
                <span className="text-[10px] text-emerald-100">
                  {kural.chapterEn}
                </span>
              </div>
            </div>

            {/* Tamil Text */}
            <div className="space-y-0.5 mb-1">
              <p
                className="text-xs md:text-sm font-medium tamil leading-tight"
                lang="ta"
              >
                {kural.lines[0]}
              </p>
              <p
                className="text-xs md:text-sm font-medium tamil leading-tight"
                lang="ta"
              >
                {kural.lines[1]}
              </p>
            </div>

            {/* Section Info */}
            <p className="text-[10px] text-emerald-100">
              <strong className="text-white text-[10px]">{kural.section}</strong>
              {" / "}
              {kural.sectionEn}
            </p>
          </div>

          {/* Right: English Translation */}
          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 flex flex-col justify-center">
            <h3 className="text-[10px] font-semibold text-white mb-1">
              Translation
            </h3>
            <p className="text-xs md:text-sm leading-tight italic text-emerald-50">
              &ldquo;{kural.translation}&rdquo;
            </p>
            <p className="text-[9px] text-emerald-100 mt-1 pt-1 border-t border-white/20">
              —Thiruvalluvar
            </p>
          </div>
        </div>

        {/* Footer Note - Explanation */}
        <div className="mt-1 text-center text-[9px] text-emerald-100">
          <p className="leading-tight">
            <strong>Kural</strong>: 1,330 Tamil wisdom verses on virtue, wealth, love
          </p>
        </div>
      </div>
    </section>
  );
}
