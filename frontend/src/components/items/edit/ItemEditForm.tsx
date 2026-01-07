"use client";

import React from "react";
import Card from "@/components/ui/Card";
import type { Category, Condition, ListingStatus, TradeMethod } from "@/types/item";

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function ItemEditForm(props: {
  title: string;
  setTitle: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;

  category: Category;
  setCategory: (v: Category) => void;
  condition: Condition;
  setCondition: (v: Condition) => void;
  tradeMethod: TradeMethod;
  setTradeMethod: (v: TradeMethod) => void;
  location: string;
  setLocation: (v: string) => void;

  tagsInput: string;
  setTagsInput: (v: string) => void;
  tags: string[];

  quantity: number;
  setQuantity: (v: number) => void;
  negotiable: boolean;
  setNegotiable: (v: boolean) => void;
  status: ListingStatus;
  setStatus: (v: ListingStatus) => void;
}) {
  const inputBase =
    "mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700";
  const selectBase =
    "mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700";

  return (
    <div className="space-y-5">
      <Card title="Basic info">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              value={props.title}
              onChange={(e) => props.setTitle(e.target.value)}
              placeholder='e.g. "Wireless mouse - good condition"'
              className={inputBase}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Price</label>
              <input
                value={props.price}
                onChange={(e) => props.setPrice(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 12.50"
                className={inputBase}
              />
              <div className="mt-1 text-xs text-gray-500">
                Enter a number with up to 2 decimals.
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Quantity</label>
              <input
                value={props.quantity}
                onChange={(e) => props.setQuantity(Number(e.target.value))}
                type="number"
                min={1}
                className={inputBase}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={props.description}
              onChange={(e) => props.setDescription(e.target.value)}
              rows={5}
              placeholder="Condition, flaws, reason for selling..."
              className={cx(inputBase, "resize-none")}
            />
          </div>
        </div>
      </Card>

      <Card title="Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              value={props.category}
              onChange={(e) => props.setCategory(e.target.value as Category)}
              className={selectBase}
            >
              <option value="Clothing">Clothing</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Books">Books</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Condition</label>
            <select
              value={props.condition}
              onChange={(e) => props.setCondition(e.target.value as Condition)}
              className={selectBase}
            >
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="For parts">For parts</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Trade method</label>
            <select
              value={props.tradeMethod}
              onChange={(e) => props.setTradeMethod(e.target.value as TradeMethod)}
              className={selectBase}
            >
              <option value="Pickup">Pickup</option>
              <option value="Meetup">Meetup</option>
              <option value="Shipping">Shipping</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Location</label>
            <input
              value={props.location}
              onChange={(e) => props.setLocation(e.target.value)}
              placeholder="e.g. OSU campus"
              className={inputBase}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Tags</label>
            <input
              value={props.tagsInput}
              onChange={(e) => props.setTagsInput(e.target.value)}
              placeholder="e.g. wireless, mouse, bluetooth"
              className={inputBase}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {props.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs rounded-full px-2 py-1 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300"
                >
                  #{t}
                </span>
              ))}
              {!props.tags.length && <span className="text-xs text-gray-500">No tags</span>}
            </div>
          </div>

          <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div>
              <div className="text-sm font-medium">Negotiable</div>
              <div className="text-xs text-gray-500">Allow offers / bargaining</div>
            </div>
            <button
              type="button"
              onClick={() => props.setNegotiable(!props.negotiable)}
              className={cx(
                "relative flex items-center h-8 w-14 rounded-full border p-1 transition",
                props.negotiable
                  ? "bg-emerald-500 border-emerald-500 dark:bg-emerald-600 dark:border-emerald-600"
                  : "bg-gray-200 border-gray-300 dark:bg-gray-800 dark:border-gray-700"
              )}
              aria-label="toggle negotiable"
            >
              <span
                className={cx(
                  "block h-6 w-6 rounded-full bg-white transition",
                  props.negotiable ? "translate-x-6" : "translate-x-0"
                )}
              />
            </button>
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Status</label>
            <select
              value={props.status}
              onChange={(e) => props.setStatus(e.target.value as ListingStatus)}
              className={selectBase}
            >
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Sold">Sold</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}
