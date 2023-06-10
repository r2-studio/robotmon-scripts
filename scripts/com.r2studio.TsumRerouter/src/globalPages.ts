import { GroupPage, Page } from 'rerouter';

export const GlobalPages = {
  RootDetection: new Page(
    'RootDetection',
    [
      { x: 43, y: 262, r: 255, g: 255, b: 255 },
      { x: 319, y: 265, r: 255, g: 255, b: 255 },
      { x: 39, y: 378, r: 255, g: 255, b: 255 },
      { x: 320, y: 390, r: 255, g: 255, b: 255 },
      { x: 294, y: 378, r: 188, g: 223, b: 219 },
    ],
    { x: 297, y: 378 } // Permit Button
  ),
  SelectCountry: new Page(
    'SelectCountry',
    [
      { x: 75, y: 37, r: 255, g: 255, b: 255 },
      { x: 332, y: 37, r: 255, g: 255, b: 255 },
      { x: 71, y: 265, r: 229, g: 228, b: 236 },
      { x: 297, y: 264, r: 30, g: 30, b: 30 },
      { x: 182, y: 322, r: 247, g: 182, b: 8 },
      { x: 323, y: 552, r: 255, g: 255, b: 255 },
    ],
    { x: 182, y: 322 }
  ),
};
