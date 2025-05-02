/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
// Add imports at the top
import axios from 'axios';

// Function to convert image to base64
const convertImageToBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Map Clarifai concepts to your categories
const mapClarifaiToCategory = (concept: string): string | null => {
  if (concept.includes('shirt') || concept.includes('jacket') || concept.includes('sweater')) {
    return 'top';
  }
  if (concept.includes('pants') || concept.includes('skirt') || concept.includes('jeans')) {
    return 'bottom';
  }
  if (concept.includes('shoe') || concept.includes('sneaker') || concept.includes('boot')) {
    return 'shoes';
  }
  return null;
};

// Classify image using Clarifai
const classifyImage = async (imageUri: string): Promise<string | null> => {
  try {
    const base64Image = await convertImageToBase64(imageUri);
    const base64Data = base64Image.split(',')[1]; // Remove "data:image/jpeg;base64," prefix

    const response = await axios.post(
      'https://api.clarifai.com/v2/models/apparel/outputs',
      {
        inputs: [
          {
            data: {
              image: {
                base64: base64Data,
              },
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Key 29292df4f4344695ab060c08897f6c1b`,
          'Content-Type': 'application/json',
        },
      }
    );

    const concepts = response.data.outputs[0].data.concepts;
    const topConcept = concepts[0].name; // Highest confidence concept
    const predictedCategory = mapClarifaiToCategory(topConcept);
    console.log('Clarifai Predicted Concept:', topConcept, 'Mapped Category:', predictedCategory);
    return predictedCategory;
  } catch (error) {
    console.error('Clarifai classification error:', error);
    return null;
  }
};
