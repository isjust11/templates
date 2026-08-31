'use client';

import React, { useState } from 'react';
import { useTemplateDataContext } from './TemplateDataProvider';

interface InlineSlotEditorProps {
  slotKey: string;
  label?: string;
  value: string;
  type?: 'text' | 'textarea' | 'image' | 'date';
  onChange?: (newValue: string) => void;
  children: React.ReactNode;
}

export default function InlineSlotEditor({
  slotKey,
  label,
  value,
  type = 'text',
  onChange,
  children,
}: InlineSlotEditorProps) {
  const { isEditing, onFieldChange, onUploadImage } = useTemplateDataContext();
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');
  const [uploading, setUploading] = useState(false);

  if (!isEditing) {
    return <>{children}</>;
  }

  const handleSave = () => {
    if (onChange) {
      onChange(tempValue);
    } else if (onFieldChange) {
      onFieldChange(slotKey as any, tempValue);
    }
    setIsOpen(false);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      let imageUrl = '';
      if (onUploadImage) {
        imageUrl = await onUploadImage(file);
      } else {
        imageUrl = URL.createObjectURL(file);
      }

      if (onChange) {
        onChange(imageUrl);
      } else if (onFieldChange) {
        onFieldChange(slotKey as any, imageUrl);
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group/slot inline-block max-w-full">
      <div className="group-hover/slot:ring-2 group-hover/slot:ring-sage-500/70 group-hover/slot:bg-sage-50/50 rounded-lg p-1 transition-all">
        {children}
      </div>

      <div className="absolute -top-3 -right-3 opacity-0 group-hover/slot:opacity-100 transition-opacity z-40">
        {type === 'image' ? (
          <label className="cursor-pointer flex items-center gap-1 bg-sage-800 text-cream-50 hover:bg-sage-900 shadow-md rounded-full px-3 py-1 text-xs font-sans font-medium">
            <span>{uploading ? '⏳ Đang tải...' : '📷 Thay ảnh'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
              disabled={uploading}
            />
          </label>
        ) : (
          <button
            type="button"
            onClick={() => {
              setTempValue(value || '');
              setIsOpen(true);
            }}
            className="flex items-center gap-1 bg-sage-800 text-cream-50 hover:bg-sage-900 shadow-md rounded-full px-3 py-1 text-xs font-sans font-medium"
          >
            <span>✏️ {label || 'Sửa'}</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full border border-stone-200 text-left font-sans animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-stone-800">
                Tuỳ chỉnh: <span className="text-sage-700">{label || slotKey}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-xl font-bold leading-none"
              >
                &times;
              </button>
            </div>

            {type === 'textarea' ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                rows={4}
                className="w-full border border-stone-300 rounded-xl p-3 text-stone-800 text-sm focus:ring-2 focus:ring-sage-500 focus:outline-none mb-4"
              />
            ) : type === 'date' ? (
              <input
                type="datetime-local"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full border border-stone-300 rounded-xl p-3 text-stone-800 text-sm focus:ring-2 focus:ring-sage-500 focus:outline-none mb-4"
              />
            ) : (
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full border border-stone-300 rounded-xl p-3 text-stone-800 text-sm focus:ring-2 focus:ring-sage-500 focus:outline-none mb-4"
              />
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-sm font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 bg-sage-800 hover:bg-sage-900 text-white rounded-xl text-sm font-medium shadow transition-colors"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
