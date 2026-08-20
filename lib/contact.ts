// Inline types for contact submissions

export interface ContactSubmission {
  name: string;
  phone: string;
  message: string;
  category?: string;
  page?: string;
  email?: string;
  created_at?: string;
}

export interface SubmitContactResult {
  success: boolean;
  data?: any;
  error?: string | null;
}

/**
 * Submits a contact or category inquiry request by calling the /api/contact route,
 * which handles BOTH inserting into the Supabase contact_requests table and
 * dispatching the Resend email notification securely on the server.
 */
export async function submitContactRequest(payload: ContactSubmission): Promise<SubmitContactResult> {
  try {
    const timestamp = payload.created_at || new Date().toISOString();
    const categoryVal = payload.category || payload.page || 'General Inquiry';
    const pageVal = payload.page || payload.category || 'contact';

    const fullPayload = {
      name: payload.name.trim(),
      phone: payload.phone.trim(),
      message: payload.message.trim(),
      category: categoryVal,
      page: pageVal,
      created_at: timestamp,
    };

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullPayload),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      console.error('Server contact submission error:', data.error);
      return {
        success: false,
        error: data.error || 'Failed to submit inquiry. Please try again.',
      };
    }

    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Unexpected error submitting contact request:', err);
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred. Please try again later.',
    };
  }
}
