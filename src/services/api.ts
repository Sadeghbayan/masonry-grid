import { PhotosResponse, Photo } from '../types/Photo';

const API_KEY = 'Ruy8DvyUjdu3fKufxTYNf3ZJIjhDKXM7pjzxXXjQKDm6nbJ2SZhPmTTl'; // You need to provide your Pexels API key
const BASE_URL = 'https://api.pexels.com/v1';

export async function fetchPhotos(page: number = 1, perPage: number = 30): Promise<PhotosResponse> {
  try {
    const response = await fetch(`${BASE_URL}/curated?page=${page}&per_page=${perPage}`, {
      headers: {
        Authorization: API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching photos:', error);
    throw error;
  }
}

export async function searchPhotos(query: string, page: number = 1, perPage: number = 30): Promise<PhotosResponse> {
  try {
    const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`, {
      headers: {
        Authorization: API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching photos:', error);
    throw error;
  }
}

export async function getPhoto(id: number): Promise<Photo> {
  try {
    const response = await fetch(`${BASE_URL}/photos/${id}`, {
      headers: {
        Authorization: API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching photo details:', error);
    throw error;
  }
}