import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Eraser, Check, Type, Image as ImageIcon, Link2,
  Bold, Italic, Trash2, BringToFront, SendToBack, X, Move,
  ChevronUp, ChevronDown
} from 'lucide-react';
import { DndContext, useDraggable, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import * as Dialog from '@radix-ui/react-dialog';
import { Snowfall } from 'react-snowfall';
import './DateCustomizationPage.css';

function DraggableText({ id, content, position, style, isSelected, onSelect, onUpdate }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const dragStyle = {
    transform: CSS.Translate.toString(transform),
    left: position.x,
    top: position.y,
    position: 'absolute',
    cursor: 'move',
    zIndex: isSelected ? 1000 : 1, // Bring to front when dragging/selected
    ...style, // Apply custom styles (color, font, etc.)
  };

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      {...listeners}
      {...attributes}
      className={`draggable-text ${isSelected ? 'selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      <input
        type="text"
        value={content}
        onChange={(e) => onUpdate(id, { content: e.target.value })}
        className="text-input"
        style={{
          color: style.color,
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight,
          fontStyle: style.fontStyle,
        }}
        onPointerDown={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function DraggableImage({ id, src, position, size, isSelected, onSelect, onUpdate }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const [isResizing, setIsResizing] = useState(false);

  const dragStyle = {
    transform: CSS.Translate.toString(transform),
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    position: 'absolute',
    cursor: 'move',
    zIndex: isSelected ? 1000 : 1,
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      onUpdate(id, {
        width: Math.max(50, startWidth + deltaX),
        height: Math.max(50, startHeight + deltaY),
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      {...listeners}
      {...attributes}
      className={`draggable-image ${isSelected ? 'selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      <img src={src} alt="Custom" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      {isSelected && (
        <div
          className="resize-handle"
          onPointerDown={handleResizeStart}
        />
      )}
    </div>
  );
}

function DraggableLink({ id, content, url, position, size, style, isSelected, onSelect, onUpdate }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const [isResizing, setIsResizing] = useState(false);

  const dragStyle = {
    transform: CSS.Translate.toString(transform),
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    position: 'absolute',
    cursor: 'move',
    zIndex: isSelected ? 1000 : 1,
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      onUpdate(id, {
        width: Math.max(100, startWidth + deltaX),
        height: Math.max(40, startHeight + deltaY),
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      {...listeners}
      {...attributes}
      className={`draggable-link ${isSelected ? 'selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="link-button"
        style={{
          backgroundColor: style.backgroundColor || '#000000',
          color: style.color || '#ffffff',
          fontFamily: style.fontFamily,
          fontSize: '1rem',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          borderRadius: '8px',
          pointerEvents: 'none', // Disable link click while editing
        }}
      >
        {content}
      </a>
      {isSelected && (
        <div
          className="resize-handle"
          onPointerDown={handleResizeStart}
        />
      )}
    </div>
  );
}

function TextToolbar({ item, onUpdate, onBringToFront, onSendToBack, onDelete, onClose }) {
  if (!item) return null;

  return (
    <div
      className="text-toolbar"
      style={{ left: item.x, top: item.y - 60 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="toolbar-group">
        <select
          value={item.fontFamily || 'Arial'}
          onChange={(e) => onUpdate(item.id, { fontFamily: e.target.value })}
          className="font-select"
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times</option>
          <option value="Courier New">Courier</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
          <option value="Work Sans">Work Sans</option>
          <option value="Space Mono">Space Mono</option>
          <option value="Silkscreen">Silkscreen</option>
          <option value="Noto Serif Display">Noto Serif Display</option>
          <option value="Gotu">Gotu</option>
          <option value="Miniver">Miniver</option>
          <option value="Barrio">Barrio</option>
          <option value="Pinyon Script">Pinyon Script</option>
          <option value="Lora">Lora</option>
          <option value="Libre Baskerville">Libre Baskerville</option>
          <option value="Borel">Borel</option>
          <option value="Funnel Display">Funnel Display</option>
          <option value="VT323">VT323</option>
        </select>

        <div className="color-picker-mini">
          <input
            type="color"
            value={item.color || '#000000'}
            onChange={(e) => onUpdate(item.id, { color: e.target.value })}
          />
        </div>
      </div>

      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <button
          className={`toolbar-btn ${item.fontWeight === 'bold' ? 'active' : ''}`}
          onClick={() => onUpdate(item.id, { fontWeight: item.fontWeight === 'bold' ? 'normal' : 'bold' })}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          className={`toolbar-btn ${item.fontStyle === 'italic' ? 'active' : ''}`}
          onClick={() => onUpdate(item.id, { fontStyle: item.fontStyle === 'italic' ? 'normal' : 'italic' })}
          title="Italic"
        >
          <Italic size={16} />
        </button>
      </div>

      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={() => onBringToFront(item.id)} title="Bring to Front">
          <BringToFront size={16} />
        </button>
        <button className="toolbar-btn" onClick={() => onSendToBack(item.id)} title="Send to Back">
          <SendToBack size={16} />
        </button>
      </div>

      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <button className="toolbar-btn delete" onClick={() => onDelete(item.id)} title="Delete">
          <Trash2 size={16} />
        </button>
        <button className="toolbar-btn close" onClick={onClose} title="Close">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function ImageToolbar({ item, onBringToFront, onSendToBack, onDelete, onClose }) {
  if (!item) return null;

  return (
    <div
      className="text-toolbar"
      style={{ left: item.x, top: item.y - 60 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={() => onBringToFront(item.id)} title="Bring to Front">
          <BringToFront size={16} />
        </button>
        <button className="toolbar-btn" onClick={() => onSendToBack(item.id)} title="Send to Back">
          <SendToBack size={16} />
        </button>
      </div>

      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <button className="toolbar-btn delete" onClick={() => onDelete(item.id)} title="Delete">
          <Trash2 size={16} />
        </button>
        <button className="toolbar-btn close" onClick={onClose} title="Close">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function LinkToolbar({ item, onUpdate, onBringToFront, onSendToBack, onDelete, onClose }) {
  if (!item) return null;

  return (
    <div
      className="text-toolbar"
      style={{ left: item.x, top: item.y - 60 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="toolbar-group">
        <select
          value={item.fontFamily || 'Arial'}
          onChange={(e) => onUpdate(item.id, { fontFamily: e.target.value })}
          className="font-select"
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times</option>
          <option value="Courier New">Courier</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
          <option value="Work Sans">Work Sans</option>
          <option value="Space Mono">Space Mono</option>
          <option value="Silkscreen">Silkscreen</option>
          <option value="Noto Serif Display">Noto Serif Display</option>
          <option value="Gotu">Gotu</option>
          <option value="Miniver">Miniver</option>
          <option value="Barrio">Barrio</option>
          <option value="Pinyon Script">Pinyon Script</option>
          <option value="Lora">Lora</option>
          <option value="Libre Baskerville">Libre Baskerville</option>
          <option value="Borel">Borel</option>
          <option value="Funnel Display">Funnel Display</option>
          <option value="VT323">VT323</option>
        </select>

        <div className="color-picker-mini" title="Button Color">
          <input
            type="color"
            value={item.backgroundColor || '#000000'}
            onChange={(e) => onUpdate(item.id, { backgroundColor: e.target.value })}
          />
        </div>
      </div>

      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={() => onBringToFront(item.id)} title="Bring to Front">
          <BringToFront size={16} />
        </button>
        <button className="toolbar-btn" onClick={() => onSendToBack(item.id)} title="Send to Back">
          <SendToBack size={16} />
        </button>
      </div>

      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <button className="toolbar-btn delete" onClick={() => onDelete(item.id)} title="Delete">
          <Trash2 size={16} />
        </button>
        <button className="toolbar-btn close" onClick={onClose} title="Close">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function DateCustomizationPage() {
  const { dayId } = useParams();
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkFormData, setLinkFormData] = useState({ url: '', text: '' });
  const [background, setBackground] = useState({ type: 'color', value: '#f8fafc' });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const fileInputRef = useRef(null);
  const bgFileInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleAddText = () => {
    const newText = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'New Text',
      x: 100,
      y: 100,
      color: '#000000',
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontStyle: 'normal',
    };
    setItems([...items, newText]);
    setSelectedItemId(newText.id);
    setIsDrawerOpen(false);
  };

  const handleAddImageClick = () => {
    setIsDrawerOpen(false);
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: `image-${Date.now()}`,
          type: 'image',
          src: event.target.result,
          x: 100,
          y: 100,
          width: 200,
          height: 200,
        };
        setItems([...items, newImage]);
        setSelectedItemId(newImage.id);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleAddLink = () => {
    setLinkFormData({ url: '', text: 'Click Here' });
    setLinkDialogOpen(true);
    setIsDrawerOpen(false);
  };

  const handleConfirmAddLink = () => {
    if (!linkFormData.url) return;

    const newLink = {
      id: `link-${Date.now()}`,
      type: 'link',
      content: linkFormData.text || 'Click Here',
      url: linkFormData.url,
      x: 100,
      y: 100,
      width: 150,
      height: 50,
      backgroundColor: '#000000',
      color: '#ffffff',
      fontFamily: 'Arial',
    };
    setItems([...items, newLink]);
    setSelectedItemId(newLink.id);
    setLinkDialogOpen(false);
  };

  const handleBackgroundColorChange = (e) => {
    setBackground({ type: 'color', value: e.target.value });
  };

  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackground({ type: 'image', value: event.target.result });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleAddSticker = (src) => {
    const newSticker = {
      id: `sticker-${Date.now()}`,
      type: 'image',
      src: src,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
    };
    setItems([...items, newSticker]);
    setSelectedItemId(newSticker.id);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      setItems([]);
      setBackground({ type: 'color', value: '#f8fafc' });
      setSelectedItemId(null);
    }
  };

  const handleDragEnd = (event) => {
    const { active, delta } = event;
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === active.id) {
          return {
            ...item,
            x: item.x + delta.x,
            y: item.y + delta.y,
          };
        }
        return item;
      })
    );
  };

  const handleUpdateItem = (id, updates) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleBringToFront = (id) => {
    setItems((prevItems) => {
      const itemIndex = prevItems.findIndex((i) => i.id === id);
      if (itemIndex < 0) return prevItems;
      const newItems = [...prevItems];
      const [item] = newItems.splice(itemIndex, 1);
      newItems.push(item);
      return newItems;
    });
  };

  const handleSendToBack = (id) => {
    setItems((prevItems) => {
      const itemIndex = prevItems.findIndex((i) => i.id === id);
      if (itemIndex < 0) return prevItems;
      const newItems = [...prevItems];
      const [item] = newItems.splice(itemIndex, 1);
      newItems.unshift(item);
      return newItems;
    });
  };

  const handleDelete = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    setSelectedItemId(null);
  };

  const selectedItem = items.find(item => item.id === selectedItemId);

  return (
    <div className="customization-page" onClick={() => setSelectedItemId(null)}>
      <Snowfall color="#0000FF" />
      <header className="customization-header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/calendar" className="btn-back">
              <ArrowLeft size={24} />
            </Link>
            <h1>Edit Day {dayId}</h1>
          </div>
          <div className="header-actions">
            <button type="button" className="btn-cancel" onClick={handleClear}>
              <Eraser size={18} className="btn-icon" />
              Clear
            </button>
            <button type="button" className="btn-save">
              <Check size={18} className="btn-icon" />
              Save
            </button>
          </div>
        </div>
        <div className="header-divider"></div>
        <p className="date-display">December {dayId}, 2025</p>
      </header>

      <div className="main-content">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div
            className="canvas-area"
            style={{
              backgroundColor: background.type === 'color' ? background.value : 'transparent',
              backgroundImage: background.type === 'image' ? `url(${background.value})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {items.length === 0 && (
              <div className="canvas-placeholder">
                <p>Canvas Area</p>
              </div>
            )}
            {items.map((item) => {
              if (item.type === 'text') {
                return (
                  <DraggableText
                    key={item.id}
                    id={item.id}
                    content={item.content}
                    position={{ x: item.x, y: item.y }}
                    style={{
                      color: item.color,
                      fontFamily: item.fontFamily,
                      fontWeight: item.fontWeight,
                      fontStyle: item.fontStyle,
                    }}
                    isSelected={selectedItemId === item.id}
                    onSelect={setSelectedItemId}
                    onUpdate={handleUpdateItem}
                  />
                );
              } else if (item.type === 'image') {
                return (
                  <DraggableImage
                    key={item.id}
                    id={item.id}
                    src={item.src}
                    position={{ x: item.x, y: item.y }}
                    size={{ width: item.width, height: item.height }}
                    isSelected={selectedItemId === item.id}
                    onSelect={setSelectedItemId}
                    onUpdate={handleUpdateItem}
                  />
                );
              } else if (item.type === 'link') {
                return (
                  <DraggableLink
                    key={item.id}
                    id={item.id}
                    content={item.content}
                    url={item.url}
                    position={{ x: item.x, y: item.y }}
                    size={{ width: item.width, height: item.height }}
                    style={{
                      backgroundColor: item.backgroundColor,
                      color: item.color,
                      fontFamily: item.fontFamily,
                    }}
                    isSelected={selectedItemId === item.id}
                    onSelect={setSelectedItemId}
                    onUpdate={handleUpdateItem}
                  />
                );
              }
              return null;
            })}

            {selectedItem && selectedItem.type === 'text' && (
              <TextToolbar
                item={selectedItem}
                onUpdate={handleUpdateItem}
                onBringToFront={handleBringToFront}
                onSendToBack={handleSendToBack}
                onDelete={handleDelete}
                onClose={() => setSelectedItemId(null)}
              />
            )}

            {selectedItem && selectedItem.type === 'image' && (
              <ImageToolbar
                item={selectedItem}
                onBringToFront={handleBringToFront}
                onSendToBack={handleSendToBack}
                onDelete={handleDelete}
                onClose={() => setSelectedItemId(null)}
              />
            )}

            {selectedItem && selectedItem.type === 'link' && (
              <LinkToolbar
                item={selectedItem}
                onUpdate={handleUpdateItem}
                onBringToFront={handleBringToFront}
                onSendToBack={handleSendToBack}
                onDelete={handleDelete}
                onClose={() => setSelectedItemId(null)}
              />
            )}
          </div>
        </DndContext>

        <div className={`menu-drawer ${isDrawerOpen ? 'open' : ''}`}>
          <button
            className="drawer-toggle-btn"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            {isDrawerOpen ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
          </button>
          <div className="tool-buttons">
            <button className="tool-btn" title="Add Text" onClick={handleAddText}>
              <Type size={20} />
              <span>Text</span>
            </button>
            <button className="tool-btn" title="Add Image" onClick={handleAddImageClick}>
              <ImageIcon size={20} />
              <span>Image</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Dialog.Root open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
              <Dialog.Trigger asChild>
                <button className="tool-btn" title="Add Link" onClick={handleAddLink}>
                  <Link2 size={20} />
                  <span>Link</span>
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="dialog-content">
                  <Dialog.Title className="dialog-title">Add Link Button</Dialog.Title>
                  <Dialog.Description className="dialog-description">
                    Enter the URL and text for your link button.
                  </Dialog.Description>
                  <div className="dialog-form">
                    <div className="form-group">
                      <label>URL</label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={linkFormData.url}
                        onChange={(e) => setLinkFormData({ ...linkFormData, url: e.target.value })}
                        className="dialog-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Button Text</label>
                      <input
                        type="text"
                        placeholder="Click Here"
                        value={linkFormData.text}
                        onChange={(e) => setLinkFormData({ ...linkFormData, text: e.target.value })}
                        className="dialog-input"
                      />
                    </div>
                  </div>
                  <div className="dialog-actions">
                    <button className="btn-dialog-secondary" onClick={() => setLinkDialogOpen(false)}>Cancel</button>
                    <button className="btn-dialog-primary" onClick={handleConfirmAddLink}>Add Link</button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          <div className="drawer-section">
            <div className="section-header">
              <h3>Background</h3>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  id="bg-color"
                  value={background.type === 'color' ? background.value : '#ffffff'}
                  onChange={handleBackgroundColorChange}
                />
              </div>
            </div>
            <div className="background-grid">
              <div
                className="bg-option-placeholder upload-bg"
                onClick={() => bgFileInputRef.current?.click()}
                title="Upload Background Image"
              >
                <ImageIcon size={20} />
              </div>
              <input
                type="file"
                ref={bgFileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleBackgroundImageUpload}
              />
              {Object.values(import.meta.glob('../assets/backgrounds/*.{png,jpg,jpeg,svg,JPG}', { eager: true })).map((mod, index) => (
                <div
                  key={index}
                  className="bg-option-placeholder"
                  style={{
                    backgroundImage: `url(${mod.default})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  onClick={() => setBackground({ type: 'image', value: mod.default })}
                />
              ))}
            </div>
          </div>

          <div className="drawer-section">
            <div className="section-header">
              <h3>Stickers</h3>
            </div>
            <div className="sticker-grid">
              {Object.values(import.meta.glob('../assets/stickers/*.{png,jpg,jpeg,svg}', { eager: true })).map((mod, index) => (
                <div
                  key={index}
                  className="sticker-option-placeholder"
                  style={{
                    backgroundImage: `url(${mod.default})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'transparent',
                    border: 'none'
                  }}
                  onClick={() => handleAddSticker(mod.default)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DateCustomizationPage;
