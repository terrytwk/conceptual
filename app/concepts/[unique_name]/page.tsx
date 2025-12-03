"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/footer-section";
import { getConceptFiles, getConceptVersions, publishExistingConceptVersion, getAllConcepts, downloadConceptVersion, getConceptDownloadCountViaQuery } from "@/lib/concepts";
import { getUserId, getAccessToken } from "@/lib/auth-storage";
import { Loader2, FileCode, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import JSZip from "jszip";

interface FileEntry {
  path: string;
  content: string;
}

interface VersionEntry {
  version: number;
  createdAt: string;
}

export default function ConceptCodeViewerPage() {
  const params = useParams();
  const uniqueName = params?.unique_name as string;
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [currentVersion, setCurrentVersion] = useState<number | null>(null);
  const [conceptCount, setConceptCount] = useState<number | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!uniqueName) return;
      setLoading(true);
      setError(null);
      try {
  // Determine ownership
  const concepts = await getAllConcepts();
  const match = concepts.find(c => c.uniqueName === uniqueName);
  const currentUserId = getUserId();
  const owner = match?.owner || null;
  setOwnerId(owner);
  setIsOwner(!!currentUserId && !!owner && currentUserId === owner);

        // Fetch versions sorted by date desc
  const v = await getConceptVersions(uniqueName);
        setVersions(v);
        const defaultVersion = v[0]?.version;
        setCurrentVersion(defaultVersion ?? null);

        const fileMap = await getConceptFiles(uniqueName, defaultVersion);
        const entries = Object.entries(fileMap).map(([path, content]) => ({ path, content }));
        // Sort: show folders/files alphabetically
        entries.sort((a, b) => a.path.localeCompare(b.path));
        setFiles(entries);
        if (entries.length > 0) {
          setSelectedPath(entries[0].path);
        }

  // Fetch concept-level download count via query on initial load
  setConceptCount(null);
  const fetchedCount = await getConceptDownloadCountViaQuery(uniqueName);
  setConceptCount(fetchedCount);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load files");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [uniqueName]);

  async function switchVersion(v: number) {
    if (!uniqueName) return;
    setLoading(true);
    setError(null);
    try {
      setCurrentVersion(v);
  // no per-version count fetch needed when switching
      const fileMap = await getConceptFiles(uniqueName, v);
      const entries = Object.entries(fileMap).map(([path, content]) => ({ path, content }));
      entries.sort((a, b) => a.path.localeCompare(b.path));
      setFiles(entries);
      setSelectedPath(entries[0]?.path ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load files");
    } finally {
      setLoading(false);
    }
  }

  async function onUploadNewVersion(ev: React.ChangeEvent<HTMLInputElement>) {
    const filesList = ev.target.files;
    if (!filesList || filesList.length === 0) return;
    // Optional: check owner via token presence
    const token = getAccessToken();
    if (!token) {
      alert('You must be signed in to publish a new version.');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const versionId = await publishExistingConceptVersion(uniqueName, filesList);
      // Refresh versions and open latest
      const v = await getConceptVersions(uniqueName);
      setVersions(v);
      const latest = v[0]?.version;
      if (typeof latest === 'number') {
        await switchVersion(latest);
      }
  // refresh concept-level count after upload
  // Refresh concept-level count from backend query
  setConceptCount(await getConceptDownloadCountViaQuery(uniqueName));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to publish version');
    } finally {
      setUploading(false);
      // reset input value
      ev.target.value = '';
    }
  }

  const selectedFile = files.find(f => f.path === selectedPath);

  // Enable folder selection attributes in a type-safe way
  useEffect(() => {
    const el = uploadInputRef.current as any;
    if (el) {
      el.setAttribute('webkitdirectory', '');
      el.setAttribute('directory', '');
    }
  }, [uploadInputRef]);

  async function downloadZip() {
    try {
      if (files.length === 0) {
        alert("No files in latest version to download.");
        return;
      }
      // Fetch via backend sync to record analytics
      if (currentVersion == null) {
        alert("No version selected.");
        return;
      }
      const token = getAccessToken();
      if (!token) {
        alert("Please sign in to download.");
        return;
      }
      const versionFiles = await downloadConceptVersion(uniqueName, currentVersion, token);
      const zip = new JSZip();
      for (const [path, content] of Object.entries(versionFiles)) {
        zip.file(path, content);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${uniqueName}-v${currentVersion}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
  // Increment concept-level count locally after successful download
  setConceptCount((c) => (c == null ? 1 : c + 1));
    } catch (e) {
      console.error(e);
      alert("Download failed. Please try again later.");
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/concepts" className="text-sm inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to concepts
          </Link>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
            {uniqueName}
            {isOwner && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-border">Owner</span>
            )}
            <span className="text-xs px-2 py-0.5 rounded-md bg-muted/40 text-muted-foreground border border-border">Downloads: {conceptCount == null ? "~" : conceptCount}</span>
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Versions sidebar */}
          <div className="md:col-span-1 border border-border rounded-lg bg-card overflow-hidden flex flex-col">
            <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground border-b border-border bg-muted/40 flex items-center justify-between">
              <span>Versions</span>
              {isOwner && (
                <label className="text-xs inline-flex items-center gap-2 cursor-pointer">
                  <input ref={uploadInputRef} type="file" multiple className="hidden" onChange={onUploadNewVersion} />
                  <span className={cn("px-2 py-1 rounded-md border border-border hover:bg-muted/60", uploading && "opacity-50 pointer-events-none")}>{uploading ? 'Uploading...' : 'Upload'}</span>
                </label>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {versions.length === 0 && (
                <div className="p-3 text-xs text-muted-foreground">No versions yet.</div>
              )}
              {versions.map(v => (
                <button
                  key={`${v.version}-${v.createdAt}`}
                  onClick={() => switchVersion(v.version)}
                  className={cn("w-full text-left px-3 py-2 text-sm flex items-start gap-2 hover:bg-muted/60 transition-colors border-b border-border", currentVersion === v.version && "bg-primary/10 text-primary font-medium")}
                >
                  <div className="flex flex-col">
                    <span>v{v.version}</span>
                    <span className="text-xs text-muted-foreground">{new Date(v.createdAt).toLocaleString()}</span>
                    {/* No per-version count; concept-level count shown in header */}
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Files sidebar */}
          <div className="md:col-span-1 border border-border rounded-lg bg-card overflow-hidden flex flex-col">
            <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground border-b border-border bg-muted/40">Files</div>
            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin mr-2" />Loading files...</div>
              )}
              {!loading && files.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">No files in selected version.</div>
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
              <button
                type="button"
                onClick={downloadZip}
                className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-border hover:bg-muted/60 transition-colors"
                title="Download selected version as ZIP"
              >
                <Download className="w-4 h-4" />
                Download v{currentVersion ?? "-"}
              </button>
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
