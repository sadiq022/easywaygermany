# SOP Writing Page — Image Placement Guide

## Image Used

The SOP Writing page (`src/pages/services/SOPWriting.jsx`) references one image:

```
/images/services/SOP_Image.jpg
```

## Where to Place It

Put the image at:

```
public/images/services/SOP_Image.jpg
```

### Why this path?

In Vite (React), anything inside the `public/` folder is served at the root URL `/`.  
So `public/images/services/SOP_Image.jpg` becomes accessible as `/images/services/SOP_Image.jpg` in the browser — exactly what the `<img src="...">` tag uses.

## Steps

1. Create the folder if it doesn't exist:
   ```
   public/
   └── images/
       └── services/
           └── SOP_Image.jpg   ← place your image here
   ```

2. Copy your image (`SOP_Image.jpg`) from the old Flask project:
   - Old location: `static/images/services/SOP_Image.jpg`
   - New location: `public/images/services/SOP_Image.jpg`

3. No code changes needed — the `src` path in the component already points to the correct location.

## Recommended Image Specs

| Property   | Recommendation          |
|------------|-------------------------|
| Format     | JPG or WebP             |
| Dimensions | At least 800 × 500 px   |
| Aspect     | ~3:2 landscape          |
| File size  | Under 200 KB (compress) |

The image is displayed at `h-80` (320 px tall) and full width on desktop, so a landscape photo works best.
