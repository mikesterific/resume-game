# Asset Download Guide
*Professional textures and models for the Space Museum*

## 🎯 **Required Downloads**

### **1. Floor Textures**
**Source**: [AmbientCG WoodFloor040](https://ambientcg.com/view?id=WoodFloor040)

**Steps**:
1. Visit the AmbientCG link
2. Select resolution: **1K** (recommended for performance)
3. Download these files:
   - `WoodFloor040_1K_Color.jpg` → Save as `public/textures/floor/diffuse.jpg`
   - `WoodFloor040_1K_Normal.jpg` → Save as `public/textures/floor/normal.jpg`
   - `WoodFloor040_1K_Roughness.jpg` → Save as `public/textures/floor/roughness.jpg`
   - `WoodFloor040_1K_AmbientOcclusion.jpg` → Save as `public/textures/floor/ao.jpg`

### **2. Ceiling Textures**
**Source**: [AmbientCG OfficeCeiling005](https://ambientcg.com/view?id=OfficeCeiling005)

**Steps**:
1. Visit the AmbientCG link
2. Select resolution: **1K**
3. Download these files:
   - `OfficeCeiling005_1K_Color.jpg` → Save as `public/textures/ceiling/diffuse.jpg`
   - `OfficeCeiling005_1K_Normal.jpg` → Save as `public/textures/ceiling/normal.jpg`
   - `OfficeCeiling005_1K_Roughness.jpg` → Save as `public/textures/ceiling/roughness.jpg`

### **3. Wall Textures**
**Source**: [Polyhaven Leather White](https://polyhaven.com/a/leather%5Fwhite)

**Steps**:
1. Visit the Polyhaven link
2. Select resolution: **1K**
3. Download these files:
   - `leather_white_diff_1k.jpg` → Save as `public/textures/walls/diffuse.jpg`
   - `leather_white_nor_gl_1k.jpg` → Save as `public/textures/walls/normal.jpg`
   - `leather_white_rough_1k.jpg` → Save as `public/textures/walls/roughness.jpg`
   - `leather_white_disp_1k.jpg` → Save as `public/textures/walls/displacement.jpg`

### **4. 3D Model (Optional)**
**Source**: [Sketchfab Aphrodite Statue](https://sketchfab.com/3d-models/100kz11-aphrodite-kallipygos-statuette-c01ba617ec83491195146583b70e3df9)

**Steps**:
1. Visit the Sketchfab link
2. Click "Download 3D Model" (may require free account)
3. Select **GLTF** format
4. Save as `public/models/statue.glb`

## 📁 **Expected File Structure**
After downloading, your `public` folder should look like:

```
public/
├── textures/
│   ├── floor/
│   │   ├── diffuse.jpg     ✓
│   │   ├── normal.jpg      ✓
│   │   ├── roughness.jpg   ✓
│   │   └── ao.jpg          ✓
│   ├── ceiling/
│   │   ├── diffuse.jpg     ✓
│   │   ├── normal.jpg      ✓
│   │   └── roughness.jpg   ✓
│   └── walls/
│       ├── diffuse.jpg     ✓
│       ├── normal.jpg      ✓
│       ├── roughness.jpg   ✓
│       └── displacement.jpg ✓
└── models/
    └── statue.glb          ✓ (optional)
```

## 🚀 **Next Steps**
Once you've downloaded the assets:

1. **Test the downloads**: Verify all files are in the correct locations
2. **Implement Phase 1**: Update SpaceMuseum.vue with texture loading
3. **Test performance**: Ensure smooth 60fps with new textures
4. **Proceed to Phase 2**: Advanced lighting system

## 💡 **Tips**
- **Start with 1K textures** for better performance
- **AmbientCG requires free registration** but has excellent quality
- **Polyhaven is completely free** and offers great PBR materials
- **Test one texture type at a time** to isolate any issues

## 🔧 **Troubleshooting**
- If textures appear black: Check file paths and names
- If performance drops: Reduce texture resolution or use compression
- If normal maps look wrong: Ensure you're using the OpenGL format (not DirectX)

Let me know when you've downloaded the assets and we'll implement Phase 1! 🎨✨
