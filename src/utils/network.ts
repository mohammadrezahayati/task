import { FormStructure } from '@/types/formType';
import axios from 'axios';

const BASE_URL = 'https://assignment.devotel.io/api/insurance'
export const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Helps with CORS but backend must allow it
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    withCredentials: false, // Ensure no cookies are sent
});

// Fetch Form Structure
const fetchFormStructure = async (): Promise<FormStructure[]> => {
    try {
        const response = await API.get('/forms');
        console.log('Fetched Form Structure:', response.data); // Debugging log
        return response.data;
    } catch (error) {
        console.error('Error fetching form structure:', error);
        throw error;
    }
};

// Fetch Submitted Applications
const fetchSubmittedApplications = async (): Promise<unknown> => {
    try {
        const response = await API.get('/forms/submissions');
        console.log('Fetched Submitted Applications:', response.data); // Debugging log
        return response.data;
    } catch (error) {
        console.error('Error fetching submitted applications:', error);
        throw error;
    }
};

// Submit Application
const submitApplication = async (data: unknown): Promise<unknown> => {
    try {
        const response = await API.post('/forms/submit', data);
        console.log('Application Submitted:', response.data); // Debugging log
        return response.data;
    } catch (error) {
        console.error('Error submitting application:', error);
        throw error;
    }
};
export { fetchFormStructure, fetchSubmittedApplications, submitApplication };

