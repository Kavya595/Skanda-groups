import fs from 'fs';
import path from 'path';

const targetDir = 'd:/Skandha Group/client/public/assets';
fs.mkdirSync(targetDir, { recursive: true });

const scratchDir = 'C:/Users/HP/.gemini/antigravity/brain/bc8df0b7-34ae-4012-bba6-3abb28dc7b91/scratch/extracted_assets';
const uploadedDir = 'C:/Users/HP/.gemini/antigravity/brain/bc8df0b7-34ae-4012-bba6-3abb28dc7b91/.user_uploaded';

// 1. Copy SVG logos
fs.copyFileSync(path.join(scratchDir, 'skandha_logo_brand.svg'), path.join(targetDir, 'skandha_logo.svg'));
fs.copyFileSync(path.join(scratchDir, 'skandha_logo_white.svg'), path.join(targetDir, 'skandha_logo_white.svg'));

// 2. Copy hero & map
fs.copyFileSync(path.join(scratchDir, 'brochure_img_0_837139.jpg'), path.join(targetDir, 'hero_cover.jpg'));
fs.copyFileSync(path.join(scratchDir, 'brochure_img_1_1305348.jpg'), path.join(targetDir, 'route_map.jpg'));

// 3. Copy approvals & landmarks
fs.copyFileSync(path.join(scratchDir, 'brochure_img_2_232910.jpg'), path.join(targetDir, 'maisigandi_temple.jpg'));
if (fs.existsSync(path.join(scratchDir, 'flyer_img_11_74172.jpg'))) {
  fs.copyFileSync(path.join(scratchDir, 'flyer_img_11_74172.jpg'), path.join(targetDir, 'dtcp_approved_stamp.jpg'));
}
if (fs.existsSync(path.join(scratchDir, 'flyer_img_12_85075.jpg'))) {
  fs.copyFileSync(path.join(scratchDir, 'flyer_img_12_85075.jpg'), path.join(targetDir, 'ts_rera_stamp.jpg'));
}

// 4. Copy development site photos
const sitePhotos = [
  { src: 'brochure_img_6_233703.jpg', dest: 'site_entrance_arch.jpg', title: 'Grand Entrance Gate with Fencing' },
  { src: 'brochure_img_7_56078.jpg', dest: 'site_overhead_tank.jpg', title: 'Overhead Water Tank' },
  { src: 'brochure_img_8_69707.jpg', dest: 'site_children_park.jpg', title: 'Children Play Area & Park' },
  { src: 'brochure_img_9_53977.jpg', dest: 'site_bt_roads.jpg', title: '40ft & 33ft Wide B.T Roads' },
  { src: 'brochure_img_10_66282.jpg', dest: 'site_landscape_park.jpg', title: 'Landscaped Parks & Greenery' },
  { src: 'brochure_img_11_70679.jpg', dest: 'site_jogging_track.jpg', title: 'Jogging Track & Walkways' },
  { src: 'brochure_img_12_83030.jpg', dest: 'site_avenue_plantation.jpg', title: 'Avenue Plantation & Street Lights' },
  { src: 'brochure_img_13_63635.jpg', dest: 'site_drainage_system.jpg', title: 'Underground Drainage System' },
  { src: 'brochure_img_14_68206.jpg', dest: 'site_aerial_view.jpg', title: 'Site Layout Development' }
];

sitePhotos.forEach(p => {
  const pPath = path.join(scratchDir, p.src);
  if (fs.existsSync(pPath)) {
    fs.copyFileSync(pPath, path.join(targetDir, p.dest));
  }
});

// 5. Copy official brochures as downloadable PDFs
fs.copyFileSync(path.join(uploadedDir, 'media_1791868372689_2230b34d.pdf'), path.join(targetDir, 'alekhyas_brundavan_brochure.pdf'));
fs.copyFileSync(path.join(uploadedDir, 'media_1791868379295_0972c4c4.pdf'), path.join(targetDir, 'alekhyas_brundavan_flyer.pdf'));

console.log('Successfully organized and copied all official assets into client/public/assets!');
