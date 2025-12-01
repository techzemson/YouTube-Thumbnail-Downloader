import { ThumbnailVariant } from '../types';

export const extractVideoId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export const generateThumbnails = (videoId: string): ThumbnailVariant[] => {
  const baseUrl = `https://img.youtube.com/vi/${videoId}`;
  const webpBaseUrl = `https://img.youtube.com/vi_webp/${videoId}`;
  
  return [
    {
      label: 'Maximum Resolution (HD/4K)',
      resolution: '1280 x 720',
      url: `${baseUrl}/maxresdefault.jpg`,
      key: 'maxres',
      isBest: true
    },
    {
      label: 'Standard Quality',
      resolution: '640 x 480',
      url: `${baseUrl}/sddefault.jpg`,
      key: 'sd'
    },
    {
      label: 'High Quality',
      resolution: '480 x 360',
      url: `${baseUrl}/hqdefault.jpg`,
      key: 'hq'
    },
    {
      label: 'Medium Quality',
      resolution: '320 x 180',
      url: `${baseUrl}/mqdefault.jpg`,
      key: 'mq'
    },
    {
      label: 'WebP Format',
      resolution: '640 x 480 (WebP)',
      url: `${webpBaseUrl}/sddefault.webp`,
      key: 'webp'
    }
  ];
};

export const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
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

export const downloadImageAs = async (imageUrl: string, filename: string, format: 'jpg' | 'png' | 'webp' = 'jpg') => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        // If format matches source (mostly jpg) or if raw blob is needed
        if (format === 'jpg' && (blob.type === 'image/jpeg' || blob.type === 'image/jpg')) {
            triggerDownload(blob, filename);
            return;
        }

        // Convert format using canvas
        const bitmap = await createImageBitmap(blob);
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Canvas context failed");
        
        ctx.drawImage(bitmap, 0, 0);
        
        const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
        canvas.toBlob((newBlob) => {
            if (newBlob) triggerDownload(newBlob, filename);
        }, mimeType, 1.0);

    } catch (e) {
        console.error("Download failed, falling back to direct link", e);
        window.open(imageUrl, '_blank');
    }
};

const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};