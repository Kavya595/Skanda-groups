import { initialPlots, parkData, layoutRoads, calculateExtraCharges } from './plotsData.js';

export function getEnrichedPlots() {
  const plots = [...initialPlots];

  // Helper to find and set coords
  const setCoord = (num, x, y, w, h) => {
    const p = plots.find(item => item.plotNumber === num);
    if (p) {
      p.bounds = { x, y, width: w, height: h };
      p.polygon = [
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h]
      ];
      // 3D coordinates centered around (0,0) on XZ plane
      p.x3d = (x + w / 2 - 550) * 0.15;
      p.z3d = (y + h / 2 - 360) * 0.15;
      p.w3d = w * 0.14;
      p.d3d = h * 0.14;

      // Base pricing & extra charges
      p.basePricePerSqYd = 12500;
      const extra = calculateExtraCharges(p.facing, p.isCorner, p.roadWidth);
      p.extraChargesPerSqYd = extra.totalPerSqYd;
      p.extraChargesBreakdown = extra.breakdown;
      p.totalPrice = p.areaSqYds * (p.basePricePerSqYd + p.extraChargesPerSqYd);
      p.isUnverifiedPricing = true; // Transparency note: preview pricing pending final developer approval
      p.areaSqFt = p.areaSqYds * 9;
    }
  };

  // TOP SECTION: Block E - Highway Strip (Plots 1 to 6)
  setCoord(1, 875, 75, 60, 30);
  setCoord(2, 875, 107, 60, 30);
  setCoord(3, 875, 139, 60, 30);
  setCoord(4, 875, 171, 60, 30);
  setCoord(5, 875, 203, 60, 30);
  setCoord(6, 875, 235, 60, 35);

  // TOP SECTION: Block D (Plots 7 to 12)
  setCoord(10, 725, 75, 48, 38);
  setCoord(9,  778, 75, 48, 38);
  setCoord(8,  725, 118, 48, 36);
  setCoord(11, 778, 118, 48, 36);
  setCoord(7,  725, 158, 48, 36);
  setCoord(12, 778, 158, 48, 36);

  // TOP SECTION: Block C (Plots 13 to 16)
  setCoord(16, 570, 75, 52, 40);
  setCoord(15, 626, 75, 52, 40);
  setCoord(14, 570, 120, 52, 45);
  setCoord(13, 626, 120, 52, 45);

  // TOP SECTION: Block B (Plots 17 to 24)
  setCoord(24, 415, 75, 50, 40);
  setCoord(23, 470, 75, 50, 40);
  setCoord(22, 415, 120, 50, 33);
  setCoord(19, 470, 120, 50, 33);
  setCoord(21, 415, 157, 50, 33);
  setCoord(18, 470, 157, 50, 33);
  setCoord(20, 415, 194, 50, 33);
  setCoord(17, 470, 194, 50, 33);

  // TOP SECTION: Block A (Plots 25 to 30)
  setCoord(29, 275, 75, 45, 40);
  setCoord(30, 323, 75, 45, 40);
  setCoord(28, 275, 120, 45, 34);
  setCoord(26, 323, 120, 45, 34);
  setCoord(27, 275, 158, 45, 34);
  setCoord(25, 323, 158, 45, 34);

  // BOTTOM SECTION: West Strip (Plots 31 to 36)
  setCoord(31, 40, 325, 70, 50);
  setCoord(32, 40, 380, 70, 45);
  setCoord(33, 40, 430, 70, 45);
  setCoord(34, 40, 480, 70, 45);
  setCoord(35, 40, 530, 70, 45);
  setCoord(36, 40, 580, 70, 85);

  // BOTTOM SECTION: Block G (Plots 37 to 46)
  setCoord(41, 185, 325, 50, 45);
  setCoord(42, 240, 325, 50, 45);
  setCoord(40, 185, 375, 50, 45);
  setCoord(43, 240, 375, 50, 45);
  setCoord(39, 185, 425, 50, 45);
  setCoord(44, 240, 425, 50, 45);
  setCoord(38, 185, 475, 50, 45);
  setCoord(45, 240, 475, 50, 45);
  setCoord(37, 185, 525, 50, 60);
  setCoord(46, 240, 525, 50, 70);

  // BOTTOM SECTION: Block H (Plots 47 to 58)
  setCoord(51, 415, 325, 48, 42);
  setCoord(52, 468, 325, 48, 42);
  setCoord(50, 415, 372, 48, 42);
  setCoord(53, 468, 372, 48, 42);
  setCoord(49, 415, 419, 48, 42);
  setCoord(54, 468, 419, 48, 42);
  setCoord(48, 415, 466, 48, 42);
  setCoord(55, 468, 466, 48, 42);
  setCoord(47, 415, 513, 48, 42);
  setCoord(58, 468, 513, 48, 42);
  setCoord(56, 415, 560, 48, 65);
  setCoord(57, 468, 560, 48, 65);

  // BOTTOM SECTION: Block I (Plots 59 to 70)
  setCoord(64, 570, 325, 48, 42);
  setCoord(65, 623, 325, 48, 42);
  setCoord(63, 570, 372, 48, 42);
  setCoord(66, 623, 372, 48, 42);
  setCoord(62, 570, 419, 48, 42);
  setCoord(67, 623, 419, 48, 42);
  setCoord(61, 570, 466, 48, 42);
  setCoord(68, 623, 466, 48, 42);
  setCoord(60, 570, 513, 48, 42);
  setCoord(69, 623, 513, 48, 42);
  setCoord(59, 570, 560, 48, 65);
  setCoord(70, 623, 560, 48, 65);

  // BOTTOM SECTION: Block J (Plots 71 to 82)
  setCoord(76, 725, 325, 48, 42);
  setCoord(77, 778, 325, 48, 42);
  setCoord(75, 725, 372, 48, 42);
  setCoord(78, 778, 372, 48, 42);
  setCoord(74, 725, 419, 48, 42);
  setCoord(79, 778, 419, 48, 42);
  setCoord(73, 725, 466, 48, 42);
  setCoord(80, 778, 466, 48, 42);
  setCoord(72, 725, 513, 48, 42);
  setCoord(81, 778, 513, 48, 42);
  setCoord(71, 725, 560, 48, 65);
  setCoord(82, 778, 560, 48, 65);

  // BOTTOM SECTION: Block K - Highway Avenue (Plots 83 to 96)
  setCoord(89, 875, 325, 45, 38);
  setCoord(90, 924, 325, 48, 42);
  setCoord(88, 875, 368, 45, 38);
  setCoord(91, 924, 372, 48, 36);
  setCoord(87, 875, 411, 45, 38);
  setCoord(92, 924, 413, 48, 36);
  setCoord(86, 875, 454, 45, 38);
  setCoord(93, 924, 454, 48, 36);
  setCoord(85, 875, 497, 45, 38);
  setCoord(94, 924, 495, 48, 36);
  setCoord(84, 875, 540, 45, 38);
  setCoord(95, 924, 536, 48, 45);
  setCoord(83, 875, 583, 45, 50);
  setCoord(96, 924, 586, 48, 75);

  return plots;
}
