import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const FoodItemSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  unit: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  fiber: z.number(),
  confidence: z.enum(["high", "medium", "low"]),
  notes: z.string().optional(),
});

const ParseResultSchema = z.object({
  items: z.array(FoodItemSchema),
});

export type FoodItem = z.infer<typeof FoodItemSchema>;
export type ParseResult = z.infer<typeof ParseResultSchema>;

const TOOL: Anthropic.Tool = {
  name: "parse_food_log",
  description:
    "Parse a user's food description into structured nutrition data. Be as accurate as possible with standard USDA-style nutrition values. When ambiguous, pick the most common serving size and note the assumption.",
  input_schema: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description:
                "Clean name of the food item (e.g. 'chicken breast, grilled')",
            },
            quantity: {
              type: "number",
              description: "Numeric quantity (e.g. 1, 0.5, 2)",
            },
            unit: {
              type: "string",
              description:
                "Unit of measure (e.g. 'oz', 'cup', 'medium', 'slice', 'tbsp')",
            },
            calories: {
              type: "number",
              description: "Total calories for this quantity",
            },
            protein: {
              type: "number",
              description: "Grams of protein",
            },
            carbs: {
              type: "number",
              description: "Grams of carbohydrates",
            },
            fat: {
              type: "number",
              description: "Grams of fat",
            },
            fiber: {
              type: "number",
              description: "Grams of fiber",
            },
            confidence: {
              type: "string",
              enum: ["high", "medium", "low"],
              description:
                "How confident you are in the nutrition values. 'high' for well-known single-ingredient foods, 'medium' for common prepared foods, 'low' for vague descriptions or restaurant meals.",
            },
            notes: {
              type: "string",
              description:
                "Optional note about assumptions (e.g. 'assumed skin-on', 'estimated 6oz fillet')",
            },
          },
          required: [
            "name",
            "quantity",
            "unit",
            "calories",
            "protein",
            "carbs",
            "fat",
            "fiber",
            "confidence",
          ],
        },
      },
    },
    required: ["items"],
  },
};

const ParseBodySchema = z.object({
  input: z.string().min(1).max(2000),
  apiKey: z.string().min(1),
});

const EditBodySchema = z.object({
  mode: z.literal("edit"),
  apiKey: z.string().min(1),
  instruction: z.string().min(1).max(2000),
  currentItem: FoodItemSchema,
});

const EDIT_TOOL: Anthropic.Tool = {
  name: "edit_food_item",
  description:
    "Return the corrected food item with updated nutrition data based on the user's instruction. Recalculate all affected nutrition values when quantity, weight, or type changes.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Clean name of the food item" },
      quantity: { type: "number", description: "Numeric quantity" },
      unit: { type: "string", description: "Unit of measure" },
      calories: { type: "number", description: "Total calories for this quantity" },
      protein: { type: "number", description: "Grams of protein" },
      carbs: { type: "number", description: "Grams of carbohydrates" },
      fat: { type: "number", description: "Grams of fat" },
      fiber: { type: "number", description: "Grams of fiber" },
      confidence: {
        type: "string",
        enum: ["high", "medium", "low"],
        description: "How confident you are — raise to 'high' if user gave exact specifics",
      },
      notes: { type: "string", description: "Updated note reflecting corrections" },
    },
    required: ["name", "quantity", "unit", "calories", "protein", "carbs", "fat", "fiber", "confidence"],
  },
};

export async function POST(request: NextRequest) {
  const body = await request.json();

  // ─── Edit mode: update a single item ───
  if (body.mode === "edit") {
    const parsed = EditBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey: parsed.data.apiKey });
    const { currentItem, instruction } = parsed.data;

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      tools: [EDIT_TOOL],
      tool_choice: { type: "tool", name: "edit_food_item" },
      messages: [
        {
          role: "user",
          content: [
            "You are editing a food item based on the user's correction.",
            "",
            "Current item:",
            `  Name: ${currentItem.name}`,
            `  Quantity: ${currentItem.quantity} ${currentItem.unit}`,
            `  Calories: ${currentItem.calories}`,
            `  Protein: ${currentItem.protein}g`,
            `  Carbs: ${currentItem.carbs}g`,
            `  Fat: ${currentItem.fat}g`,
            `  Fiber: ${currentItem.fiber}g`,
            `  Confidence: ${currentItem.confidence}`,
            `  Notes: ${currentItem.notes || "none"}`,
            "",
            `User correction: ${instruction}`,
            "",
            "Return the updated item. Recalculate ALL affected nutrition values — if the user changes weight, quantity, or type, every macro should update proportionally. Round calories to whole numbers, macros to one decimal.",
          ].join("\n"),
        },
      ],
    });

    const block = message.content.find((b) => b.type === "tool_use") as
      | Anthropic.ToolUseBlock
      | undefined;

    if (!block) {
      return NextResponse.json(
        { error: "No structured response from Claude" },
        { status: 502 }
      );
    }

    const result = FoodItemSchema.safeParse(block.input);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid response shape", details: result.error.flatten() },
        { status: 502 }
      );
    }

    return NextResponse.json({ item: result.data });
  }

  // ─── Parse mode: extract new food items ───
  const parsed = ParseBodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const client = new Anthropic({ apiKey: parsed.data.apiKey });

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2048,
    tools: [TOOL],
    tool_choice: { type: "tool", name: "parse_food_log" },
    messages: [
      {
        role: "user",
        content: `You are a nutrition data parser. The user described what they ate. Parse each food item into structured data with accurate USDA-style nutrition values per the quantity described. If something is vague (like "a sandwich"), make reasonable assumptions and note them. Always round to whole numbers for calories and one decimal for macros.\n\nUser input:\n${parsed.data.input}`,
      },
    ],
  });

  const block = message.content.find((b) => b.type === "tool_use") as
    | Anthropic.ToolUseBlock
    | undefined;

  if (!block) {
    return NextResponse.json(
      { error: "No structured response from Claude" },
      { status: 502 }
    );
  }

  const result = ParseResultSchema.safeParse(block.input);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid response shape", details: result.error.flatten() },
      { status: 502 }
    );
  }

  return NextResponse.json(result.data);
}
