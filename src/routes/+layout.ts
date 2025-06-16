// import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
// import { createBrowserClient, isBrowser, parse } from "@supabase/ssr";

// import type { Load } from '@sveltejs/kit';

// export const load = async ({ fetch, data, depends }) => {
//   depends('supabase:auth');
  
//   const supabase = createBrowserClient(
//     PUBLIC_SUPABASE_URL, 
//     PUBLIC_SUPABASE_ANON_KEY, 
//     {
//       global: { fetch },
//       cookies: {
//         get(key) {
//           if (!isBrowser()) {
//             // Server-side cookie handling
//             return data.session?.access_token || '';
//           }
          
//           // Browser-side cookie handling
//           const cookie = parse(document.cookie);
//           return cookie[key] || '';
//         },
//         set(key, value, options) {
//           if (isBrowser()) {
//             document.cookie = `${key}=${value}; path=/; max-age=${options?.maxAge || 0}`;
//           }
//         },
//         remove(key, options) {
//           if (isBrowser()) {
//             document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
//           }
//         }
//       }
//     }
//   );

//   const { data: { session } } = await supabase.auth.getSession();

//   return { 
//     supabase,  // Including the client since you'll need it for custom auth UI
//     session 
//   };
// }