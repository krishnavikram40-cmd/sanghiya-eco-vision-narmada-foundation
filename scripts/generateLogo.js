import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <!-- Top Text Path along upper arc -->
    <!-- Center is 250, 250. Radius of text circle = 214 -->
    <path id="topTextArc" d="M 50 250 A 200 200 0 0 1 450 250" fill="none" />
    <!-- Bottom Text Path along lower arc -->
    <path id="bottomTextArc" d="M 60 250 A 190 190 0 0 0 440 250" fill="none" />

    <!-- Wave Gradients -->
    <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1565c0" />
      <stop offset="50%" stop-color="#1976d2" />
      <stop offset="100%" stop-color="#0d47a1" />
    </linearGradient>
    <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#42a5f5" />
      <stop offset="50%" stop-color="#2196f3" />
      <stop offset="100%" stop-color="#1976d2" />
    </linearGradient>

    <!-- Gold Gradients -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>

    <!-- Foliage Gradients -->
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4ade80" />
      <stop offset="50%" stop-color="#22c55e" />
      <stop offset="100%" stop-color="#15803d" />
    </linearGradient>
    <linearGradient id="darkLeafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#16a34a" />
      <stop offset="100%" stop-color="#14532d" />
    </linearGradient>
  </defs>

  <!-- 1. OUTER RING (Dark Navy Blue) -->
  <circle cx="250" cy="250" r="248" fill="#1c3f60" stroke="#122a42" stroke-width="4" />
  <circle cx="250" cy="250" r="240" fill="none" stroke="#ffffff" stroke-width="2" />

  <!-- 2. INNER WHITE CIRCLE CONTAINER -->
  <circle cx="250" cy="250" r="182" fill="#ffffff" stroke="#1c3f60" stroke-width="3" />
  <circle cx="250" cy="250" r="186" fill="none" stroke="#ffffff" stroke-width="2" />

  <!-- 3. CIRCULAR TEXT IN OUTER NAVY BAND -->
  <!-- Top Arc: SANGHIYA ECO-VISION -->
  <text fill="#ffffff" font-family="'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif" font-weight="900" font-size="31.5" letter-spacing="4">
    <textPath href="#topTextArc" startOffset="50%" text-anchor="middle">
      SANGHIYA ECO-VISION
    </textPath>
  </text>

  <!-- Separator Dots (Left and Right) -->
  <circle cx="58" cy="250" r="7" fill="#ffffff" />
  <circle cx="442" cy="250" r="7" fill="#ffffff" />

  <!-- Bottom Arc: NARMADA FOUNDATION -->
  <text fill="#ffffff" font-family="'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif" font-weight="900" font-size="29.5" letter-spacing="3.5">
    <textPath href="#bottomTextArc" startOffset="50%" text-anchor="middle">
      NARMADA FOUNDATION
    </textPath>
  </text>

  <!-- 4. INNER ARTWORK: CLIPPED TO CIRCLE (r=180) -->
  <g clip-path="url(#innerCircleClip)">
    <clipPath id="innerCircleClip">
      <circle cx="250" cy="250" r="180" />
    </clipPath>

    <!-- White Background for Center -->
    <rect x="70" y="70" width="360" height="360" fill="#ffffff" />

    <!-- 4.1 TREE OF LIFE / SACRED GREEN FOLIAGE (Canopy behind Goddess) -->
    <!-- Tree Trunk & Branches -->
    <path d="M 250 330 Q 250 260 250 210 Q 230 170 210 145" stroke="#451a03" stroke-width="7" stroke-linecap="round" fill="none" />
    <path d="M 250 220 Q 270 170 290 145" stroke="#451a03" stroke-width="6" stroke-linecap="round" fill="none" />
    <path d="M 245 240 Q 210 200 175 180" stroke="#451a03" stroke-width="5" stroke-linecap="round" fill="none" />
    <path d="M 255 240 Q 290 200 325 180" stroke="#451a03" stroke-width="5" stroke-linecap="round" fill="none" />

    <!-- Radial Leaves Canopy (Symmetric Lush Arch) -->
    <!-- Central Top Leaves -->
    <path d="M 250 96 C 242 110 242 125 250 138 C 258 125 258 110 250 96 Z" fill="url(#leafGrad)" />
    <path d="M 235 106 C 224 118 227 133 238 143 C 243 130 242 116 235 106 Z" fill="url(#darkLeafGrad)" />
    <path d="M 265 106 C 276 118 273 133 262 143 C 257 130 258 116 265 106 Z" fill="url(#darkLeafGrad)" />

    <!-- Upper Ring Leaves -->
    <path d="M 218 118 C 205 130 210 145 224 153 C 227 139 224 126 218 118 Z" fill="url(#leafGrad)" />
    <path d="M 282 118 C 295 130 290 145 276 153 C 273 139 276 126 282 118 Z" fill="url(#leafGrad)" />
    <path d="M 200 136 C 186 148 193 163 208 168 C 210 154 206 142 200 136 Z" fill="url(#darkLeafGrad)" />
    <path d="M 300 136 C 314 148 307 163 292 168 C 290 154 294 142 300 136 Z" fill="url(#darkLeafGrad)" />

    <!-- Mid Layer Leaves -->
    <path d="M 182 158 C 168 170 177 184 192 186 C 193 172 188 162 182 158 Z" fill="url(#leafGrad)" />
    <path d="M 318 158 C 332 170 323 184 308 186 C 307 172 312 162 318 158 Z" fill="url(#leafGrad)" />
    <path d="M 166 182 C 152 195 162 208 178 208 C 178 194 172 185 166 182 Z" fill="url(#darkLeafGrad)" />
    <path d="M 334 182 C 348 195 338 208 322 208 C 322 194 328 185 334 182 Z" fill="url(#darkLeafGrad)" />

    <!-- Outer Flanking Leaves -->
    <path d="M 152 210 C 140 224 152 236 167 234 C 166 220 159 212 152 210 Z" fill="url(#leafGrad)" />
    <path d="M 348 210 C 360 224 348 236 333 234 C 334 220 341 212 348 210 Z" fill="url(#leafGrad)" />
    <path d="M 144 240 C 134 254 146 264 161 260 C 158 247 150 241 144 240 Z" fill="url(#darkLeafGrad)" />
    <path d="M 356 240 C 366 254 354 264 339 260 C 342 247 350 241 356 240 Z" fill="url(#darkLeafGrad)" />

    <!-- Dense Inner Foliage Fillers -->
    <path d="M 235 152 C 228 162 230 173 239 179 C 243 170 241 159 235 152 Z" fill="url(#leafGrad)" />
    <path d="M 265 152 C 272 162 270 173 261 179 C 257 170 259 159 265 152 Z" fill="url(#leafGrad)" />
    <path d="M 215 174 C 205 184 210 196 222 199 C 224 188 221 179 215 174 Z" fill="url(#darkLeafGrad)" />
    <path d="M 285 174 C 295 184 290 196 278 199 C 276 188 279 179 285 174 Z" fill="url(#darkLeafGrad)" />

    <!-- 4.2 RIVER NARMADA WAVES (Water flowing at base) -->
    <path d="M 70 360 Q 120 340 170 360 T 270 355 T 370 360 T 430 350 L 430 430 L 70 430 Z" fill="url(#waveGrad1)" />
    <path d="M 70 380 Q 130 360 190 380 T 310 375 T 430 370 L 430 430 L 70 430 Z" fill="url(#waveGrad2)" />
    <path d="M 70 405 Q 150 385 230 405 T 390 400 T 430 395 L 430 430 L 70 430 Z" fill="#0d47a1" />

    <!-- Wave Crest Foam Highlights (White Ripples) -->
    <path d="M 100 365 Q 140 350 180 365" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9" />
    <path d="M 200 360 Q 250 348 300 362" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.85" />
    <path d="M 310 365 Q 360 352 410 365" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9" />
    <path d="M 130 388 Q 180 374 230 388" stroke="#e0f2fe" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8" />
    <path d="M 250 385 Q 310 372 370 386" stroke="#e0f2fe" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8" />
    <path d="M 160 412 Q 220 398 280 412" stroke="#bae6fd" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.75" />

    <!-- 4.3 MAKARA (Sacred Divine Crocodile Vahana) -->
    <!-- Tail on left curving upward -->
    <path d="M 152 355 C 135 345 130 310 148 295 C 158 287 165 292 162 305 C 158 318 166 332 180 338 Z" fill="#2e7d32" stroke="#1b5e20" stroke-width="2" />
    <!-- Crocodile Body -->
    <path d="M 175 338 C 210 330 290 328 340 342 C 365 348 378 342 388 348 C 375 362 350 368 310 368 C 240 368 185 362 175 338 Z" fill="#388e3c" stroke="#1b5e20" stroke-width="2" />
    <!-- Crocodile Head & Snout (Facing Right) -->
    <path d="M 340 342 C 360 338 385 342 396 348 C 392 354 380 358 360 358 Z" fill="#2e7d32" stroke="#1b5e20" stroke-width="2" />
    <!-- Eye & Nostril -->
    <circle cx="365" cy="344" r="2.5" fill="#fde047" stroke="#1b5e20" stroke-width="1" />
    <circle cx="388" cy="346" r="1.5" fill="#1b5e20" />
    <!-- Teeth in Snout -->
    <polygon points="368,354 372,350 376,354" fill="#ffffff" />
    <polygon points="378,354 382,350 386,354" fill="#ffffff" />
    <!-- Scale Texture Dots on Makara Back -->
    <circle cx="190" cy="342" r="2.5" fill="#1b5e20" />
    <circle cx="210" cy="340" r="3" fill="#1b5e20" />
    <circle cx="230" cy="339" r="3" fill="#1b5e20" />
    <circle cx="250" cy="338" r="3" fill="#1b5e20" />
    <circle cx="270" cy="339" r="3" fill="#1b5e20" />
    <circle cx="290" cy="341" r="3" fill="#1b5e20" />
    <circle cx="310" cy="343" r="2.5" fill="#1b5e20" />
    <circle cx="330" cy="346" r="2.5" fill="#1b5e20" />

    <!-- 4.4 GODDESS MAA NARMADA (Seated Divinity) -->
    <!-- Seated Lower Body (White/Cream Saree with Golden Trim) -->
    <path d="M 210 325 C 205 305 220 292 250 292 C 280 292 295 305 290 325 C 285 338 270 345 250 345 C 230 345 215 338 210 325 Z" fill="#fffbeb" stroke="#d97706" stroke-width="1.8" />
    <!-- Pleats / Dhoti Folds -->
    <path d="M 235 305 Q 242 335 240 344" stroke="#d97706" stroke-width="1.5" fill="none" />
    <path d="M 250 296 Q 250 335 250 345" stroke="#d97706" stroke-width="2" fill="none" />
    <path d="M 265 305 Q 258 335 260 344" stroke="#d97706" stroke-width="1.5" fill="none" />
    <path d="M 220 320 Q 235 338 250 340 Q 265 338 280 320" stroke="#f59e0b" stroke-width="2" fill="none" />

    <!-- Torso (Blouse: Traditional Green / Red Accents, Saree Pallu across shoulder) -->
    <path d="M 234 245 C 230 265 232 290 236 298 C 244 300 256 300 264 298 C 268 290 270 265 266 245 Z" fill="#15803d" stroke="#166534" stroke-width="1.5" />
    <!-- Saree Pallu (Cream/Gold draped diagonally) -->
    <path d="M 235 295 C 242 278 252 258 266 248 C 263 245 258 245 255 248 C 245 258 238 278 235 295 Z" fill="#fffbeb" stroke="#d97706" stroke-width="1.5" />
    <!-- Waistband / Kamarbandh -->
    <path d="M 234 294 Q 250 298 266 294" stroke="#b45309" stroke-width="2.5" fill="none" />
    <circle cx="250" cy="296" r="2.5" fill="#fde047" />

    <!-- Necklace / Mala on Neck -->
    <path d="M 242 242 Q 250 252 258 242" stroke="#d97706" stroke-width="2" fill="none" />
    <path d="M 240 248 Q 250 262 260 248" stroke="#f59e0b" stroke-width="1.5" fill="none" />
    <circle cx="250" cy="256" r="2" fill="#ef4444" />

    <!-- Divine Face & Neck -->
    <path d="M 246 235 L 246 244 Q 250 246 254 244 L 254 235 Z" fill="#fde68a" />
    <!-- Face Contour -->
    <path d="M 240 220 C 240 208 260 208 260 220 C 260 230 256 236 250 236 C 244 236 240 230 240 220 Z" fill="#fef3c7" stroke="#d97706" stroke-width="1" />
    <!-- Divine Eyes & Bindi -->
    <circle cx="250" cy="216" r="1.5" fill="#dc2626" /> <!-- Kumkum Bindi -->
    <path d="M 244 221 Q 246 223 248 221" stroke="#451a03" stroke-width="1" fill="none" /> <!-- Left Eye -->
    <path d="M 252 221 Q 254 223 256 221" stroke="#451a03" stroke-width="1" fill="none" /> <!-- Right Eye -->
    <path d="M 248 228 Q 250 230 252 228" stroke="#dc2626" stroke-width="1" fill="none" /> <!-- Gentle Smile -->

    <!-- Sacred Mukut (Golden Ornate Crown) -->
    <path d="M 238 212 L 242 186 L 250 174 L 258 186 L 262 212 Z" fill="url(#goldGrad)" stroke="#78350f" stroke-width="1.5" />
    <!-- Mukut Inner Ornaments -->
    <line x1="250" y1="174" x2="250" y2="212" stroke="#78350f" stroke-width="1" />
    <circle cx="250" cy="192" r="2.5" fill="#dc2626" />
    <circle cx="245" cy="202" r="1.8" fill="#ffffff" />
    <circle cx="255" cy="202" r="1.8" fill="#ffffff" />
    <!-- Mukut Halo / Golden Aura Rays behind Crown -->
    <path d="M 232 206 Q 250 166 268 206" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" fill="none" />

    <!-- 4.5 FOUR SACRED ARMS & ATTRIBUTES -->
    <!-- Hand 1 (Upper Right / Goddess's Right Hand, on Left): Holding Kalash -->
    <path d="M 235 250 Q 212 242 205 220 Q 208 212 216 215" stroke="#fef3c7" stroke-width="5" stroke-linecap="round" fill="none" />
    <path d="M 235 250 Q 212 242 205 220" stroke="#d97706" stroke-width="1.2" fill="none" />
    <!-- Golden Kalash -->
    <g transform="translate(202, 195)">
      <path d="M 8 18 C 0 18 -2 8 8 8 C 18 8 16 18 8 18 Z" fill="url(#goldGrad)" stroke="#78350f" stroke-width="1" />
      <path d="M 5 8 L 11 8 L 8 4 Z" fill="#15803d" /> <!-- Mango Leaves in Kalash -->
      <circle cx="8" cy="4" r="3.5" fill="#92400e" stroke="#fde047" stroke-width="0.8" /> <!-- Coconut -->
    </g>

    <!-- Hand 2 (Upper Left / Goddess's Left Hand, on Right): Holding Sacred Manuscript -->
    <path d="M 265 250 Q 288 242 295 220 Q 292 212 284 215" stroke="#fef3c7" stroke-width="5" stroke-linecap="round" fill="none" />
    <path d="M 265 250 Q 288 242 295 220" stroke="#d97706" stroke-width="1.2" fill="none" />
    <!-- Sacred Manuscript / Vedic Granth -->
    <g transform="translate(285, 204)">
      <rect x="0" y="0" width="18" height="10" rx="1.5" fill="#fef3c7" stroke="#92400e" stroke-width="1" transform="rotate(-20)" />
      <line x1="2" y1="3" x2="15" y2="3" stroke="#b45309" stroke-width="0.8" transform="rotate(-20)" />
      <line x1="2" y1="6" x2="15" y2="6" stroke="#b45309" stroke-width="0.8" transform="rotate(-20)" />
    </g>

    <!-- Hand 3 (Lower Right / Goddess's Right Hand, on Left): Holding Japa Mala -->
    <path d="M 234 268 Q 216 280 208 300 Q 212 306 220 302" stroke="#fef3c7" stroke-width="4.5" stroke-linecap="round" fill="none" />
    <!-- Japa Mala Beads (Rosary hanging down) -->
    <g transform="translate(204, 298)">
      <circle cx="0" cy="5" r="1.8" fill="#92400e" />
      <circle cx="0" cy="10" r="1.8" fill="#92400e" />
      <circle cx="2" cy="15" r="1.8" fill="#92400e" />
      <circle cx="5" cy="20" r="1.8" fill="#92400e" />
      <circle cx="9" cy="23" r="2.2" fill="#d97706" /> <!-- Golden Guru bead & tassel -->
      <path d="M 9 25 L 9 32" stroke="#d97706" stroke-width="1.5" />
    </g>

    <!-- Hand 4 (Lower Left / Goddess's Left Hand, on Right): Holding Pink Lotus Flower -->
    <path d="M 266 268 Q 284 280 292 300 Q 288 306 280 302" stroke="#fef3c7" stroke-width="4.5" stroke-linecap="round" fill="none" />
    <!-- Blooming Sacred Lotus (Kamal) -->
    <g transform="translate(295, 280)">
      <!-- Lotus Stem -->
      <path d="M -2 18 Q 4 12 6 2" stroke="#16a34a" stroke-width="2" fill="none" />
      <!-- Central Petal -->
      <path d="M 6 -5 C 2 3 2 12 6 16 C 10 12 10 3 6 -5 Z" fill="#ec4899" stroke="#be185d" stroke-width="0.8" />
      <!-- Left Petals -->
      <path d="M 6 16 C 0 10 -2 2 0 -2 C 2 4 4 10 6 16 Z" fill="#f472b6" stroke="#be185d" stroke-width="0.8" />
      <!-- Right Petals -->
      <path d="M 6 16 C 12 10 14 2 12 -2 C 10 4 8 10 6 16 Z" fill="#f472b6" stroke="#be185d" stroke-width="0.8" />
      <!-- Outer Petals -->
      <path d="M 6 16 C -5 14 -6 6 -3 3 C 0 8 3 13 6 16 Z" fill="#fbcfe8" />
      <path d="M 6 16 C 17 14 18 6 15 3 C 12 8 9 13 6 16 Z" fill="#fbcfe8" />
    </g>
  </g>
</svg>`;

async function run() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write the vector SVG
  const svgPath = path.join(publicDir, 'logo.svg');
  fs.writeFileSync(svgPath, svgContent);
  console.log('Written logo.svg');

  // 2. Also write favicon.svg
  const faviconSvgPath = path.join(publicDir, 'favicon.svg');
  fs.writeFileSync(faviconSvgPath, svgContent);

  // 3. Render 512x512 High-Res PNG (logo.png)
  const pngPath = path.join(publicDir, 'logo.png');
  await sharp(Buffer.from(svgContent))
    .resize(512, 512)
    .png()
    .toFile(pngPath);
  console.log('Rendered logo.png (512x512)');

  // 4. Render 1775019606039.png (so the user's specific upload filename is also satisfied!)
  const userUploadPath = path.join(publicDir, '1775019606039.png');
  await sharp(Buffer.from(svgContent))
    .resize(512, 512)
    .png()
    .toFile(userUploadPath);
  console.log('Rendered 1775019606039.png (512x512 cropped perfectly)');

  // 5. Render 64x64 Favicon
  const faviconPath = path.join(publicDir, 'favicon.png');
  await sharp(Buffer.from(svgContent))
    .resize(64, 64)
    .png()
    .toFile(faviconPath);
  console.log('Rendered favicon.png (64x64)');
}

run().catch(console.error);
