import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Table as TableIcon,
  Palette,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Undo,
  Redo,
  Type,
  FileText,
  Download,
  Save
} from 'lucide-react';

interface ProposalEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  onExportPDF?: () => void;
}

export function ProposalEditor({ content = '', onChange, onSave, onExportPDF }: ProposalEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-sm',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 w-full my-4',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 bg-gray-50 font-semibold p-2',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      TextStyle,
      FontFamily,
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-200 px-1 rounded',
        },
      }),
      Underline,
      Subscript,
      Superscript,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-none p-6 min-h-[400px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        editor.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const colors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB',
    '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6',
    '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4'
  ];

  const fontFamilies = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
    { label: 'Times New Roman', value: 'Times New Roman, serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Courier New', value: 'Courier New, monospace' },
  ];

  return (
    <div className="border rounded-lg bg-white dark:bg-gray-900 shadow-sm">
      {/* Toolbar */}
      <div className="border-b p-4 space-y-4">
        {/* Primeira linha de botões */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="w-4 h-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Select onValueChange={(value) => editor.chain().focus().setFontFamily(value).run()}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Fonte" />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={editor.isActive('bold') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant={editor.isActive('italic') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant={editor.isActive('underline') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="w-4 h-4" />
          </Button>
          <Button
            variant={editor.isActive('strike') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button
            variant={editor.isActive('highlight') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            <Highlighter className="w-4 h-4" />
          </Button>
          <Button
            variant={editor.isActive('subscript') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
          >
            <SubscriptIcon className="w-4 h-4" />
          </Button>
          <Button
            variant={editor.isActive('superscript') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
          >
            <SuperscriptIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Segunda linha de botões */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight className="w-4 h-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          >
            <AlignJustify className="w-4 h-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button
            variant={editor.isActive('bulletList') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={editor.isActive('orderedList') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLinkDialog(!showLinkDialog)}
          >
            <LinkIcon className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          >
            <TableIcon className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <Palette className="w-4 h-4" />
          </Button>
        </div>

        {/* Seletor de cores */}
        {showColorPicker && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-medium mb-2">Cor do texto:</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Dialog de link */}
        {showLinkDialog && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-medium mb-2">Adicionar link:</p>
            <div className="flex gap-2">
              <Input
                placeholder="https://exemplo.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddLink}>
                Adicionar
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowLinkDialog(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onSave?.(editor.getHTML())}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button variant="outline" size="sm" onClick={onExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            {editor.storage.characterCount?.characters() || 0} caracteres
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}