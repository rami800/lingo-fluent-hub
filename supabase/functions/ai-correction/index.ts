import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CorrectionRequest {
  type: "pronunciation" | "writing";
  userInput: string;
  expectedText: string;
  lessonId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    const { type, userInput, expectedText, lessonId }: CorrectionRequest = await req.json();

    // Validate input
    if (!type || !userInput || !expectedText) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: type, userInput, expectedText" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create prompt based on type
    let systemPrompt = "";
    if (type === "pronunciation") {
      systemPrompt = `You are a German language pronunciation coach. Analyze the user's spoken German text and compare it to the expected text.
      
Provide feedback in this JSON format:
{
  "score": <number 0-100>,
  "feedback": "<detailed feedback in the user's language>",
  "corrections": [
    {"word": "<incorrect word>", "expected": "<correct pronunciation>", "tip": "<pronunciation tip>"}
  ],
  "encouragement": "<positive encouragement>"
}

Be encouraging but honest. Focus on common pronunciation mistakes for Arabic, Turkish, and Ukrainian speakers learning German.`;
    } else {
      systemPrompt = `You are a German language writing coach. Analyze the user's written German text and compare it to the expected text.
      
Provide feedback in this JSON format:
{
  "score": <number 0-100>,
  "feedback": "<detailed feedback>",
  "corrections": [
    {"original": "<user's text>", "corrected": "<correct text>", "explanation": "<why this is wrong>"}
  ],
  "grammar_tips": ["<relevant grammar tips>"],
  "encouragement": "<positive encouragement>"
}

Focus on grammar, spelling, and word order. Be encouraging but thorough.`;
    }

    const userPrompt = `Expected German text: "${expectedText}"
User's ${type === "pronunciation" ? "spoken" : "written"} text: "${userInput}"

Please analyze and provide detailed feedback.`;

    // Call Lovable AI Gateway
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", errorText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiMessage = aiData.choices?.[0]?.message?.content;

    if (!aiMessage) {
      throw new Error("No response from AI");
    }

    // Parse AI response (try to extract JSON)
    let parsedFeedback;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiMessage.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiMessage;
      parsedFeedback = JSON.parse(jsonString.trim());
    } catch {
      // If parsing fails, return raw feedback
      parsedFeedback = {
        score: 50,
        feedback: aiMessage,
        corrections: [],
        encouragement: "Keep practicing!",
      };
    }

    // Save to database
    const { error: insertError } = await supabase.from("ai_corrections").insert({
      user_id: userId,
      lesson_id: lessonId || null,
      input_type: type,
      user_input: userInput,
      expected_text: expectedText,
      ai_feedback: JSON.stringify(parsedFeedback),
      score: parsedFeedback.score || 0,
    });

    if (insertError) {
      console.error("Error saving correction:", insertError);
    }

    return new Response(JSON.stringify(parsedFeedback), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in ai-correction function:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
