/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useEditor,
  EditorContent,
  Editor,
  useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import {
  BoldIcon,
  CodeIcon,
  HighlighterIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  Quote,
  RedoIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UndoIcon,
  UnlinkIcon,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";
import { FloatingMenu as TiptapFloatingMenu } from "@tiptap/react/menus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import Underline from "@tiptap/extension-underline";

const ACTIVE_CLASS = "data-[state=on]:bg-yellow-400 data-[state=on]:text-black";

const HIGHLIGHT_COLORS = [
  "#fdeb80",
  "#ff9a9a",
  "#a8f0a8",
  "#a8d8f0",
  "#f0a8e0",
  "#f0c8a8",
  "#c8a8f0",
  "#ffffff",

  // new soft tones
  "#fff3b0",
  "#ffd6d6",
  "#d1fae5",
  "#e0f2fe",
  "#fce7f3",
  "#fef3c7",
  "#ede9fe",
  "#f1f5f9",

  "#fde68a",
  "#fecaca",
  "#bbf7d0",
  "#bae6fd",
  "#fbcfe8",
  "#fed7aa",
  "#ddd6fe",
  "#e5e7eb",

  "#fef9c3",
  "#ffe4e6",
  "#dcfce7",
  "#e0f7fa",
  "#f3e8ff",
  "#fff7ed",
  "#eef2ff",
  "#f8fafc",
];

const TEXT_COLORS = [
  "#000000",
  "#e03e3e",
  "#0b6e4f",
  "#0a5c8a",
  "#7c3aed",
  "#b45309",
  "#be185d",
  "#6b7280",

  "#111827",
  "#1f2937",
  "#374151",
  "#4b5563",

  "#dc2626",
  "#059669",
  "#2563eb",
  "#9333ea",
  "#ea580c",
  "#db2777",
  "#0891b2",
  "#16a34a",

  "#475569",
  "#64748b",
  "#334155",
  "#52525b",

  "#0f172a",
  "#1e293b",
  "#3f3f46",
  "#44403c",
];

import { Extension } from "@tiptap/core";

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize || null,
            renderHTML: (attrs) => {
              if (!attrs.fontSize) return {};
              return { style: `font-size: ${attrs.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: any) =>
          chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }: any) =>
          chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run(),
    } as any;
  },
});

const ProductEditor = ({
  content,
  onChange,
}: {
  content?: string;
  onChange?: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      Underline,
      TextStyle,
      Color,
      FontSize,
    ],
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base focus:outline-none max-w-none",
      },
    },
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  return (
    <div className="bg-background relative rounded-lg border shadow-sm">
      {editor && (
        <>
          <ToolBar editor={editor} />
          <BubbleMenu editor={editor} />
          <FloatingMenu editor={editor} />
        </>
      )}
      <div
        className="min-h-75 px-4 py-3 cursor-text"
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default ProductEditor;

function ColorPicker({
  label,
  colors,
  currentColor,
  onSelect,
  onClear,
}: {
  label: ReactNode;
  colors: string[];
  currentColor?: string;
  onSelect: (color: string) => void;
  onClear: () => void;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <button
          type="button"
          className="flex items-center gap-1 rounded px-1.5 py-1 text-sm hover:bg-muted border h-8"
        >
          {label}
          {currentColor && (
            <span
              className="inline-block w-3 h-3 rounded-full border ml-1"
              style={{ backgroundColor: currentColor }}
            />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-3">
        <div className="grid grid-cols-4 gap-2 mb-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
              style={{
                backgroundColor: color,
                borderColor: currentColor === color ? "#000" : "#e5e7eb",
              }}
              onClick={() => onSelect(color)}
            />
          ))}
        </div>
        {/* Custom color input */}
        <div className="flex gap-1 items-center mt-1">
          <input
            type="color"
            className="w-8 h-8 rounded cursor-pointer border"
            value={currentColor || "#000000"}
            onChange={(e) => onSelect(e.target.value)}
          />
          <span className="text-xs text-muted-foreground">Custom</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-xs"
          onClick={onClear}
        >
          Clear
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function FontSizeControl({ editor }: { editor: Editor }) {
  const [size, setSize] = useState("16");

  const applySize = (val: string) => {
    const num = parseInt(val);
    if (!isNaN(num) && num > 0) {
      (editor.chain().focus() as any).setFontSize(`${num}px`).run();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        className="w-6 h-8 flex items-center justify-center rounded hover:bg-muted border text-sm font-bold"
        onClick={() => {
          const newSize = Math.max(8, parseInt(size) - 1).toString();
          setSize(newSize);
          applySize(newSize);
        }}
      >
        −
      </button>
      <input
        type="number"
        min={8}
        max={96}
        value={size}
        onChange={(e) => setSize(e.target.value)}
        onBlur={(e) => applySize(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") applySize(size);
        }}
        className="w-12 h-8 text-center text-sm border rounded focus:outline-none focus:ring-1 focus:ring-yellow-400 bg-background"
      />
      <button
        type="button"
        className="w-6 h-8 flex items-center justify-center rounded hover:bg-muted border text-sm font-bold"
        onClick={() => {
          const newSize = Math.min(96, parseInt(size) + 1).toString();
          setSize(newSize);
          applySize(newSize);
        }}
      >
        +
      </button>
    </div>
  );
}

function LinkComponent({
  editor,
  children,
}: {
  editor: Editor;
  children: ReactNode;
}) {
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  const handleSetLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setIsLinkPopoverOpen(false);
    setLinkUrl("");
  };

  return (
    <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="flex flex-col gap-4">
          <h3 className="font-medium">Insert Link</h3>
          <Input
            placeholder="https://example.com"
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSetLink();
            }}
          />
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsLinkPopoverOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSetLink}>Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const ToolBar = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold") ?? false,
      isItalic: ctx.editor.isActive("italic") ?? false,
      iamThapa: ctx.editor.isActive("underline") ?? false,
      isStrike: ctx.editor.isActive("strike") ?? false,
      isCode: ctx.editor.isActive("code") ?? false,
      isHighlight: ctx.editor.isActive("highlight") ?? false,
      isBulletList: ctx.editor.isActive("bulletList") ?? false,
      isOrderedList: ctx.editor.isActive("orderedList") ?? false,
      isBlockquote: ctx.editor.isActive("blockquote") ?? false,
      isLink: ctx.editor.isActive("link") ?? false,
      canRedo: editor.can().redo(),
      canUndo: editor.can().undo(),
      isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
      isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
      isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
      isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
      isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
      currentColor: ctx.editor.getAttributes("textStyle").color,
      currentHighlight: ctx.editor.getAttributes("highlight").color,
    }),
  });

  const handleHeadingChange = (value: string) => {
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = Number.parseInt(value.replace("heading", "")) as
        | 1
        | 2
        | 3
        | 4
        | 5;
      editor.chain().focus().setHeading({ level }).run();
    }
  };

  return (
    <div className="bg-background sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b p-2">
      {/* Heading Select */}
      <Select
        onValueChange={(value) => handleHeadingChange(value ?? "")}
        value={
          editorState.isHeading2
            ? "heading2"
            : editorState.isHeading3
              ? "heading3"
              : editorState.isHeading4
                ? "heading4"
                : editorState.isHeading5
                  ? "heading5"
                  : editorState.isHeading6
                    ? "heading6"
                    : "paragraph"
        }
      >
        <SelectTrigger className="w-35">
          <SelectValue placeholder="Paragraph" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Paragraph</SelectItem>
          <SelectItem value="heading2">Heading 1</SelectItem>
          <SelectItem value="heading3">Heading 2</SelectItem>
          <SelectItem value="heading4">Heading 3</SelectItem>
          <SelectItem value="heading5">Heading 4</SelectItem>
          <SelectItem value="heading6">Heading 5</SelectItem>
        </SelectContent>
      </Select>

      {/* Font Size */}
      <FontSizeControl editor={editor} />

      <div className="bg-border mx-1 h-6 w-px" />

      {/* Text Color */}
      <ColorPicker
        label={
          <span
            className="text-xs font-bold"
            style={{ color: editorState.currentColor || "#000" }}
          >
            A
          </span>
        }
        colors={TEXT_COLORS}
        currentColor={editorState.currentColor}
        onSelect={(color) => editor.chain().focus().setColor(color).run()}
        onClear={() => editor.chain().focus().unsetColor().run()}
      />

      {/* Highlight Color */}
      <ColorPicker
        label={<HighlighterIcon className="h-4 w-4" />}
        colors={HIGHLIGHT_COLORS}
        currentColor={editorState.currentHighlight}
        onSelect={(color) =>
          editor.chain().focus().toggleHighlight({ color }).run()
        }
        onClear={() => editor.chain().focus().unsetHighlight().run()}
      />

      <div className="bg-border mx-1 h-6 w-px" />

      <Toggle
        size="sm"
        pressed={editorState.isBold}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Toggle bold"
        className={ACTIVE_CLASS}
      >
        <BoldIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isItalic}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Toggle italic"
        className={ACTIVE_CLASS}
      >
        <ItalicIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.iamThapa}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        aria-label="Toggle underline"
        className={ACTIVE_CLASS}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isStrike}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Toggle strikethrough"
        className={ACTIVE_CLASS}
      >
        <StrikethroughIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isCode}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        aria-label="Toggle code"
        className={ACTIVE_CLASS}
      >
        <CodeIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isBulletList}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Toggle bullet list"
        className={ACTIVE_CLASS}
      >
        <ListIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isOrderedList}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Toggle ordered list"
        className={ACTIVE_CLASS}
      >
        <ListOrderedIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isBlockquote}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Toggle blockquote"
        className={ACTIVE_CLASS}
      >
        <Quote className="h-4 w-4" />
      </Toggle>

      <div className="bg-border mx-1 h-6 w-px" />

      {editorState.isLink ? (
        <Toggle
          pressed
          onPressedChange={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
          className={ACTIVE_CLASS}
        >
          <UnlinkIcon className="h-4 w-4" />
        </Toggle>
      ) : (
        <LinkComponent editor={editor}>
          <Toggle size="sm" aria-label="Toggle link" className={ACTIVE_CLASS}>
            <LinkIcon className="h-4 w-4" />
          </Toggle>
        </LinkComponent>
      )}

      <div className="bg-border mx-1 h-6 w-px" />

      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editorState.canUndo}
        aria-label="Undo"
      >
        <UndoIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editorState.canRedo}
        aria-label="Redo"
      >
        <RedoIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export function BubbleMenu({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold") ?? false,
      isItalic: ctx.editor.isActive("italic") ?? false,
      isUnderline: ctx.editor.isActive("underline") ?? false,
      isHighlight: ctx.editor.isActive("highlight") ?? false,
      isStrike: ctx.editor.isActive("strike") ?? false,
      isCode: ctx.editor.isActive("code") ?? false,
      isBulletList: ctx.editor.isActive("bulletList") ?? false,
      isOrderedList: ctx.editor.isActive("orderedList") ?? false,
      isBlockquote: ctx.editor.isActive("blockquote") ?? false,
      isLink: ctx.editor.isActive("link") ?? false,
      currentColor: ctx.editor.getAttributes("textStyle").color,
      currentHighlight: ctx.editor.getAttributes("highlight").color,
    }),
  });

  return (
    <TiptapBubbleMenu
      editor={editor}
      className="bg-background flex items-center rounded-md border shadow-md relative z-200 p-1 gap-0.5"
    >
      <FontSizeControl editor={editor} />
      <div className="bg-border mx-1 h-6 w-px" />
      <ColorPicker
        label={
          <span
            className="text-xs font-bold"
            style={{ color: editorState.currentColor || "#000" }}
          >
            A
          </span>
        }
        colors={TEXT_COLORS}
        currentColor={editorState.currentColor}
        onSelect={(color) => editor.chain().focus().setColor(color).run()}
        onClear={() => editor.chain().focus().unsetColor().run()}
      />
      <ColorPicker
        label={<HighlighterIcon className="h-4 w-4" />}
        colors={HIGHLIGHT_COLORS}
        currentColor={editorState.currentHighlight}
        onSelect={(color) =>
          editor.chain().focus().toggleHighlight({ color }).run()
        }
        onClear={() => editor.chain().focus().unsetHighlight().run()}
      />
      <div className="bg-border mx-1 h-6 w-px" />
      <Toggle
        size="sm"
        pressed={editorState.isBold}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        className={ACTIVE_CLASS}
      >
        <BoldIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isItalic}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        className={ACTIVE_CLASS}
      >
        <ItalicIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isUnderline}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        className={ACTIVE_CLASS}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isStrike}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        className={ACTIVE_CLASS}
      >
        <StrikethroughIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isCode}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        className={ACTIVE_CLASS}
      >
        <CodeIcon className="h-4 w-4" />
      </Toggle>
      <div className="bg-border mx-1 h-6 w-px" />
      <Toggle
        size="sm"
        pressed={editorState.isBulletList}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        className={ACTIVE_CLASS}
      >
        <ListIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isOrderedList}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        className={ACTIVE_CLASS}
      >
        <ListOrderedIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isBlockquote}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        className={ACTIVE_CLASS}
      >
        <Quote className="h-4 w-4" />
      </Toggle>
      <div className="bg-border mx-1 h-6 w-px" />
      {editorState.isLink ? (
        <Toggle
          pressed
          onPressedChange={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
          className={ACTIVE_CLASS}
        >
          <UnlinkIcon className="h-4 w-4" />
        </Toggle>
      ) : (
        <LinkComponent editor={editor}>
          <Toggle size="sm" className={ACTIVE_CLASS}>
            <LinkIcon className="h-4 w-4" />
          </Toggle>
        </LinkComponent>
      )}
    </TiptapBubbleMenu>
  );
}

export function FloatingMenu({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold") ?? false,
      isItalic: ctx.editor.isActive("italic") ?? false,
      isUnderline: ctx.editor.isActive("underline") ?? false,
      isHighlight: ctx.editor.isActive("highlight") ?? false,
      isStrike: ctx.editor.isActive("strike") ?? false,
      isCode: ctx.editor.isActive("code") ?? false,
      isBulletList: ctx.editor.isActive("bulletList") ?? false,
      isOrderedList: ctx.editor.isActive("orderedList") ?? false,
      isBlockquote: ctx.editor.isActive("blockquote") ?? false,
      isLink: ctx.editor.isActive("link") ?? false,
      currentColor: ctx.editor.getAttributes("textStyle").color,
      currentHighlight: ctx.editor.getAttributes("highlight").color,
    }),
  });

  return (
    <TiptapFloatingMenu
      editor={editor}
      className="bg-background flex items-center rounded-md border shadow-md relative z-200 p-1 gap-0.5"
    >
      <ColorPicker
        label={
          <span
            className="text-xs font-bold"
            style={{ color: editorState.currentColor || "#000" }}
          >
            A
          </span>
        }
        colors={TEXT_COLORS}
        currentColor={editorState.currentColor}
        onSelect={(color) => editor.chain().focus().setColor(color).run()}
        onClear={() => editor.chain().focus().unsetColor().run()}
      />
      <ColorPicker
        label={<HighlighterIcon className="h-4 w-4" />}
        colors={HIGHLIGHT_COLORS}
        currentColor={editorState.currentHighlight}
        onSelect={(color) =>
          editor.chain().focus().toggleHighlight({ color }).run()
        }
        onClear={() => editor.chain().focus().unsetHighlight().run()}
      />
      <div className="bg-border mx-1 h-6 w-px" />
      <Toggle
        size="sm"
        pressed={editorState.isBold}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        className={ACTIVE_CLASS}
      >
        <BoldIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isItalic}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        className={ACTIVE_CLASS}
      >
        <ItalicIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isUnderline}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        className={ACTIVE_CLASS}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isStrike}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        className={ACTIVE_CLASS}
      >
        <StrikethroughIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isCode}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        className={ACTIVE_CLASS}
      >
        <CodeIcon className="h-4 w-4" />
      </Toggle>
      <div className="bg-border mx-1 h-6 w-px" />
      <Toggle
        size="sm"
        pressed={editorState.isBulletList}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        className={ACTIVE_CLASS}
      >
        <ListIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isOrderedList}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        className={ACTIVE_CLASS}
      >
        <ListOrderedIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editorState.isBlockquote}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        className={ACTIVE_CLASS}
      >
        <Quote className="h-4 w-4" />
      </Toggle>
      <div className="bg-border mx-1 h-6 w-px" />
      {editorState.isLink ? (
        <Toggle
          pressed
          onPressedChange={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
          className={ACTIVE_CLASS}
        >
          <UnlinkIcon className="h-4 w-4" />
        </Toggle>
      ) : (
        <LinkComponent editor={editor}>
          <Toggle size="sm" className={ACTIVE_CLASS}>
            <LinkIcon className="h-4 w-4" />
          </Toggle>
        </LinkComponent>
      )}
    </TiptapFloatingMenu>
  );
}
