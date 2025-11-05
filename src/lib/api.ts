import { supabase } from "@/integrations/supabase/client";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiClient = {
  async get<T>(url: string): Promise<T> {
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && {
          Authorization: `Bearer ${session.access_token}`,
        }),
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    return response.json();
  },

  async post<T>(url: string, body: unknown): Promise<T> {
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && {
          Authorization: `Bearer ${session.access_token}`,
        }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    return response.json();
  },

  async patch<T>(url: string, body: unknown): Promise<T> {
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && {
          Authorization: `Bearer ${session.access_token}`,
        }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    return response.json();
  },

  async delete<T>(url: string): Promise<T> {
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && {
          Authorization: `Bearer ${session.access_token}`,
        }),
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    return response.json();
  },
};
