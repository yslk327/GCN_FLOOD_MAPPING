var matam = ee.FeatureCollection("projects/ee-yassineloukili/assets/AnalysisExtent_Matam_Senegal_20241025");
var    l8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2");
var    l9 = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2");

// Zone d'étude : Matam

// Période
var start = ee.Date('2024-10-01');
var end = ee.Date('2024-10-31');

// Landsat 8 et 9

function cloudMask(img) {
  var qa = img.select('QA_PIXEL');
  var mask = qa.bitwiseAnd(1 << 3).eq(0)
    .and(qa.bitwiseAnd(1 << 4).eq(0))
    .and(qa.bitwiseAnd(1 << 2).eq(0));
  return img.updateMask(mask).select(['SR_B3', 'SR_B5']).multiply(0.0000275).add(-0.2);
}

// NDWI = (Green - NIR) / (Green + NIR)
function addNDWI(img) {
  var ndwi = img.normalizedDifference(['SR_B3', 'SR_B5']).rename('NDWI');
  return img.addBands(ndwi);
}

// SRTM
var srtm = ee.Image("USGS/SRTMGL1_003").clip(matam).rename('elevation');


// === 7. Image Landsat NDWI + SRTM ===
var image = l8
   .merge(l9)
  .filterDate(start,end)
  .filterBounds(matam)
  //.map(cloudMaskLight)
  .map(addNDWI);

// === 8. Vérification des images disponibles ===
print("Images disponibles (L8 + L9) :", image.aggregate_array('system:index'));
/*
Images disponibles (L8 + L9) :
List (4 elements)
0: 1_LC08_203049_20241001
1: 1_LC08_203049_20241017
2: 2_LC09_203049_20241009
3: 2_LC09_203049_20241025
*/

// Image Landsat composite avec NDWI
var image = l8.merge(l9)
  .filterDate(start, end)
  .filterBounds(matam)
  .map(cloudMask)
  .map(addNDWI)
  .median()
  .addBands(srtm)
  .clip(matam);


// === ZONES PROBABLES EAU / NON-EAU SELON NDWI ===
// Zones claires à NDWI positif = Eau probable
var water_area = image.select('NDWI').gt(0.02).selfMask();

// Zones très négatives = non-eau stable
var non_water_area = image.select('NDWI').lt(-0.05).selfMask();

// === GÉNÉRATION DES POINTS D'ÉCHANTILLONNAGE ===
var water_samples = water_area.stratifiedSample({
  numPoints: 1500,
  classBand: null,
  region: matam,
  scale: 30,
  geometries: true,
  seed: 42
}).map(function(f){ return f.set('classvalue', 1); });

var non_water_samples = non_water_area.stratifiedSample({
  numPoints: 2500,
  classBand: null,
  region: matam,
  scale: 30,
  geometries: true,
  seed: 42
}).map(function(f){ return f.set('classvalue', 0); });

var all_samples = water_samples.merge(non_water_samples);

// === AJOUT D’UN SPLIT aléatoire train/test (80/20) ===
all_samples = all_samples.randomColumn('rand');

all_samples = all_samples.map(function(f){
  return f.set('split', ee.String(ee.Algorithms.If(f.getNumber('rand').lt(0.8), 'train', 'test')));
});

// === EXTRACTION DES VALEURS NDWI + SRTM ===
var labeled = image.sampleRegions({
  collection: all_samples,
  scale: 30,
  properties: ['classvalue', 'split'],
  geometries: true
});


// Visualisation
Map.centerObject(matam, 10);
Map.addLayer( image.select('NDWI'), {min: -1, max: 1}, 'NDWI');
Map.addLayer( image.select('elevation'), {min: 0, max: 300}, 'Élévation');

// Export
Export.image.toDrive({
  image:  image.toFloat(),
  description: 'NDWI_SRTM_Matam_2024',
  folder: 'GEE_DATA_DL_CGN',
  fileNamePrefix: 'Matam_NDWI_SRTM_2024',
  region: matam.geometry(),
  scale: 30,
  maxPixels: 1e13
});



// === EXPORT VERS GOOGLE DRIVE EN CSV ===
Export.table.toDrive({
  collection: labeled,
  fileFormat: 'CSV',
  folder: 'GEE_DATA_DL_CGN',
  selectors: ['NDWI', 'elevation', 'classvalue', 'split', '.geo'],
  description: 'Samples_NDWI_SRTM_Matam_Final_3500'
});
