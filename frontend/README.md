# Hooks vs  Context
1. Hooks // component specific data
- logic resuse

use case:
- fetching
- caching
- transformations
- side effect

adv
- each component have its own instance (isolated) & easy debugging
- very reusable without global deendency

dis_ad
- no shared state
- hard to push update anywhere else
1. Context
- state distribution

adv
- shared state

use case:
- enity switch
- audit
- logistics

disad
- one copmoent re-render, all re-renders.
- not freely reusaple.



Context → holds state
Hook → consumes + controls it

# plan


This guide combines everything: Type-safety, XHR for progress tracking, React Query for caching/polling, and Shadcn for UI.
## 1. Folder Structure
"""
src/
├── types/
│   └── index.ts
├── services/             # Pure logic (No React)
│   ├── api-client.ts
│   └── project.service.ts
├── context/              # UI State (e.g., Theme, Sidebar toggle)
│   └── UIContext.tsx
├── providers/            # Combines QueryClient + Context + Router
│   └── AppProvider.tsx
├── hooks/                # Orchestration
│   └── useProjects.ts
├── components/           # Reusable UI
│   ├── ui/               # Shadcn
│   └── shared/           # LoadingSpinner, Navbar
├── layouts/              # Defines the "Shell" & Outlets
│   └── RootLayout.tsx
├── pages/                # Page-level components (Routes)
│   ├── HomePage.tsx
│   └── ProjectsPage.tsx
├── App.tsx               # Router configuration
└── main.tsx              # Mounts AppProvider
"""
------------------------------
## 2. The Types (src/types/index.ts)
// 1. The Core Entity
export interface Project {
  id: string;
  name: string;
  status: 'active' | 'archived' | 'pending'; // Specific strings are better than just 'string'
  createdAt: string;
  documentUrl?: string; // The URL returned after uploading
}

// 2. The Request (What you SEND)
export interface CreateProjectPayload {
  name: string;
  document: File;
}

// 3. The Response (What the API returns)
// Sometimes APIs wrap results: { data: [...], total: 10 }
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

------------------------------
## 3. The API Client (src/services/api-client.ts)
We use XMLHttpRequest because the modern fetch API cannot track upload percentages.

const BASE_URL = "https://api.example.com";

// 1. Define exactly what 'options' can be
interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  params?: Record<string, string | number>; // For things like ?id=1&sort=asc
  headers?: Record<string, string>;
}

export async function request<T>(
  url: string,
  { method, body, params, headers }: RequestOptions,
  onProgress?: (pct: number) => void
): Promise<T> {
  return new Promise((resolve, reject) => {

    // 2. Handle URL Parameters (?key=value)
    let fullUrl = `${BASE_URL}${url}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value.toString());
      });
      fullUrl += `?${searchParams.toString()}`;
    }

    const xhr = new XMLHttpRequest();
    xhr.open(method, fullUrl);

    // 3. Set Default Headers (like Auth tokens if you have them)
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    // 4. Progress Tracking (Keep this as you had it)
    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Handle empty responses (like 204 No Content)
        const response = xhr.response ? JSON.parse(xhr.response) : {};
        resolve(response);
      } else {
        reject({ status: xhr.status, message: xhr.statusText });
      }
    };

    xhr.onerror = () => reject(new Error("Network Error"));

    // 5. SMART BODY HANDLING
    if (!body) {
      xhr.send(); // For GET and DELETE
    } else if (body instanceof FormData) {
      // For FILES + TEXT (The browser automatically sets boundary)
      xhr.send(body);
    } else {
      // For JSON data
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(body));
    }
  });
}


------------------------------
## 4. Project Service (src/services/project.service.ts)

// src/services/project.service.ts
import { request } from "./api-client";
import { Project, CreateProjectPayload, ApiResponse } from "../types";

export const projectService = {
  // 1. GET with optional filtering (e.g., status)
  getProjects: (status?: string) =>
    request<Project[]>("/projects", {
      method: "GET",
      params: status ? { status } : undefined
    }),

  // 2. GET a single item by ID
  getProjectById: (id: string) =>
    request<Project>(`/projects/${id}`, { method: "GET" }),

  // 3. POST (Multipart/FormData) - Files + Text
  createProject: (payload: CreateProjectPayload, onProgress?: (n: number) => void) => {
    const fd = new FormData();
    fd.append("name", payload.name);
    fd.append("file", payload.document); // Works for images, PDFs, etc.

    return request<Project>("/projects", {
      method: "POST",
      body: fd
    }, onProgress);
  },

  // 4. PATCH (JSON) - Updating a name or status
  updateProject: (id: string, updates: Partial<Project>) =>
    request<Project>(`/projects/${id}`, {
      method: "PATCH",
      body: updates
    }),

  // 5. DELETE
  deleteProject: (id: string) =>
    request<void>(`/projects/${id}`, { method: "DELETE" })
};


------------------------------
## 5. The Hook (src/hooks/useProjects.ts)

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../services/project.service";
import { useState } from "react";
import { CreateProjectPayload } from "../types";

export function useProjects(status?: string) {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  // 1. GET: Notice the queryKey includes 'status'
  // If status changes, React Query automatically triggers a "Hard Loading" state
  const query = useQuery({
    queryKey: ["projects", status],
    queryFn: () => projectService.getProjects(status),
    refetchInterval: 30000, // Poll every 30s
    // Good Habit: Keep old data on screen while fetching new data for a filter
    placeholderData: (previousData) => previousData,
  });

  // 2. POST: Mutation for creating
  const createMutation = useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      projectService.createProject(payload, (pct) => setUploadProgress(pct)),
    onSuccess: () => {
      // Refresh the list immediately after a new one is added
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setUploadProgress(0);
    },
    onError: () => {
      setUploadProgress(0); // Reset progress if upload fails
    }
  });

  return {
    // Data
    projects: query.data,

    // Status Flags
    isLoading: query.isLoading,       // First fetch, no data yet (Show Skeleton)
    isFetching: query.isFetching,     // ANY fetch in progress (Show subtle spinner/bar)
    isError: query.isError,

    // Actions
    createProject: createMutation.mutate,
    isCreating: createMutation.isPending,

    // State
    uploadProgress,
  };
}

------------------------------
## 6. The UI Component (src/components/ProjectList.tsx)
Using Shadcn-like components for the Skeleton and Progress Bar.

import { useProjects } from "../hooks/useProjects";
import { Skeleton } from "./ui/skeleton";
import { Progress } from "./ui/progress";
import { Loader2 } from "lucide-react"; // Common loading icon

export function ProjectList() {
  // Use the refined hook (standardized names)
  const { projects, isLoading, isFetching, createProject, uploadProgress } = useProjects();

  // 1. HARD LOADING (No data at all yet)
  // We show a list of skeletons to mimic the final UI
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" /> {/* Title Skeleton */}
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 relative">
      {/* 2. GLOBAL REFRESH INDICATOR
          By making this absolute, it stays out of the way but signals activity */}
      {isFetching && !isLoading && (
        <div className="absolute top-2 right-6 flex items-center gap-2 text-blue-500 text-xs font-medium">
          <Loader2 className="h-3 w-3 animate-spin" />
          Updating...
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
      </div>

      {/* 3. UPLOAD PROGRESS (Overlay or Top Bar) */}
      {uploadProgress > 0 && (
        <div className="mb-6 p-4 border border-blue-100 bg-blue-50 rounded-lg">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-blue-700">Uploading Document...</span>
            <span className="text-blue-600">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2 bg-blue-200" />
        </div>
      )}

      {/* 4. LIST RENDERING */}
      <div className="grid gap-3">
        {projects?.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No projects found.</p>
        ) : (
          projects?.map((p) => (
            <div
              key={p.id}
              className={`p-4 border rounded-lg bg-white shadow-sm transition-opacity ${isFetching ? 'opacity-70' : 'opacity-100'}`}
            >
              <div className="font-semibold">{p.name}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">{p.status}</div>
            </div>
          ))
        )}
      </div>

      <button
        disabled={uploadProgress > 0} // Prevent double uploads
        className="mt-6 w-full md:w-auto bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium disabled:opacity-50"
        onClick={() => {
          const file = new File(["dummy content"], "proposal.pdf", { type: "application/pdf" });
          createProject({ name: "Global Expansion", document: file });
        }}
      >
        {uploadProgress > 0 ? "Uploading..." : "Add New Project"}
      </button>
    </div>
  );
}

------------------------------
# session good  habit
However, there is one critical "Good Habit" you must add to your api-client.ts to make sessions work:
## The withCredentials Flag
By default, XMLHttpRequest (and fetch) might not send cookies to the backend if it's on a different subdomain or port (like localhost:3000 to localhost:5000). You must enable this:

// src/services/api-client.ts
export async function request<T>(...) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method, `${BASE_URL}${url}`);

    // MUST ADD THIS FOR SESSIONS
    xhr.withCredentials = true;

    // ... rest of your logic (onprogress, onload, etc.)
  });
}
---------------------------------
## 1. The Prefetch Refinement
In your HomePage, it's a good habit to pass a staleTime. This tells React Query: "I just fetched this, consider it fresh for the next 5 minutes."
"""
const handlePrefetch = () => {
  queryClient.prefetchQuery({
    queryKey: ["projects", undefined], // Match the key in your hook exactly!
    queryFn: () => projectService.getProjects(),
    staleTime: 1000 * 60 * 5,
  });
};
"""
