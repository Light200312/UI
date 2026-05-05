import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Static public route — can be prerendered
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    // Dynamic route with :id param — must be client-side only
    path: 'task/:id',
    renderMode: RenderMode.Client
  },
  {
    // Protected dashboard — client-side only (requires auth token)
    path: 'dashboard',
    renderMode: RenderMode.Client
  },
  {
    // Fallback — client-side for anything else
    path: '**',
    renderMode: RenderMode.Client
  }
];
