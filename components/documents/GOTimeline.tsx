"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, FileText, ArrowRight, AlertCircle, CheckCircle, XCircle, Edit } from "lucide-react";

interface TimelineEvent {
  id: string;
  documentId: string;
  relatedDocId: string | null;
  eventType: string;
  eventDate: string;
  description: string | null;
  document?: { id: string; title: string; goNumber: string | null };
  relatedDocument?: { id: string; title: string; goNumber: string | null };
}

const eventTypeConfig: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  issued: { icon: CheckCircle, color: "text-green-600 bg-green-100", label: "Issued" },
  amended: { icon: Edit, color: "text-blue-600 bg-blue-100", label: "Amended" },
  superseded: { icon: ArrowRight, color: "text-orange-600 bg-orange-100", label: "Superseded" },
  cancelled: { icon: XCircle, color: "text-red-600 bg-red-100", label: "Cancelled" },
  related: { icon: FileText, color: "text-purple-600 bg-purple-100", label: "Related" },
};

export default function GOTimeline({ documentId }: { documentId: string }) {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/timeline?documentId=${documentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTimeline(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [documentId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (timeline.length === 0) {
    return null; // Don't show if no timeline
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold text-tn-text mb-4 flex items-center gap-2">
        <Clock size={20} className="text-tn-primary" />
        GO Timeline & History
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-4">
          {timeline.map((event, index) => {
            const config = eventTypeConfig[event.eventType] || eventTypeConfig.related;
            const Icon = config.icon;

            return (
              <div key={event.id} className="relative flex gap-4 pl-10">
                {/* Icon */}
                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${config.color}`}>
                  <Icon size={16} />
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(event.eventDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {event.description && (
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                  )}

                  {event.relatedDocument && (
                    <Link
                      href={`/documents/${event.relatedDocument.id}`}
                      className="inline-flex items-center gap-2 text-sm text-tn-primary hover:text-tn-highlight"
                    >
                      <FileText size={14} />
                      {event.relatedDocument.goNumber || event.relatedDocument.title}
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <AlertCircle size={12} />
          Timeline shows amendments, supersessions, and related GOs
        </p>
      </div>
    </div>
  );
}
