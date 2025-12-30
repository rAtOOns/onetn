import { getTodaysKural } from "@/lib/thirukkural-helpers";
import { BookOpen, Sparkles, Heart } from "lucide-react";

export default function ThirukkuralWidget() {
  const kural = getTodaysKural();

  return (
    <section
      className="py-8 bg-gradient-to-r from-tn-primary to-tn-highlight text-white"
      aria-labelledby="thirukkural-heading"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <BookOpen size={24} />
            </div>
            <div>
              <h2
                id="thirukkural-heading"
                className="text-lg md:text-xl font-bold flex items-center gap-2"
              >
                Today&apos;s Thirukkural
                <Sparkles size={18} className="text-emerald-100" />
              </h2>
              <p className="text-xs text-emerald-100 tamil">இன்றைய திருக்குறள்</p>
            </div>
          </div>
          <div className="md:ml-auto">
            <span className="inline-block text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium">
              #{kural.number} of 1330
            </span>
          </div>
        </div>

        {/* Kural Content - Responsive Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Tamil Kural */}
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 md:p-6">
            <div className="flex items-start gap-2 mb-4">
              <Heart size={16} className="text-emerald-100 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white">
                  {kural.chapter}
                </h3>
                <span className="text-xs text-emerald-100">
                  {kural.chapterEn}
                </span>
              </div>
            </div>

            {/* Tamil Text */}
            <div className="space-y-2 mb-4">
              <p
                className="text-lg md:text-xl font-medium tamil leading-relaxed"
                lang="ta"
              >
                {kural.lines[0]}
              </p>
              <p
                className="text-lg md:text-xl font-medium tamil leading-relaxed"
                lang="ta"
              >
                {kural.lines[1]}
              </p>
            </div>

            {/* Section Info */}
            <p className="text-xs text-emerald-100">
              <strong className="text-white">{kural.section}</strong>
              {" / "}
              {kural.sectionEn}
            </p>
          </div>

          {/* Right: English Translation */}
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 md:p-6 flex flex-col justify-center">
            <h3 className="text-sm font-semibold text-white mb-3">
              Translation
            </h3>
            <p className="text-base md:text-lg leading-relaxed italic text-emerald-50">
              &ldquo;{kural.translation}&rdquo;
            </p>
            <p className="text-xs text-emerald-100 mt-4 pt-4 border-t border-white/20">
              Translated from the original Tamil work of Thiruvalluvar
            </p>
          </div>
        </div>

        {/* Footer Note - Explanation */}
        <div className="mt-4 text-center text-xs text-emerald-100">
          <p>
            <strong>Thirukkural:</strong> A sacred collection of 1,330 couplets (Kurals) of Tamil wisdom literature on virtues,
            wealth, and love—composed by Thiruvalluvar, one of the greatest works of classical Tamil literature.
          </p>
        </div>
      </div>
    </section>
  );
}
