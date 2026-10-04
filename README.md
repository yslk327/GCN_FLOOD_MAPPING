# GCN-Based Flood Mapping

## Deep Learning for Flood Mapping Using Spatial Graph Convolutional Networks

This repository contains the source code, notebooks, and datasets used for **flood mapping using a Graph Convolutional Network (GCN)** applied to satellite-derived geospatial data.

The workflow was developed for the analysis of the **October 2024 flood event in the Matam region, Senegal**, using spectral and topographic information derived from remote sensing data.

The main objective is to investigate how **graph-based deep learning** can exploit spatial relationships between homogeneous landscape units for flood/non-flood classification.

---

## 📌 Overview

Accurate and timely flood mapping is essential for disaster management, emergency response, and risk assessment.

Conventional image-based deep learning approaches, such as Convolutional Neural Networks (CNNs), represent geographical information using regular grid structures. However, flood dynamics are influenced by spatial relationships that are not necessarily aligned with a regular image grid.

This repository implements a graph-based workflow in which:

1. Remote sensing data are prepared and analysed.
2. Flood-related spectral information is extracted using the **Normalized Difference Water Index (NDWI)**.
3. Topographic information is incorporated using **SRTM-derived elevation data**.
4. The study area is segmented into spatially homogeneous **superpixels**.
5. Superpixels are represented as nodes of a spatial graph.
6. Relationships between neighbouring superpixels are represented by graph edges.
7. A **Graph Convolutional Network (GCN)** is trained to classify the graph nodes into flood and non-flood classes.
8. The trained model is used to produce a spatial flood map.

---

## 🗺️ Study Area

The study focuses on the **Matam region in Senegal**, an area located within the Senegal River valley and characterized by extensive alluvial and flood-prone environments.

The repository includes data associated with the **October 2024 flood event**.

The reference flood extent used in the workflow is represented by:

```text
WaterExtent_MatamDepartment_PolygonToRaster_20241025.tif
```

---

## 🧠 Methodology

The general processing workflow is:

```text
Remote Sensing Data
        │
        ├── NDWI
        │
        └── SRTM Elevation
                │
                ▼
       Feature Preparation
                │
                ▼
       Spatial Segmentation
          (Superpixels)
                │
                ▼
        Spatial Graph
      ┌─────────────────┐
      │ Nodes           │
      │ = Superpixels   │
      │                 │
      │ Edges           │
      │ = Spatial       │
      │ relationships   │
      └─────────────────┘
                │
                ▼
       Graph Convolutional
           Network (GCN)
                │
                ▼
      Flood / Non-Flood
          Classification
                │
                ▼
         Flood Mapping
```

### Input features

The main spatial features used in the workflow include:

* **NDWI** – spectral information related to surface water;
* **SRTM elevation** – topographic information;
* Spatial information derived from the segmentation of the study area.

---

## 📂 Repository Structure

The repository is organized as follows:

```text
GCN_FLOOD_MAPPING/
│
├── 1-analyse_distribution_ndwi.ipynb
│
├── 1-export_tif_csv_3500_matam.js
│
├── 2-segmentation_associate_labels_superpixels.ipynb
│
├── 3-construct_CGN_graph.ipynb
│
├── 4-Train_GCN_Model.ipynb
│
├── 5-Prediction_GCN_Superpixels.ipynb
│
├── Matam_NDWI_SRTM_2024.tif
│
├── Samples_DL_Matam_10_2024_700_points.csv
│
├── Samples_NDWI_SRTM_Matam_Final_3500.csv
│
└── WaterExtent_MatamDepartment_PolygonToRaster_20241025.tif
```

---

## 🔬 Processing Pipeline

### 1. NDWI Analysis

**Notebook:**

```text
1-analyse_distribution_ndwi.ipynb
```

This notebook analyses the distribution of NDWI values and supports the preparation and interpretation of the spectral information used in the flood-mapping workflow.

---

### 2. Data Export

**Script:**

```text
1-export_tif_csv_3500_matam.js
```

This Google Earth Engine script is used to prepare/export the geospatial data and samples required for subsequent processing.

The exported data are subsequently used in the Python-based workflow.

---

### 3. Superpixel Segmentation and Label Association

**Notebook:**

```text
2-segmentation_associate_labels_superpixels.ipynb
```

This step segments the study area into spatially homogeneous units and associates the available flood/non-flood reference information with the resulting superpixels.

The superpixels provide the spatial units that will later become the nodes of the graph.

---

### 4. Spatial Graph Construction

**Notebook:**

```text
3-construct_CGN_graph.ipynb
```

This notebook constructs the graph representation of the study area.

The graph is composed of:

* **Nodes:** spatial superpixels;
* **Node features:** spectral and topographic information;
* **Edges:** spatial relationships between neighbouring superpixels.

This representation allows the GCN to perform learning directly on the spatial structure of the study area.

---

### 5. GCN Model Training

**Notebook:**

```text
4-Train_GCN_Model.ipynb
```

This notebook contains the training stage of the Graph Convolutional Network.

The model learns to classify graph nodes according to their flood/non-flood characteristics.

The resulting trained model can subsequently be used for spatial prediction.

---

### 6. Flood Prediction

**Notebook:**

```text
5-Prediction_GCN_Superpixels.ipynb
```

The final notebook applies the trained GCN to the spatial graph and generates predictions for the superpixels.

The predicted classes can then be converted into a spatial flood map.

---

## 📊 Data

The repository includes the following main datasets.

### NDWI and SRTM raster

```text
Matam_NDWI_SRTM_2024.tif
```

This raster contains the spatial information used as input to the subsequent processing steps.

### Training samples

```text
Samples_DL_Matam_10_2024_700_points.csv
```

Sample points used for the deep-learning workflow.

### NDWI/SRTM samples

```text
Samples_NDWI_SRTM_Matam_Final_3500.csv
```

A larger set of samples containing the information used to construct the learning dataset.

### Reference flood extent

```text
WaterExtent_MatamDepartment_PolygonToRaster_20241025.tif
```

Rasterized reference flood extent used for the flood-mapping workflow.

---

## 🛠️ Technologies

The workflow combines geospatial processing, remote sensing, and deep learning technologies.

### Main technologies

* Python
* Jupyter Notebook
* Google Earth Engine
* Graph Neural Networks
* Graph Convolutional Networks (GCN)
* Remote Sensing
* Geographic Information Systems (GIS)
* NDWI
* SRTM Digital Elevation Model
* Superpixel segmentation

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yslk327/GCN_FLOOD_MAPPING.git
```

```bash
cd GCN_FLOOD_MAPPING
```

### 2. Open the notebooks

The notebooks can be opened using Jupyter Notebook, JupyterLab, or Google Colab.

A recommended execution order is:

```text
1-analyse_distribution_ndwi.ipynb
        ↓
1-export_tif_csv_3500_matam.js
        ↓
2-segmentation_associate_labels_superpixels.ipynb
        ↓
3-construct_CGN_graph.ipynb
        ↓
4-Train_GCN_Model.ipynb
        ↓
5-Prediction_GCN_Superpixels.ipynb
```

> **Note:** The Google Earth Engine script requires access to Google Earth Engine and appropriate authentication/configuration.

---

## 🔗 Reproducibility

The repository is intended to support the reproducibility of the proposed GCN-based flood-mapping workflow.

For reproducibility, users should execute the processing stages in the indicated order and ensure that the required Python and geospatial/deep-learning libraries are installed.

Because the workflow relies on geospatial raster and vector information, appropriate spatial reference systems and raster alignment should be maintained throughout the processing chain.

---

## 🎯 Research Objectives

The repository supports research into:

* Flood extent mapping from Earth Observation data;
* Deep learning for disaster management;
* Graph Neural Networks for geospatial applications;
* Spatially structured flood classification;
* Integration of spectral and topographic information;
* Remote sensing-based disaster assessment;
* Geo Big Data and AI for natural disaster management.

---

## 📚 Scientific Context

The approach is motivated by the limitations of representing geographical information exclusively as regular image grids.

Instead of treating each pixel independently or relying only on conventional grid-based convolutions, the proposed workflow represents spatially homogeneous regions as graph nodes and explicitly models their spatial relationships.

This provides a framework for investigating **non-Euclidean spatial learning** for flood mapping.

---

## 👤 Author

**Yassine Loukili**

Researcher in Geospatial Artificial Intelligence, Remote Sensing, Geo Big Data, and Deep Learning for Natural Disaster Management.

**LaRSI – Université Sidi Mohamed Ben Abdellah (USMBA), Fez, Morocco**

GitHub:
https://github.com/yslk327

---

## 📖 Related Research

This repository accompanies research on:

> **Towards Accurate Flood Mapping: A Deep Learning Approach with Spatial Graph Convolutional Networks**

The work investigates the use of spatial graph representations and Graph Convolutional Networks for flood mapping using satellite-derived spectral and topographic information.

---

⭐ If you find this repository useful for your research, please consider citing the associated scientific publication and/or acknowledging this repository.
