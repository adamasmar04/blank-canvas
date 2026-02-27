import { useState, useRef, useEffect } from "react";
import { Canvas as FabricCanvas, Circle, Rect, IText, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Copy, 
  Trash2, 
  Plus, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2,
  Palette,
  Type,
  Shapes,
  Upload,
  Layers,
  Circle as CircleIcon,
  Square,
  Triangle,
  Star,
  ArrowUp,
  Minus
} from "lucide-react";
import { toast } from "sonner";
import { AdFormData } from "@/hooks/useAdCreation";

interface AdEditorProps {
  formData: AdFormData;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  updateFormData: (field: keyof AdFormData, value: any) => void;
}

const AdEditor = ({ formData, onBack, onNext, onSkip, updateFormData }: AdEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState<"select" | "text" | "shapes" | "uploads" | "design">("select");
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, show: boolean}>({x: 0, y: 0, show: false});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxPages = formData.package === "Basic" ? 1 : formData.package === "Standard" ? 3 : 5;

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 512,
      height: 512,
      backgroundColor: "#ffffff",
    });

    canvas.on('selection:created', (e) => setSelectedObject(e.selected?.[0]));
    canvas.on('selection:updated', (e) => setSelectedObject(e.selected?.[0]));
    canvas.on('selection:cleared', () => setSelectedObject(null));
    
    canvas.on('mouse:down', (e) => {
      if ((e.e as MouseEvent).button === 2) { // Right click
        setContextMenu({
          x: (e.e as MouseEvent).clientX,
          y: (e.e as MouseEvent).clientY,
          show: true
        });
      } else {
        setContextMenu({x: 0, y: 0, show: false});
      }
    });

    setFabricCanvas(canvas);
    toast("Canvas ready! Start designing your ad!");

    return () => {
      canvas.dispose();
    };
  }, []);

  const addShape = (type: 'circle' | 'rectangle' | 'triangle' | 'star' | 'arrow' | 'line') => {
    if (!fabricCanvas) return;

    let shape: any;
    
    switch (type) {
      case 'circle':
        shape = new Circle({
          left: 100,
          top: 100,
          fill: activeColor,
          radius: 50,
        });
        break;
      case 'rectangle':
        shape = new Rect({
          left: 100,
          top: 100,
          fill: activeColor,
          width: 100,
          height: 60,
        });
        break;
      default:
        // For complex shapes, we'll create basic rectangles for now
        shape = new Rect({
          left: 100,
          top: 100,
          fill: activeColor,
          width: 100,
          height: 60,
        });
    }

    fabricCanvas.add(shape);
    fabricCanvas.setActiveObject(shape);
  };

  const addText = () => {
    if (!fabricCanvas) return;

    const text = new IText('Your Text Here', {
      left: 100,
      top: 100,
      fill: activeColor,
      fontSize: 24,
      fontFamily: 'Arial',
    });

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgElement = new Image();
      imgElement.onload = () => {
        FabricImage.fromURL(e.target?.result as string).then((img) => {
          img.scaleToWidth(200);
          img.set({
            left: 100,
            top: 100,
          });
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
        });
      };
      imgElement.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!fabricCanvas) return;
    
    const newZoom = direction === 'in' ? Math.min(zoom + 25, 200) : Math.max(zoom - 25, 50);
    setZoom(newZoom);
    fabricCanvas.setZoom(newZoom / 100);
    fabricCanvas.renderAll();
  };

  const duplicateObject = () => {
    if (!selectedObject || !fabricCanvas) return;
    
    selectedObject.clone().then((cloned: any) => {
      cloned.set({
        left: selectedObject.left + 20,
        top: selectedObject.top + 20,
      });
      fabricCanvas.add(cloned);
      fabricCanvas.setActiveObject(cloned);
    });
  };

  const deleteObject = () => {
    if (!selectedObject || !fabricCanvas) return;
    
    fabricCanvas.remove(selectedObject);
    setSelectedObject(null);
  };

  const layerControl = (action: 'front' | 'forward' | 'backward' | 'back') => {
    if (!selectedObject || !fabricCanvas) return;

    switch (action) {
      case 'front':
        fabricCanvas.bringObjectToFront(selectedObject);
        break;
      case 'forward':
        fabricCanvas.bringObjectForward(selectedObject);
        break;
      case 'backward':
        fabricCanvas.sendObjectBackwards(selectedObject);
        break;
      case 'back':
        fabricCanvas.sendObjectToBack(selectedObject);
        break;
    }
    fabricCanvas.renderAll();
  };

  const alignObject = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (!selectedObject || !fabricCanvas) return;

    const canvasWidth = fabricCanvas.width!;
    const canvasHeight = fabricCanvas.height!;
    const objWidth = selectedObject.width * selectedObject.scaleX;
    const objHeight = selectedObject.height * selectedObject.scaleY;

    switch (alignment) {
      case 'left':
        selectedObject.set('left', 0);
        break;
      case 'center':
        selectedObject.set('left', (canvasWidth - objWidth) / 2);
        break;
      case 'right':
        selectedObject.set('left', canvasWidth - objWidth);
        break;
      case 'top':
        selectedObject.set('top', 0);
        break;
      case 'middle':
        selectedObject.set('top', (canvasHeight - objHeight) / 2);
        break;
      case 'bottom':
        selectedObject.set('top', canvasHeight - objHeight);
        break;
    }
    
    fabricCanvas.renderAll();
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
  };

  const templates = [
    { id: 1, name: "Modern Sale", preview: "/api/placeholder/100/100" },
    { id: 2, name: "Product Launch", preview: "/api/placeholder/100/100" },
    { id: 3, name: "Service Ad", preview: "/api/placeholder/100/100" },
    { id: 4, name: "Event Promo", preview: "/api/placeholder/100/100" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Ad Editor</h1>
              <p className="text-muted-foreground">Design your {formData.package} ad - Page {currentPage} of {maxPages}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onSkip}>
              Skip Editor
            </Button>
            <Button onClick={onNext}>
              <ArrowRight className="w-4 h-4 ml-2" />
              Continue to Payment
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr_250px] gap-6">
          {/* Left Sidebar - Tools */}
          <Card className="h-fit">
            <CardContent className="p-4">
              <Tabs value={activeTool} onValueChange={(value) => setActiveTool(value as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="select">Select</TabsTrigger>
                  <TabsTrigger value="text">Tools</TabsTrigger>
                </TabsList>
                
                <div className="mt-4 space-y-4">
                  {/* Design Templates */}
                  <div>
                    <Button 
                      variant={activeTool === "design" ? "default" : "outline"} 
                      onClick={() => setActiveTool("design")}
                      className="w-full justify-start"
                    >
                      <Palette className="w-4 h-4 mr-2" />
                      Templates
                    </Button>
                    {activeTool === "design" && (
                      <div className="mt-2 space-y-2 animate-slide-in-right">
                        <div className="grid grid-cols-2 gap-2">
                          {templates.map((template) => (
                            <div key={template.id} className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                              <div className="aspect-square bg-gray-200 rounded mb-1"></div>
                              <p className="text-xs text-center">{template.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Shape Tools */}
                  <div>
                    <Button 
                      variant={activeTool === "shapes" ? "default" : "outline"} 
                      onClick={() => setActiveTool("shapes")}
                      className="w-full justify-start"
                    >
                      <Shapes className="w-4 h-4 mr-2" />
                      Shapes
                    </Button>
                    {activeTool === "shapes" && (
                      <div className="mt-2 space-y-2 animate-slide-in-right">
                        <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" size="sm" onClick={() => addShape('circle')}>
                            <CircleIcon className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => addShape('rectangle')}>
                            <Square className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => addShape('triangle')}>
                            <Triangle className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => addShape('star')}>
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => addShape('arrow')}>
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => addShape('line')}>
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Color Picker */}
                  <div>
                    <Label>Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={activeColor}
                        onChange={(e) => setActiveColor(e.target.value)}
                        className="w-12 h-8 border rounded cursor-pointer"
                      />
                      <Input
                        value={activeColor}
                        onChange={(e) => setActiveColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Text Tool */}
                  <Button 
                    variant={activeTool === "text" ? "default" : "outline"} 
                    onClick={() => {
                      setActiveTool("text");
                      addText();
                    }}
                    className="w-full justify-start"
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Add Text
                  </Button>

                  {/* Upload Tool */}
                  <div>
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full justify-start"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Layer Controls */}
                  {selectedObject && (
                    <div className="animate-fade-in">
                      <Label>Layers</Label>
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        <Button variant="outline" size="sm" onClick={() => layerControl('front')}>
                          To Front
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => layerControl('back')}>
                          To Back
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => layerControl('forward')}>
                          Forward
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => layerControl('backward')}>
                          Backward
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Center - Canvas Area */}
          <div className="space-y-4">
            {/* Canvas Toolbar */}
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedObject && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setSelectedObject({...selectedObject, visible: !selectedObject.visible})}>
                          {selectedObject.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setSelectedObject({...selectedObject, selectable: !selectedObject.selectable})}>
                          {selectedObject.selectable ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={duplicateObject}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={deleteObject}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {maxPages > 1 && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled={currentPage === maxPages}>
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Badge variant="secondary">{currentPage}/{maxPages}</Badge>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" onClick={() => handleZoom('out')}>
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="px-2 text-sm">{zoom}%</span>
                      <Button variant="outline" size="sm" onClick={() => handleZoom('in')}>
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Canvas */}
            <Card className={`p-4 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
              <CardContent className="p-0 flex justify-center">
                <div className="relative border-2 border-dashed border-gray-300">
                  <canvas ref={canvasRef} className="max-w-full" />
                  
                  {/* Canvas Size Indicator */}
                  <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
                    512 × 512 px
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Properties */}
          <Card className="h-fit">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Properties</h3>
                  {selectedObject ? (
                    <div className="space-y-3">
                      <div>
                        <Label>Object Type</Label>
                        <p className="text-sm text-muted-foreground">{selectedObject.type}</p>
                      </div>
                      
                      {selectedObject.type === 'i-text' && (
                        <div>
                          <Label>Font Size</Label>
                          <Input
                            type="number"
                            value={selectedObject.fontSize || 24}
                            onChange={(e) => {
                              selectedObject.set('fontSize', parseInt(e.target.value));
                              fabricCanvas?.renderAll();
                            }}
                          />
                        </div>
                      )}
                      
                      <div>
                        <Label>Fill Color</Label>
                        <input
                          type="color"
                          value={selectedObject.fill || "#000000"}
                          onChange={(e) => {
                            selectedObject.set('fill', e.target.value);
                            fabricCanvas?.renderAll();
                          }}
                          className="w-full h-8 border rounded cursor-pointer"
                        />
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label className="text-sm">Align to Page</Label>
                        <div className="grid grid-cols-3 gap-1 mt-1">
                          <Button variant="outline" size="sm" onClick={() => alignObject('left')}>L</Button>
                          <Button variant="outline" size="sm" onClick={() => alignObject('center')}>C</Button>
                          <Button variant="outline" size="sm" onClick={() => alignObject('right')}>R</Button>
                          <Button variant="outline" size="sm" onClick={() => alignObject('top')}>T</Button>
                          <Button variant="outline" size="sm" onClick={() => alignObject('middle')}>M</Button>
                          <Button variant="outline" size="sm" onClick={() => alignObject('bottom')}>B</Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Select an object to see properties</p>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <Button variant="destructive" size="sm" onClick={clearCanvas} className="w-full">
                    Clear Canvas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Context Menu */}
        {contextMenu.show && selectedObject && (
          <div 
            className="fixed bg-white border shadow-lg rounded p-2 z-50 animate-fade-in"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => layerControl('front')}>
                Bring to Front
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => layerControl('forward')}>
                Bring Forward
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => layerControl('backward')}>
                Send Backward
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => layerControl('back')}>
                Send to Back
              </Button>
              <Separator />
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => alignObject('center')}>
                Center Horizontally
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => alignObject('middle')}>
                Center Vertically
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdEditor;