#!/usr/bin/env python3
"""
link_strives_images.py
Maps downloaded strives product images to products in:
- src/data/fullCatalogData.json
- src/data/initialProducts.js
"""

import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STRIVES_DIR = os.path.join(BASE_DIR, 'public', 'strives')
IMAGES_DIR = os.path.join(STRIVES_DIR, 'images')
FULL_CATALOG_PATH = os.path.join(BASE_DIR, 'src', 'data', 'fullCatalogData.json')
INITIAL_PRODUCTS_PATH = os.path.join(BASE_DIR, 'src', 'data', 'initialProducts.js')
REPORT_PATH = os.path.join(STRIVES_DIR, 'catalog_image_links.json')

# Full explicit mapping of catalog ID -> primary image + optional gallery list
PRODUCT_MAPPINGS = {
    # 0. Diamond Glow
    'mob-cat-0008': {
        'image': '/strives/images/prod_00_Diamond_Glow_-_Lait_Traitant_Prestige.png',
        'gallery': ['/strives/images/prod_00_Diamond_Glow_-_Lait_Traitant_Prestige.png']
    },

    # 1. Fair & White FB Royal / Supreme
    'mob-cat-0194': {
        'image': '/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_01.jpg',
        'gallery': [
            '/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_01.jpg',
            '/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_03.jpg',
            '/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_05.jpg'
        ]
    },
    'mob-cat-0176': {
        'image': '/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_02.jpg',
        'gallery': [
            '/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_02.jpg',
            '/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_04.jpg',
            '/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_06.jpg'
        ]
    },
    'mob-cat-0195': {
        'image': '/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_03.jpg',
        'gallery': ['/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_03.jpg']
    },
    'mob-cat-0179': {
        'image': '/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_04.jpg',
        'gallery': ['/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_04.jpg']
    },
    'mob-cat-0196': {
        'image': '/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_05.jpg',
        'gallery': ['/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_05.jpg']
    },
    'mob-cat-0177': {
        'image': '/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_06.jpg',
        'gallery': ['/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_06.jpg']
    },
    'mob-cat-0197': {
        'image': '/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_07.jpg',
        'gallery': ['/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_07.jpg']
    },
    'mob-cat-0180': {
        'image': '/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_08.jpg',
        'gallery': ['/strives/images/cat_05_Fair_White_FB_Royal_FB_Supreme_-_Lait_Corps_08.jpg']
    },

    # 2. Fair & White Luxury Carrot / Amande
    'mob-cat-0174': {
        'image': '/strives/images/cat_06_Fair_White_Luxury_Carrot_Amande_-_Lait_01.jpg',
        'gallery': [
            '/strives/images/cat_06_Fair_White_Luxury_Carrot_Amande_-_Lait_01.jpg',
            '/strives/images/cat_06_Fair_White_Luxury_Carrot_Amande_-_Lait_03.jpg'
        ]
    },
    'mob-cat-0172': {
        'image': '/strives/images/cat_06_Fair_White_Luxury_Carrot_Amande_-_Lait_02.jpg',
        'gallery': [
            '/strives/images/cat_06_Fair_White_Luxury_Carrot_Amande_-_Lait_02.jpg',
            '/strives/images/cat_06_Fair_White_Luxury_Carrot_Amande_-_Lait_04.jpg'
        ]
    },
    'mob-cat-0175': {
        'image': '/strives/images/cat_06_Fair_White_Luxury_Carrot_Amande_-_Lait_03.jpg',
        'gallery': ['/strives/images/cat_06_Fair_White_Luxury_Carrot_Amande_-_Lait_03.jpg']
    },
    'mob-cat-0173': {
        'image': '/strives/images/cat_06_Fair_White_Luxury_Carrot_Amande_-_Lait_04.jpg',
        'gallery': ['/strives/images/cat_06_Fair_White_Luxury_Carrot_Amande_-_Lait_04.jpg']
    },

    # 3. Vaseline Almond Smooth
    'mob-cat-0269': {
        'image': '/strives/images/prod_07_Vaseline_Almond_Smooth.jpg',
        'gallery': ['/strives/images/prod_07_Vaseline_Almond_Smooth.jpg']
    },

    # 4. Jergens Shea Butter
    'mob-cat-0280': {
        'image': '/strives/images/cat_09_Jergens_Shea_Butter_01.png',
        'gallery': [
            '/strives/images/cat_09_Jergens_Shea_Butter_01.png',
            '/strives/images/cat_09_Jergens_Shea_Butter_02.png'
        ]
    },
    'mob-cat-0281': {
        'image': '/strives/images/cat_09_Jergens_Shea_Butter_02.png',
        'gallery': ['/strives/images/cat_09_Jergens_Shea_Butter_02.png']
    },
    'mob-cat-0282': {
        'image': '/strives/images/cat_09_Jergens_Shea_Butter_03.png',
        'gallery': ['/strives/images/cat_09_Jergens_Shea_Butter_03.png']
    },
    'mob-cat-0283': {
        'image': '/strives/images/cat_09_Jergens_Shea_Butter_04.png',
        'gallery': ['/strives/images/cat_09_Jergens_Shea_Butter_04.png']
    },

    # 5. Paula's Choice
    'mob-cat-0754': {
        'image': '/strives/images/prod_10_Paula_s_Choice_-_S_rum_Niacinamide_20.jpg',
        'gallery': ['/strives/images/prod_10_Paula_s_Choice_-_S_rum_Niacinamide_20.jpg']
    },
    'mob-cat-0882': {
        'image': '/strives/images/prod_10_Paula_s_Choice_-_S_rum_Niacinamide_20.jpg',
        'gallery': ['/strives/images/prod_10_Paula_s_Choice_-_S_rum_Niacinamide_20.jpg']
    },
    'mob-cat-0886': {
        'image': '/strives/images/prod_10_Paula_s_Choice_-_S_rum_Niacinamide_20.jpg',
        'gallery': ['/strives/images/prod_10_Paula_s_Choice_-_S_rum_Niacinamide_20.jpg']
    },

    # 6. Glow Recipe Watermelon
    'mob-cat-0734': {
        'image': '/strives/images/prod_11_Glow_Recipe_-_Watermelon_Niacinamide_Dew_Drops.jpg',
        'gallery': ['/strives/images/prod_11_Glow_Recipe_-_Watermelon_Niacinamide_Dew_Drops.jpg']
    },

    # 7. Glow Recipe Guava
    'mob-cat-0684': {
        'image': '/strives/images/cat_12_Glow_Recipe_-_Guava_01.png',
        'gallery': [
            '/strives/images/cat_12_Glow_Recipe_-_Guava_01.png',
            '/strives/images/cat_12_Glow_Recipe_-_Guava_02.jpg'
        ]
    },
    'mob-cat-0686': {
        'image': '/strives/images/cat_12_Glow_Recipe_-_Guava_02.jpg',
        'gallery': ['/strives/images/cat_12_Glow_Recipe_-_Guava_02.jpg']
    },

    # 8. Anua Niacinamide 10% TXA 4%
    'mob-cat-0702': {
        'image': '/strives/images/prod_13_Anua_-_Niacinamide_10_TXA_4.jpg',
        'gallery': ['/strives/images/prod_13_Anua_-_Niacinamide_10_TXA_4.jpg']
    },
    'mob-cat-0703': {
        'image': '/strives/images/prod_13_Anua_-_Niacinamide_10_TXA_4.jpg',
        'gallery': ['/strives/images/prod_13_Anua_-_Niacinamide_10_TXA_4.jpg']
    },
    'mob-cat-0833': {
        'image': '/strives/images/prod_13_Anua_-_Niacinamide_10_TXA_4.jpg',
        'gallery': ['/strives/images/prod_13_Anua_-_Niacinamide_10_TXA_4.jpg']
    },

    # 9. Beauty of Joseon Glow Serum
    'mob-cat-0697': {
        'image': '/strives/images/prod_14_Beauty_of_Joseon_-_Glow_Serum_Propolis_Niacinamide.webp',
        'gallery': ['/strives/images/prod_14_Beauty_of_Joseon_-_Glow_Serum_Propolis_Niacinamide.webp']
    },
    'mob-cat-0698': {
        'image': '/strives/images/prod_14_Beauty_of_Joseon_-_Glow_Serum_Propolis_Niacinamide.webp',
        'gallery': ['/strives/images/prod_14_Beauty_of_Joseon_-_Glow_Serum_Propolis_Niacinamide.webp']
    },
    'mob-cat-0836': {
        'image': '/strives/images/prod_14_Beauty_of_Joseon_-_Glow_Serum_Propolis_Niacinamide.webp',
        'gallery': ['/strives/images/prod_14_Beauty_of_Joseon_-_Glow_Serum_Propolis_Niacinamide.webp']
    },

    # 10. COSRX AHA BHA Vit C
    'mob-cat-0683': {
        'image': '/strives/images/prod_15_COSRX_-_AHA_BHA_Vitamin_C_Booster.jpg',
        'gallery': ['/strives/images/prod_15_COSRX_-_AHA_BHA_Vitamin_C_Booster.jpg']
    },
    'mob-cat-0858': {
        'image': '/strives/images/prod_15_COSRX_-_AHA_BHA_Vitamin_C_Booster.jpg',
        'gallery': ['/strives/images/prod_15_COSRX_-_AHA_BHA_Vitamin_C_Booster.jpg']
    },

    # 11 & 12. Good Molecules Discoloration Correcting Serum
    'mob-cat-0682': {
        'image': '/strives/images/prod_16_Good_Molecules_-_Discoloration_Correcting_Serum_30.jpg',
        'gallery': ['/strives/images/prod_16_Good_Molecules_-_Discoloration_Correcting_Serum_30.jpg']
    },
    'mob-cat-0830': {
        'image': '/strives/images/prod_17_Good_Molecules_-_Discoloration_Correcting_Serum_75.jpg',
        'gallery': ['/strives/images/prod_17_Good_Molecules_-_Discoloration_Correcting_Serum_75.jpg']
    },
    'mob-cat-0856': {
        'image': '/strives/images/prod_17_Good_Molecules_-_Discoloration_Correcting_Serum_75.jpg',
        'gallery': ['/strives/images/prod_17_Good_Molecules_-_Discoloration_Correcting_Serum_75.jpg']
    },

    # 13. Beauty of Joseon Relief Sun Rice SPF50+
    'mob-cat-0784': {
        'image': '/strives/images/prod_19_Beauty_of_Joseon_-_Relief_Sun_Rice_SPF50.jpg',
        'gallery': ['/strives/images/prod_19_Beauty_of_Joseon_-_Relief_Sun_Rice_SPF50.jpg']
    },
    'mob-cat-0785': {
        'image': '/strives/images/prod_19_Beauty_of_Joseon_-_Relief_Sun_Rice_SPF50.jpg',
        'gallery': ['/strives/images/prod_19_Beauty_of_Joseon_-_Relief_Sun_Rice_SPF50.jpg']
    },

    # 14. Round Lab Birch Juice SPF50+
    'mob-cat-0787': {
        'image': '/strives/images/prod_20_Round_Lab_-_Birch_Juice_Moisturizing_Sun_Cream_SPF.png',
        'gallery': ['/strives/images/prod_20_Round_Lab_-_Birch_Juice_Moisturizing_Sun_Cream_SPF.png']
    },

    # 15. Tocobo Sun Stick SPF50+
    'mob-cat-0786': {
        'image': '/strives/images/prod_20_Tocobo_-_Cotton_Soft_Sun_Stick_SPF50.jpg',
        'gallery': ['/strives/images/prod_20_Tocobo_-_Cotton_Soft_Sun_Stick_SPF50.jpg']
    },

    # 16. Centella Probio-Cica Enrich Cream & Sunscreens
    'mob-cat-0818': {
        'image': '/strives/images/cat_22_Centella_-_Probio-Cica_Enrich_Cream_02.png',
        'gallery': [
            '/strives/images/cat_22_Centella_-_Probio-Cica_Enrich_Cream_02.png',
            '/strives/images/cat_22_Centella_-_Probio-Cica_Enrich_Cream_03.png'
        ]
    },
    'mob-cat-0792': {
        'image': '/strives/images/cat_22_Centella_-_Probio-Cica_Enrich_Cream_03.png',
        'gallery': ['/strives/images/cat_22_Centella_-_Probio-Cica_Enrich_Cream_03.png']
    },
    'mob-cat-0791': {
        'image': '/strives/images/cat_22_Centella_-_Probio-Cica_Enrich_Cream_04.png',
        'gallery': ['/strives/images/cat_22_Centella_-_Probio-Cica_Enrich_Cream_04.png']
    },
    'mob-cat-0805': {
        'image': '/strives/images/cat_22_Centella_-_Probio-Cica_Enrich_Cream_05.png',
        'gallery': ['/strives/images/cat_22_Centella_-_Probio-Cica_Enrich_Cream_05.png']
    },
    'mob-cat-0838': {
        'image': '/strives/images/cat_22_Centella_-_Probio-Cica_Enrich_Cream_06.png',
        'gallery': ['/strives/images/cat_22_Centella_-_Probio-Cica_Enrich_Cream_06.png']
    },

    # 17. Clinique Moisture Surge 100H
    'mob-cat-0426': {
        'image': '/strives/images/prod_23_Clinique_-_Moisture_Surge_100H.jpg',
        'gallery': ['/strives/images/prod_23_Clinique_-_Moisture_Surge_100H.jpg']
    },
    'mob-cat-0417': {
        'image': '/strives/images/prod_23_Clinique_-_Moisture_Surge_100H.jpg',
        'gallery': ['/strives/images/prod_23_Clinique_-_Moisture_Surge_100H.jpg']
    },

    # 18. SheaMoisture Jamaican Black Castor Oil
    'mob-cat-0955': {
        'image': '/strives/images/prod_24_SheaMoisture_-_Jamaican_Black_Castor_Oil_Treatment.jpg',
        'gallery': ['/strives/images/prod_24_SheaMoisture_-_Jamaican_Black_Castor_Oil_Treatment.jpg']
    },
    'mob-cat-0552': {
        'image': '/strives/images/prod_24_SheaMoisture_-_Jamaican_Black_Castor_Oil_Treatment.jpg',
        'gallery': ['/strives/images/prod_24_SheaMoisture_-_Jamaican_Black_Castor_Oil_Treatment.jpg']
    },
    'mob-cat-0555': {
        'image': '/strives/images/prod_24_SheaMoisture_-_Jamaican_Black_Castor_Oil_Treatment.jpg',
        'gallery': ['/strives/images/prod_24_SheaMoisture_-_Jamaican_Black_Castor_Oil_Treatment.jpg']
    },

    # 19. SheaMoisture Masques capillaires & Soins
    'mob-cat-0512': {
        'image': '/strives/images/cat_25_SheaMoisture_-_Masques_capillaires_01.png',
        'gallery': [
            '/strives/images/cat_25_SheaMoisture_-_Masques_capillaires_01.png',
            '/strives/images/cat_25_SheaMoisture_-_Masques_capillaires_02.jpg'
        ]
    },
    'mob-cat-0511': {
        'image': '/strives/images/cat_25_SheaMoisture_-_Masques_capillaires_02.jpg',
        'gallery': ['/strives/images/cat_25_SheaMoisture_-_Masques_capillaires_02.jpg']
    },
    'mob-cat-0497': {
        'image': '/strives/images/cat_25_SheaMoisture_-_Masques_capillaires_03.jpg',
        'gallery': ['/strives/images/cat_25_SheaMoisture_-_Masques_capillaires_03.jpg']
    },
    'mob-cat-0498': {
        'image': '/strives/images/cat_25_SheaMoisture_-_Masques_capillaires_04.jpg',
        'gallery': ['/strives/images/cat_25_SheaMoisture_-_Masques_capillaires_04.jpg']
    },
    'mob-cat-0499': {
        'image': '/strives/images/cat_25_SheaMoisture_-_Masques_capillaires_05.jpg',
        'gallery': ['/strives/images/cat_25_SheaMoisture_-_Masques_capillaires_05.jpg']
    },
    'mob-cat-0500': {
        'image': '/strives/images/cat_25_SheaMoisture_-_Masques_capillaires_06.jpg',
        'gallery': ['/strives/images/cat_25_SheaMoisture_-_Masques_capillaires_06.jpg']
    },

    # 20. Activilong Shampooing Karité & Soins
    'mob-cat-0549': {
        'image': '/strives/images/cat_26_Activilong_-_Shampooing_Karit_01.jpg',
        'gallery': [
            '/strives/images/cat_26_Activilong_-_Shampooing_Karit_01.jpg',
            '/strives/images/cat_26_Activilong_-_Shampooing_Karit_02.jpg'
        ]
    },
    'mob-cat-0559': {
        'image': '/strives/images/cat_26_Activilong_-_Shampooing_Karit_02.jpg',
        'gallery': ['/strives/images/cat_26_Activilong_-_Shampooing_Karit_02.jpg']
    },
    'mob-cat-0550': {
        'image': '/strives/images/cat_26_Activilong_-_Shampooing_Karit_03.jpg',
        'gallery': ['/strives/images/cat_26_Activilong_-_Shampooing_Karit_03.jpg']
    },
    'mob-cat-0554': {
        'image': '/strives/images/cat_26_Activilong_-_Shampooing_Karit_04.jpg',
        'gallery': ['/strives/images/cat_26_Activilong_-_Shampooing_Karit_04.jpg']
    },

    # 21. Activilong Kit de Lissage
    'mob-cat-0562': {
        'image': '/strives/images/cat_27_Activilong_-_Kit_de_Lissage_Prot_ine_01.jpg',
        'gallery': [
            '/strives/images/cat_27_Activilong_-_Kit_de_Lissage_Prot_ine_01.jpg',
            '/strives/images/cat_27_Activilong_-_Kit_de_Lissage_Prot_ine_02.jpg'
        ]
    },
    'mob-cat-0551': {
        'image': '/strives/images/cat_27_Activilong_-_Kit_de_Lissage_Prot_ine_02.jpg',
        'gallery': ['/strives/images/cat_27_Activilong_-_Kit_de_Lissage_Prot_ine_02.jpg']
    },

    # 22. Aunt Jackie's Curl La La
    'mob-cat-0956': {
        'image': '/strives/images/cat_28_Aunt_Jackie_s_-_Curl_La_La_01.webp',
        'gallery': [
            '/strives/images/cat_28_Aunt_Jackie_s_-_Curl_La_La_01.webp',
            '/strives/images/cat_28_Aunt_Jackie_s_-_Curl_La_La_02.jpg'
        ]
    },

    # 23. Aunt Jackie's In Control
    'mob-cat-0958': {
        'image': '/strives/images/prod_29_Aunt_Jackie_s_-_In_Control.jpg',
        'gallery': ['/strives/images/prod_29_Aunt_Jackie_s_-_In_Control.jpg']
    },

    # 24. Mega Growth Kit Défrisant Pro
    'mob-cat-0540': {
        'image': '/strives/images/prod_31_Mega_Growth_-_Kit_D_frisant_Pro.png',
        'gallery': ['/strives/images/prod_31_Mega_Growth_-_Kit_D_frisant_Pro.png']
    },
    'mob-cat-0951': {
        'image': '/strives/images/prod_31_Mega_Growth_-_Kit_D_frisant_Pro.png',
        'gallery': ['/strives/images/prod_31_Mega_Growth_-_Kit_D_frisant_Pro.png']
    },

    # 25. Mega Growth Kit Défrisant Sensible & Soins
    'mob-cat-0952': {
        'image': '/strives/images/prod_32_Mega_Growth_-_Kit_D_frisant_Sensible.png',
        'gallery': ['/strives/images/prod_32_Mega_Growth_-_Kit_D_frisant_Sensible.png']
    },
    'mob-cat-0949': {
        'image': '/strives/images/prod_32_Mega_Growth_-_Kit_D_frisant_Sensible.png',
        'gallery': ['/strives/images/prod_32_Mega_Growth_-_Kit_D_frisant_Sensible.png']
    },
    'mob-cat-0950': {
        'image': '/strives/images/prod_32_Mega_Growth_-_Kit_D_frisant_Sensible.png',
        'gallery': ['/strives/images/prod_32_Mega_Growth_-_Kit_D_frisant_Sensible.png']
    },

    # 26. Dark and Lovely Kids
    'mob-cat-0541': {
        'image': '/strives/images/cat_34_Dark_and_Lovely_Kids_01.jpg',
        'gallery': [
            '/strives/images/cat_34_Dark_and_Lovely_Kids_01.jpg',
            '/strives/images/cat_34_Dark_and_Lovely_Kids_02.jpg'
        ]
    },
    'mob-cat-0542': {
        'image': '/strives/images/cat_34_Dark_and_Lovely_Kids_02.jpg',
        'gallery': ['/strives/images/cat_34_Dark_and_Lovely_Kids_02.jpg']
    },
    'mob-cat-0543': {
        'image': '/strives/images/cat_34_Dark_and_Lovely_Kids_03.jpg',
        'gallery': ['/strives/images/cat_34_Dark_and_Lovely_Kids_03.jpg']
    },
    'mob-cat-0544': {
        'image': '/strives/images/cat_34_Dark_and_Lovely_Kids_04.jpg',
        'gallery': ['/strives/images/cat_34_Dark_and_Lovely_Kids_04.jpg']
    },

    # 27. Dark and Lovely Défrisants & Teinture
    'mob-cat-0548': {
        'image': '/strives/images/cat_35_Dark_and_Lovely_-_D_frisants_01.png',
        'gallery': [
            '/strives/images/cat_35_Dark_and_Lovely_-_D_frisants_01.png',
            '/strives/images/cat_35_Dark_and_Lovely_-_D_frisants_02.png'
        ]
    },
    'mob-cat-0464': {
        'image': '/strives/images/cat_35_Dark_and_Lovely_-_D_frisants_02.png',
        'gallery': ['/strives/images/cat_35_Dark_and_Lovely_-_D_frisants_02.png']
    },

    # 28. Acti Kid Démêlant et Shampooing
    'mob-cat-0556': {
        'image': '/strives/images/cat_36_Acti_Kid_-_D_m_lant_et_Shampooing_01.png',
        'gallery': [
            '/strives/images/cat_36_Acti_Kid_-_D_m_lant_et_Shampooing_01.png',
            '/strives/images/cat_36_Acti_Kid_-_D_m_lant_et_Shampooing_02.png'
        ]
    },
    'mob-cat-0557': {
        'image': '/strives/images/cat_36_Acti_Kid_-_D_m_lant_et_Shampooing_02.png',
        'gallery': ['/strives/images/cat_36_Acti_Kid_-_D_m_lant_et_Shampooing_02.png']
    },
    'mob-cat-0561': {
        'image': '/strives/images/cat_36_Acti_Kid_-_D_m_lant_et_Shampooing_03.png',
        'gallery': ['/strives/images/cat_36_Acti_Kid_-_D_m_lant_et_Shampooing_03.png']
    },

    # 29. Rare Beauty Fond de teint
    'mob-cat-0968': {
        'image': '/strives/images/cat_43_Rare_Beauty_-_Fond_de_teint_01.png',
        'gallery': [
            '/strives/images/cat_43_Rare_Beauty_-_Fond_de_teint_01.png',
            '/strives/images/cat_43_Rare_Beauty_-_Fond_de_teint_02.png'
        ]
    },

    # 30. Huda Beauty Fond de teint 455R / 430N
    'mob-cat-0970': {
        'image': '/strives/images/cat_44_Huda_Beauty_-_Fond_de_teint_teinte_455R_01.png',
        'gallery': [
            '/strives/images/cat_44_Huda_Beauty_-_Fond_de_teint_teinte_455R_01.png',
            '/strives/images/cat_44_Huda_Beauty_-_Fond_de_teint_teinte_455R_02.png'
        ]
    },
    'mob-cat-0969': {
        'image': '/strives/images/cat_44_Huda_Beauty_-_Fond_de_teint_teinte_455R_02.png',
        'gallery': ['/strives/images/cat_44_Huda_Beauty_-_Fond_de_teint_teinte_455R_02.png']
    },

    # 31. Milk Makeup Hydro Grip Primer & Bronzer
    'mob-cat-0965': {
        'image': '/strives/images/prod_45_Milk_Makeup_-_Hydro_Grip_Primer.jpg',
        'gallery': ['/strives/images/prod_45_Milk_Makeup_-_Hydro_Grip_Primer.jpg']
    },
    'mob-cat-0967': {
        'image': '/strives/images/prod_45_Milk_Makeup_-_Hydro_Grip_Primer.jpg',
        'gallery': ['/strives/images/prod_45_Milk_Makeup_-_Hydro_Grip_Primer.jpg']
    },

    # 32. Benefit Cosmetics The POREfessional
    'mob-cat-0962': {
        'image': '/strives/images/prod_46_Benefit_Cosmetics_-_The_POREfessional.jpg',
        'gallery': ['/strives/images/prod_46_Benefit_Cosmetics_-_The_POREfessional.jpg']
    },
    'mob-cat-0963': {
        'image': '/strives/images/prod_46_Benefit_Cosmetics_-_The_POREfessional.jpg',
        'gallery': ['/strives/images/prod_46_Benefit_Cosmetics_-_The_POREfessional.jpg']
    },
    'mob-cat-0964': {
        'image': '/strives/images/prod_46_Benefit_Cosmetics_-_The_POREfessional.jpg',
        'gallery': ['/strives/images/prod_46_Benefit_Cosmetics_-_The_POREfessional.jpg']
    },

    # 33. MAC Studio Fix Powder Plus Foundation
    'mob-cat-0973': {
        'image': '/strives/images/prod_47_MAC_-_Studio_Fix_Powder_Plus_Foundation.png',
        'gallery': ['/strives/images/prod_47_MAC_-_Studio_Fix_Powder_Plus_Foundation.png']
    },
    'mob-cat-0974': {
        'image': '/strives/images/prod_47_MAC_-_Studio_Fix_Powder_Plus_Foundation.png',
        'gallery': ['/strives/images/prod_47_MAC_-_Studio_Fix_Powder_Plus_Foundation.png']
    },
    'mob-cat-0975': {
        'image': '/strives/images/prod_47_MAC_-_Studio_Fix_Powder_Plus_Foundation.png',
        'gallery': ['/strives/images/prod_47_MAC_-_Studio_Fix_Powder_Plus_Foundation.png']
    },

    # 34. L.A. Girl HD PRO.conceal
    'mob-cat-0988': {
        'image': '/strives/images/prod_48_L_A_Girl_-_HD_PRO_conceal.jpg',
        'gallery': ['/strives/images/prod_48_L_A_Girl_-_HD_PRO_conceal.jpg']
    },

    # 35. OLLY Women's Multi
    'mob-cat-0431': {
        'image': '/strives/images/cat_49_OLLY_-_Women_s_Multi_01.jpg',
        'gallery': [
            '/strives/images/cat_49_OLLY_-_Women_s_Multi_01.jpg',
            '/strives/images/cat_49_OLLY_-_Women_s_Multi_02.jpg'
        ]
    },

    # 36. OLLY Libido
    'mob-cat-0432': {
        'image': '/strives/images/cat_50_OLLY_-_Libido_01.jpg',
        'gallery': [
            '/strives/images/cat_50_OLLY_-_Libido_01.jpg',
            '/strives/images/cat_50_OLLY_-_Libido_02.jpg'
        ]
    },

    # 37. OLLY Collagen & Skin Beauty
    'mob-cat-0433': {
        'image': '/strives/images/cat_51_OLLY_-_Collagen_Skin_Beauty_01.jpg',
        'gallery': [
            '/strives/images/cat_51_OLLY_-_Collagen_Skin_Beauty_01.jpg',
            '/strives/images/cat_51_OLLY_-_Collagen_Skin_Beauty_02.jpg'
        ]
    },
    'mob-cat-0434': {
        'image': '/strives/images/cat_51_OLLY_-_Collagen_Skin_Beauty_02.jpg',
        'gallery': ['/strives/images/cat_51_OLLY_-_Collagen_Skin_Beauty_02.jpg']
    },
    'mob-cat-0435': {
        'image': '/strives/images/cat_51_OLLY_-_Collagen_Skin_Beauty_03.png',
        'gallery': ['/strives/images/cat_51_OLLY_-_Collagen_Skin_Beauty_03.png']
    },
    'mob-cat-0436': {
        'image': '/strives/images/cat_51_OLLY_-_Collagen_Skin_Beauty_04.png',
        'gallery': ['/strives/images/cat_51_OLLY_-_Collagen_Skin_Beauty_04.png']
    },

    # 38. Goli Superfruits
    'mob-cat-0446': {
        'image': '/strives/images/prod_52_Goli_Nutrition_-_Superfruits_Gummies.png',
        'gallery': ['/strives/images/prod_52_Goli_Nutrition_-_Superfruits_Gummies.png']
    },

    # 39. Nature Made Biotine & Collagen
    'mob-cat-0438': {
        'image': '/strives/images/cat_53_Nature_Made_-_Biotine_Collagen_01.png',
        'gallery': [
            '/strives/images/cat_53_Nature_Made_-_Biotine_Collagen_01.png',
            '/strives/images/cat_53_Nature_Made_-_Biotine_Collagen_02.png'
        ]
    },

    # 40. Nature Made Beauty Support Value Pack
    'mob-cat-0437': {
        'image': '/strives/images/prod_54_Nature_Made_-_Beauty_Support_Value_Pack.png',
        'gallery': ['/strives/images/prod_54_Nature_Made_-_Beauty_Support_Value_Pack.png']
    }
}

def verify_files_on_disk():
    missing = []
    checked = set()
    for cat_id, data in PRODUCT_MAPPINGS.items():
        all_imgs = [data['image']] + data.get('gallery', [])
        for rel_path in all_imgs:
            if rel_path in checked:
                continue
            checked.add(rel_path)
            disk_path = os.path.join(BASE_DIR, 'public', rel_path.lstrip('/'))
            if not os.path.exists(disk_path):
                missing.append(disk_path)
    if missing:
        print(f"ERROR: {len(missing)} image files missing on disk:")
        for m in missing[:5]:
            print("  ", m)
        sys.exit(1)
    print(f"Verification: all {len(checked)} distinct image files exist on disk.")

def update_full_catalog():
    with open(FULL_CATALOG_PATH, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    updated_count = 0
    for item in catalog:
        cat_id = item.get('id')
        if cat_id in PRODUCT_MAPPINGS:
            mapping = PRODUCT_MAPPINGS[cat_id]
            item['image'] = mapping['image']
            item['gallery'] = mapping['gallery']
            updated_count += 1
        elif 'image' not in item:
            item['image'] = None

    with open(FULL_CATALOG_PATH, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
        f.write('\n')

    print(f"Updated fullCatalogData.json: {updated_count} products assigned real images.")

def update_initial_products():
    with open(INITIAL_PRODUCTS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    prefix = "export const INITIAL_PRODUCTS = "
    json_part = content.split(prefix)[1].strip()
    if json_part.endswith(';'):
        json_part = json_part[:-1].strip()
    products = json.loads(json_part)

    prod_by_id = {p['id']: p for p in products}
    updated_count = 0

    for cat_id, mapping in PRODUCT_MAPPINGS.items():
        num = int(cat_id.replace('mob-cat-', ''))
        excel_id = f"mob-excel-{num}"
        if excel_id in prod_by_id:
            p = prod_by_id[excel_id]
            p['image'] = mapping['image']
            p['gallery'] = mapping['gallery']
            # Make sure these genuine photographed products are flagged prominently
            updated_count += 1

    new_content = f"{prefix}{json.dumps(products, indent=2, ensure_ascii=False)};\n"
    with open(INITIAL_PRODUCTS_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"Updated initialProducts.js: {updated_count} products updated with new image and gallery.")

def save_report():
    with open(FULL_CATALOG_PATH, 'r', encoding='utf-8') as f:
        full_cat = {p['id']: p for p in json.load(f)}

    report = []
    for cat_id, mapping in PRODUCT_MAPPINGS.items():
        p = full_cat.get(cat_id, {})
        num = int(cat_id.replace('mob-cat-', ''))
        excel_id = f"mob-excel-{num}"
        report.append({
            'catalog_id': cat_id,
            'excel_id': excel_id,
            'brand': p.get('brand', ''),
            'name': p.get('name', ''),
            'category': p.get('category', ''),
            'priceFormatted': p.get('priceFormatted', ''),
            'image': mapping['image'],
            'gallery_count': len(mapping['gallery'])
        })

    with open(REPORT_PATH, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
        f.write('\n')

    print(f"Generated report: {REPORT_PATH} ({len(report)} mapped items)")

if __name__ == '__main__':
    verify_files_on_disk()
    update_full_catalog()
    update_initial_products()
    save_report()
    print("Linking process completed successfully!")
