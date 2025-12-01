"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/footer-section";
import { getConceptFiles } from "@/lib/concepts";
import { Loader2, FileCode, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FileEntry {
  path: string;
  content: string;
}

export default function ConceptCodeViewerPage() {
  const params = useParams();
  const uniqueName = params?.unique_name as string;
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!uniqueName) return;
      setLoading(true);
      setError(null);
      try {
        const fileMap = await getConceptFiles(uniqueName);
        const entries = Object.entries(fileMap).map(([path, content]) => ({ path, content }));
        // Sort: show folders/files alphabetically
        entries.sort((a, b) => a.path.localeCompare(b.path));
        setFiles(entries);
        if (entries.length > 0) {
          setSelectedPath(entries[0].path);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load files");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [uniqueName]);

  const selectedFile = files.find(f => f.path === selectedPath);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/concepts" className="text-sm inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to concepts
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">{uniqueName}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 border border-border rounded-lg bg-card overflow-hidden flex flex-col">
            <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground border-b border-border bg-muted/40">Files</div>
            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin mr-2" />Loading files...</div>
              )}
              {!loading && files.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">No files in latest version.</div>
              )}
              {!loading && files.map(f => (
                <button
                  key={f.path}
                  onClick={() => setSelectedPath(f.path)}
                  className={cn("w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted/60 transition-colors border-b border-border", selectedPath === f.path && "bg-primary/10 text-primary font-medium")}
                >
                  <FileCode className="w-4 h-4" />
                  <span className="truncate" title={f.path}>{f.path}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-3 border border-border rounded-lg bg-card flex flex-col">
            <div className="px-4 py-3 flex items-center justify-between border-b border-border">
              <div className="text-sm font-medium text-muted-foreground">{selectedPath || "Select a file"}</div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {loading && (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mr-2" />Loading content...</div>
              )}
              {!loading && error && (
                <div className="text-sm text-destructive">{error}</div>
              )}
              {!loading && !error && selectedFile && (
                <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono text-foreground bg-muted/40 p-4 rounded-md border border-border">
{selectedFile.content}
                </pre>
              )}
              {!loading && !error && !selectedFile && files.length > 0 && (
                <div className="text-sm text-muted-foreground">Select a file to view its contents.</div>
              )}
            </div>
          </div>
        </div>
      </main>
      <div className="mt-12">
        <FooterSection />
      </div>
    </div>
  );
}
