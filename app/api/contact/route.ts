import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resendApiKey = process.env.RESEND_API_KEY;

const resend = resendApiKey
  ? new Resend(resendApiKey)
  : null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      message,
      category,
      page,
      created_at,
    } = body;

    const timestamp =
      created_at || new Date().toISOString();

    const inquiryCategory =
      category || page || "General Inquiry";

    const pageValue =
      page || category || "contact";

    const targetEmail =
      process.env.CONTACT_EMAIL || "elkberfahd@gmail.com";

    // ==========================================
    // 1. SAVE TO SUPABASE
    // ==========================================

    const payload = {
      name: name?.trim() || "",
      phone: phone?.trim() || "",
      message: message?.trim() || "",
      category: inquiryCategory,
      page: pageValue,
      created_at: timestamp,
    };

    const { error: supabaseError } = await supabase
      .from("contact_requests")
      .insert([payload]);

    if (supabaseError) {
      console.error(
        "SUPABASE ERROR:",
        supabaseError
      );

      return NextResponse.json(
        {
          success: false,
          step: "supabase",
          error: supabaseError.message,
        },
        { status: 400 }
      );
    }

    console.log("✅ Supabase insert successful");

    // ==========================================
    // 2. SEND EMAIL WITH RESEND
    // ==========================================

    if (!resend) {
      console.error(
        "RESEND_API_KEY is missing"
      );

      return NextResponse.json({
        success: true,
        database: true,
        email: false,
        message:
          "Saved to Supabase, but Resend API key is missing.",
      });
    }

    const subject =
      `New FAAF Customer Inquiry - ${inquiryCategory}`;

    const emailText = `
New FAAF Customer Inquiry

Customer Name: ${name || "N/A"}

Phone: ${phone || "N/A"}

Category: ${inquiryCategory}

Page: ${pageValue}

Message:
${message || "N/A"}

Date:
${new Date(timestamp).toLocaleString()}
`;

    console.log("📧 Sending email to:", targetEmail);

    const { data: emailData, error: emailError } =
      await resend.emails.send({
        from:
          process.env.EMAIL_FROM ||
          "onboarding@resend.dev",

        to: [targetEmail],

        subject,

        text: emailText,
      });

    if (emailError) {
      console.error(
        "RESEND ERROR:",
        emailError
      );

      return NextResponse.json({
        success: true,
        database: true,
        email: false,
        message:
          "Saved to Supabase, but email failed.",
        emailError: emailError.message,
      });
    }

    console.log(
      "✅ EMAIL SENT:",
      emailData
    );

    // ==========================================
    // 3. SUCCESS
    // ==========================================

    return NextResponse.json({
      success: true,
      database: true,
      email: true,
      message:
        "Inquiry saved to Supabase and email sent successfully.",
    });

  } catch (error: any) {

    console.error(
      "CONTACT API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Internal server error",
      },
      { status: 500 }
    );
  }
}