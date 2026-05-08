"use client";

import { useState, useRef, useCallback } from "react";
import styles from "./food-math.module.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, PencilIcon, Trash2Icon, LoaderIcon, SendIcon, EyeIcon, EyeOffIcon, KeyIcon, SparklesIcon } from "lucide-react";
import type { FoodItem } from "@/app/food-math/api/route";

type BaseMacros = {
  baseQuantity: number;
  baseCalories: number;
  baseProtein: number;
  baseCarbs: number;
  baseFat: number;
  baseFiber: number;
};
type DraftItem = FoodItem & { id: string; editing: boolean } & BaseMacros;
type ApprovedItem = FoodItem & { id: string };

export function FoodMathApp() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [approved, setApproved] = useState<ApprovedItem[]>([]);
  const [editMessages, setEditMessages] = useState<Record<string, string>>({});
  const [editLoading, setEditLoading] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || loading || !apiKey.trim()) return;

      setLoading(true);
      setInput("");

      try {
        const res = await fetch("/food-math/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: text, apiKey: apiKey.trim() }),
        });

        if (!res.ok) {
          const err = await res.json();
          console.error("API error:", err);
          return;
        }

        const data = await res.json();
        const newDrafts: DraftItem[] = data.items.map(
          (item: FoodItem, i: number) => ({
            ...item,
            id: `${Date.now()}-${i}`,
            editing: false,
            baseQuantity: item.quantity,
            baseCalories: item.calories,
            baseProtein: item.protein,
            baseCarbs: item.carbs,
            baseFat: item.fat,
            baseFiber: item.fiber,
          })
        );
        setDrafts((prev) => [...newDrafts, ...prev]);
      } catch (err) {
        console.error("Request failed:", err);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [input, loading, apiKey]
  );

  const approveDraft = useCallback((id: string) => {
    const item = drafts.find((d) => d.id === id);
    if (!item) return;
    const { editing: _, baseQuantity: _bq, baseCalories: _bc, baseProtein: _bp, baseCarbs: _bca, baseFat: _bf, baseFiber: _bfi, ...approvedItem } = item;
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    setApproved((prev) => [...prev, approvedItem]);
  }, [drafts]);

  const removeDraft = useCallback((id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const removeApproved = useCallback((id: string) => {
    setApproved((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleEdit = useCallback((id: string) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, editing: !d.editing } : d))
    );
  }, []);

  const updateDraft = useCallback(
    (id: string, field: keyof FoodItem, value: string | number) => {
      setDrafts((prev) =>
        prev.map((d) => {
          if (d.id !== id) return d;

          // Quantity change: scale all macros proportionally
          if (field === "quantity" && typeof value === "number" && d.baseQuantity > 0) {
            const ratio = value / d.baseQuantity;
            return {
              ...d,
              quantity: value,
              calories: Math.round(d.baseCalories * ratio),
              protein: Math.round(d.baseProtein * ratio * 10) / 10,
              carbs: Math.round(d.baseCarbs * ratio * 10) / 10,
              fat: Math.round(d.baseFat * ratio * 10) / 10,
              fiber: Math.round(d.baseFiber * ratio * 10) / 10,
            };
          }

          // Direct macro edit: update the base so quantity scaling stays correct
          const macroBaseMap: Partial<Record<keyof FoodItem, keyof BaseMacros>> = {
            calories: "baseCalories",
            protein: "baseProtein",
            carbs: "baseCarbs",
            fat: "baseFat",
            fiber: "baseFiber",
          };
          const baseKey = macroBaseMap[field];
          if (baseKey && typeof value === "number" && d.quantity > 0) {
            return {
              ...d,
              [field]: value,
              [baseKey]: value * (d.baseQuantity / d.quantity),
            };
          }

          return { ...d, [field]: value };
        })
      );
    },
    []
  );

  const approveAll = useCallback(() => {
    const items: ApprovedItem[] = drafts.map(({ editing: _, baseQuantity: _bq, baseCalories: _bc, baseProtein: _bp, baseCarbs: _bca, baseFat: _bf, baseFiber: _bfi, ...rest }) => rest);
    setApproved((prev) => [...prev, ...items]);
    setDrafts([]);
  }, [drafts]);

  const handleItemEdit = useCallback(
    async (id: string) => {
      const message = editMessages[id]?.trim();
      if (!message || editLoading[id] || !apiKey.trim()) return;

      const item = drafts.find((d) => d.id === id);
      if (!item) return;

      setEditLoading((prev) => ({ ...prev, [id]: true }));
      setEditMessages((prev) => ({ ...prev, [id]: "" }));

      try {
        const { editing: _, id: _id, ...currentItem } = item;
        const res = await fetch("/food-math/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "edit",
            apiKey: apiKey.trim(),
            instruction: message,
            currentItem,
          }),
        });

        if (!res.ok) {
          console.error("Edit API error:", await res.json());
          return;
        }

        const data = await res.json();
        const updated: FoodItem = data.item;
        setDrafts((prev) =>
          prev.map((d) =>
            d.id === id
              ? {
                  ...d,
                  ...updated,
                  baseQuantity: updated.quantity,
                  baseCalories: updated.calories,
                  baseProtein: updated.protein,
                  baseCarbs: updated.carbs,
                  baseFat: updated.fat,
                  baseFiber: updated.fiber,
                }
              : d
          )
        );
      } catch (err) {
        console.error("Edit request failed:", err);
      } finally {
        setEditLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [editMessages, editLoading, apiKey, drafts]
  );

  // Totals
  const totals = approved.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
      fiber: acc.fiber + item.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  return (
    <div className={styles.layout}>
      {/* ─── Left: Editor Panel ─── */}
      <div className={styles.editorPanel}>
        {/* API key input */}
        <div className={styles.apiKeyBar}>
          <KeyIcon size={16} className={styles.apiKeyIcon} />
          <Input
            className={styles.inputField}
            type={showKey ? "text" : "password"}
            placeholder="Anthropic API key (sk-ant-...)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            autoComplete="off"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowKey((s) => !s)}
          >
            {showKey ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </Button>
        </div>

        {/* Input bar */}
        <form onSubmit={handleSubmit} className={styles.inputBar}>
          <Input
            ref={inputRef}
            className={styles.inputField}
            placeholder="What did you eat? (e.g. '2 eggs, toast with butter, coffee with cream')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim() || !apiKey.trim()} size="icon">
            {loading ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              <SendIcon />
            )}
          </Button>
        </form>

        {/* Loading state */}
        {loading && (
          <div className={styles.loadingState}>
            <LoaderIcon className="animate-spin" size={16} />
            <span>Parsing your food...</span>
          </div>
        )}

        {/* Draft items header */}
        {drafts.length > 0 && (
          <div className={styles.foodCardActions}>
            <Badge variant="secondary">{drafts.length} to review</Badge>
            <Button variant="outline" size="sm" onClick={approveAll}>
              <CheckIcon size={14} />
              Approve all
            </Button>
          </div>
        )}

        {/* Draft food cards */}
        {drafts.map((item) => (
          <div
            key={item.id}
            className={cn(
              styles.foodCard,
              item.editing && styles.foodCardEditing
            )}
          >
            <div className={styles.foodCardHeader}>
              <span className={styles.foodCardName}>{item.name}</span>
              <Badge
                variant="outline"
                className={cn(
                  item.confidence === "high" && styles.confidenceHigh,
                  item.confidence === "medium" && styles.confidenceMedium,
                  item.confidence === "low" && styles.confidenceLow
                )}
              >
                {item.confidence}
              </Badge>
            </div>

            <div className={styles.portionRow}>
              {item.editing ? (
                <>
                  <input
                    className={styles.editableField}
                    type="number"
                    step="0.1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateDraft(item.id, "quantity", parseFloat(e.target.value) || 0)
                    }
                  />
                  <input
                    className={cn(styles.editableField, "w-20")}
                    type="text"
                    value={item.unit}
                    onChange={(e) =>
                      updateDraft(item.id, "unit", e.target.value)
                    }
                  />
                </>
              ) : (
                <span>
                  {item.quantity} {item.unit}
                </span>
              )}
            </div>

            <div className={styles.macroGrid}>
              {(
                [
                  ["Cal", "calories"],
                  ["Protein", "protein"],
                  ["Carbs", "carbs"],
                  ["Fat", "fat"],
                  ["Fiber", "fiber"],
                ] as const
              ).map(([label, key]) => (
                <div key={key} className={styles.macroStat}>
                  <div className={styles.macroLabel}>{label}</div>
                  {item.editing ? (
                    <input
                      className={styles.editableField}
                      type="number"
                      step={key === "calories" ? 1 : 0.1}
                      value={item[key]}
                      onChange={(e) =>
                        updateDraft(
                          item.id,
                          key,
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  ) : (
                    <div className={styles.macroValue}>
                      {key === "calories"
                        ? item[key]
                        : `${item[key]}g`}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {item.notes && (
              <div className={styles.foodCardNotes}>{item.notes}</div>
            )}

            {/* AI edit bar */}
            {item.editing && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleItemEdit(item.id);
                }}
                className={styles.itemChatBar}
              >
                <SparklesIcon size={14} className={styles.itemChatIcon} />
                <input
                  className={styles.itemChatInput}
                  placeholder="e.g. 'actually 2 cookies, 40g each'"
                  value={editMessages[item.id] || ""}
                  onChange={(e) =>
                    setEditMessages((prev) => ({
                      ...prev,
                      [item.id]: e.target.value,
                    }))
                  }
                  disabled={editLoading[item.id]}
                  autoFocus
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className={styles.itemChatSend}
                  disabled={
                    editLoading[item.id] || !editMessages[item.id]?.trim()
                  }
                >
                  {editLoading[item.id] ? (
                    <LoaderIcon className="animate-spin" size={14} />
                  ) : (
                    <SendIcon size={14} />
                  )}
                </Button>
              </form>
            )}

            <div className={styles.foodCardActions}>
              <Button
                size="sm"
                variant="default"
                onClick={() => approveDraft(item.id)}
              >
                <CheckIcon size={14} />
                Approve
              </Button>
              <Button
                size="sm"
                variant={item.editing ? "secondary" : "outline"}
                onClick={() => toggleEdit(item.id)}
              >
                <PencilIcon size={14} />
                {item.editing ? "Done" : "Edit"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeDraft(item.id)}
              >
                <Trash2Icon size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Right: Totals Panel ─── */}
      <div className={styles.totalsPanel}>
        <div className={styles.totalsPanelInner}>
          {/* Totals card */}
          <div className={styles.totalsCard}>
            <div>
              <div className={styles.totalCalories}>{totals.calories}</div>
              <div className={styles.totalCaloriesLabel}>calories</div>
            </div>

            <Separator />

            <div className={styles.totalsMacroGrid}>
              {(
                [
                  ["Protein", totals.protein],
                  ["Carbs", totals.carbs],
                  ["Fat", totals.fat],
                  ["Fiber", totals.fiber],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className={styles.totalsMacroStat}>
                  <div className={styles.totalsMacroValue}>{value}g</div>
                  <div className={styles.totalsMacroLabel}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Approved items list */}
          {approved.length > 0 && (
            <div className={styles.totalsCard}>
              {approved.map((item) => (
                <div key={item.id} className={styles.approvedItem}>
                  <span className={styles.approvedItemName}>{item.name}</span>
                  <span className={styles.approvedItemCals}>
                    {item.calories} cal
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 shrink-0"
                    onClick={() => removeApproved(item.id)}
                  >
                    <Trash2Icon size={12} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
