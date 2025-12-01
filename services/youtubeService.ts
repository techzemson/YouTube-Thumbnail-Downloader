import { ThumbnailVariant, VideoData } from '../types';

export const extractVideoId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export const generateThumbnails = (videoId: string): ThumbnailVariant[] => {
  const baseUrl = `https://img.youtube.com/vi/${videoId}`;
  
  return [
    {
      label: 'Maximum Resolution',
      resolution: '1280 x 720 (HD/4K Source)',
      url: `${baseUrl}/maxresdefault.jpg`,
      key: 'maxres',
      isBest: true
    },
    {
      label: 'High Quality',
      resolution: '640 x 480',
      url: `${baseUrl}/sddefault.jpg`,
      key: 'sd'
    },
    {
      label: 'Medium Quality',
      resolution: '480 x 360',
      url: `${baseUrl}/hqdefault.jpg`,
      key: 'hq'
    },
    {
      label: 'Standard Quality',
      resolution: '320 x 180',
      url: `${baseUrl}/mqdefault.jpg`,
      key: 'mq'
    },
    {
      label: 'Default',
      resolution: '120 x 90',
      url: `${baseUrl}/default.jpg`,
      key: 'default'
    }
  ];
};

export const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
  try {
    // Note: This relies on the image server allowing CORS or using a proxy. 
    // YouTube img servers are generally permissive for GET requests.
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g. "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw new Error("Could not fetch image for AI analysis. Access restriction.");
  }
};
