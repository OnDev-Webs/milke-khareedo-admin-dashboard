"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Bold, Italic, Underline, List, ListOrdered, Quote, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import upload from "@/assets/upload.svg";
import { Blog } from "@/lib/features/blogs/blogSlice";

interface BlogFormProps {
  blog?: Blog | null;
  onSubmit: (data: FormData) => void;
  isSubmitting?: boolean;
  readOnly?: boolean;
}

export default function BlogForm({ blog, onSubmit, isSubmitting = false, readOnly = false }: BlogFormProps) {
  const [title, setTitle] = useState(blog?.title || "");
  const [tags, setTags] = useState<string[]>(blog?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState(blog?.content || "");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(blog?.bannerImage || null);
  const [isPublished, setIsPublished] = useState(blog?.isPublished ?? true);

  const contentRef = useRef<HTMLDivElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setTags(blog.tags || []);
      setContent(blog.content || "");
      setBannerPreview(blog.bannerImage || null);
      setIsPublished((blog as any).isPublished ?? true);
    }
  }, [blog]);

  // Update contentEditable div when blog changes externally
  useEffect(() => {
    if (blog && contentRef.current && !readOnly) {
      const blogContent = blog.content || '';
      contentRef.current.innerHTML = blogContent;
      setContent(blogContent);
    }
  }, [blog, readOnly]);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(file);
      const preview = URL.createObjectURL(file);
      setBannerPreview(preview);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const removeBanner = () => {
    setBannerImage(null);
    setBannerPreview(null);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const formatText = (format: string) => {
    const editor = contentRef.current;
    if (!editor || readOnly) return;

    editor.focus();

    try {
      switch (format) {
        case "bold":
          document.execCommand('bold', false);
          break;
        case "italic":
          document.execCommand('italic', false);
          break;
        case "underline":
          document.execCommand('underline', false);
          break;
        case "h1":
          document.execCommand('formatBlock', false, '<h1>');
          break;
        case "h2":
          document.execCommand('formatBlock', false, '<h2>');
          break;
        case "h3":
          document.execCommand('formatBlock', false, '<h3>');
          break;
        case "p":
          document.execCommand('formatBlock', false, '<p>');
          break;
        case "quote":
          document.execCommand('formatBlock', false, '<blockquote>');
          break;
        case "ul":
          document.execCommand('insertUnorderedList', false);
          break;
        case "ol":
          document.execCommand('insertOrderedList', false);
          break;
        case "link":
          const url = prompt('Enter URL:');
          if (url) {
            document.execCommand('createLink', false, url);
          }
          break;
        case "clear":
          editor.innerHTML = '';
          setContent('');
          return;
      }

      // Update content state after formatting
      handleContentChange();
    } catch (error) {
      console.error('Formatting error:', error);
    }
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      const htmlContent = contentRef.current.innerHTML;
      setContent(htmlContent);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    // Ensure content is updated from editor
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }

    const formData = new FormData();
    formData.append("title", title);
    // Use the latest content from the editor
    const finalContent = contentRef.current?.innerHTML || content;
    formData.append("content", finalContent);
    formData.append("isPublished", isPublished.toString());

    // Append tags as array - format: tags[] for each tag
    tags.forEach((tag) => {
      // Remove # if present before sending
      const cleanTag = tag.startsWith("#") ? tag.slice(1) : tag;
      formData.append("tags", cleanTag);
    });

    if (bannerImage) {
      formData.append("bannerImage", bannerImage);
    }

    onSubmit(formData);
  };

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Left Column - Posting Guide */}
      <aside className="col-span-12 lg:col-span-3 border-r bg-white">
        <div className="h-[92vh] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-semibold text-gray-900">
                Posting guide
              </h3>

              <Image
                src="/images/tips_and_updates.png"
                alt="Guide"
                width={18}
                height={18}
                className="opacity-70"
              />
            </div>


            <ul className="space-y-2 text-xs text-gray-600 pe-20">
              <li>• Write a clear Title and optional Subtitle</li>
              <li>• Select a Category; use Refresh to sync latest categories.</li>
              <li>• Add Tags: type a tag and press Enter; click x to remove.</li>
              <li>• Upload a Banner and optional gallery images. Use x to remove  any preview.</li>
              <li>• Use the editor on the right  to format content (H2/H3, Lists, Quotes, Links).</li>
              <li>• Click show Preview to review before publishing.</li>
            </ul>
          </div>

          {!readOnly && (
            <div className="flex items-center justify-center gap-3 border-t pt-4">
              <button
                type="submit"
                form="blog-form"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg
                 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          )}

        </div>
      </aside>

      {/* Right Column - Form */}
      <section className="col-span-12 lg:col-span-9">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Banner Upload */}
            <div className="col-span-12 md:col-span-5">
              <div>
                <div
                  onClick={() => !readOnly && bannerInputRef.current?.click()}
                  className={`w-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-10 py-8 text-center transition-colors ${readOnly ? "" : "cursor-pointer hover:bg-gray-100"
                    }`}
                >
                  {bannerPreview ? (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                      />
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBanner();
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-sm font-medium text-gray-700">
                        Upload Photo{" "}
                        <span className="font-semibold text-blue-600 underline cursor-pointer">
                          browse
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Max 10 MB files are allowed
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerUpload}
                />
              </div>
            </div>

            <div className="col-span-12 md:col-span-7 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  readOnly={readOnly}
                  disabled={readOnly}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Type a tag and press enter"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  readOnly={readOnly}
                  disabled={readOnly}
                />
                {tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#F4F8FF] text-[#000000] rounded-md text-sm"
                      >
                        {tag.startsWith("#") ? tag : `#${tag}`}
                        {!readOnly && (
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-600"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>


          {/* Rich Text Editor Toolbar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content<span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden relative">
              {/* Toolbar */}
              {!readOnly && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 border-b border-gray-300 flex-wrap">
                  <button
                    type="button"
                    onClick={() => formatText("bold")}
                    className="py-2 px-4 bg-[#F8FBFF] rounded"
                    title="Bold"
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText("italic")}
                    className="py-2 px-4 bg-[#F8FBFF] rounded"
                    title="Italic"
                  >
                    <Italic size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText("underline")}
                    className="py-2 px-4 bg-[#F8FBFF] rounded"
                    title="Underline"
                  >
                    <Underline size={16} />
                  </button>
                  <div className="w-px h-6 bg-gray-300" />
                  <button
                    type="button"
                    onClick={() => formatText("ul")}
                    className="py-2 px-4 bg-[#F8FBFF] rounded"
                    title="Bullet List"
                  >
                    <List size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText("ol")}
                    className="py-2 px-4 bg-[#F8FBFF] rounded"
                    title="Numbered List"
                  >
                    <ListOrdered size={16} />
                  </button>
                  <div className="w-px h-6 bg-gray-300" />
                  <button
                    type="button"
                    onClick={() => formatText("h1")}
                    className="text-xs py-2 px-4 bg-[#F8FBFF] rounded"
                  >
                    H1
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText("h2")}
                    className="text-xs py-2 px-4 bg-[#F8FBFF] rounded"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText("h3")}
                    className="text-xs py-2 px-4 bg-[#F8FBFF] rounded"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText("p")}
                    className="text-xs py-2 px-4 bg-[#F8FBFF] rounded"
                  >
                    P
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText("quote")}
                    className="text-xs py-2 px-4 bg-[#F8FBFF] rounded"
                    title="Quote"
                  >
                    <Quote size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText("link")}
                    className="text-xs py-2 px-4 bg-[#F8FBFF] rounded"
                    title="Link"
                  >
                    <LinkIcon size={16} />
                  </button>
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={() => formatText("clear")}
                    className="px-3 py-1 text-sm bg-[#FF765E] text-white rounded-full hover:bg-red-600"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Content Editor */}
              {readOnly ? (
                <div
                  className="w-full px-4 py-3 min-h-[400px] blog-content-view"
                  style={{
                    minHeight: '400px',
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <div
                  ref={contentRef}
                  contentEditable={true}
                  onInput={handleContentChange}
                  onBlur={handleContentChange}
                  suppressContentEditableWarning
                  data-placeholder="Write your blog content here..."
                  className="w-full px-4 py-3 min-h-[400px] focus:outline-none overflow-y-auto blog-content-editor"
                  style={{
                    minHeight: '400px',
                    outline: 'none',
                  }}
                />
              )}
            </div>
          </div>
        </form>
      </section>
    </div >
  );
}

