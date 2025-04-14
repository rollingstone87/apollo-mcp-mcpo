import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Type definitions for Apollo.io API responses
export interface PeopleEnrichmentQuery {
  first_name?: string;
  last_name?: string;
  email?: string;
  domain?: string;
  organization_name?: string;
  [key: string]: any;
}

export interface OrganizationEnrichmentQuery {
  domain?: string;
  name?: string;
  [key: string]: any;
}

export interface PeopleSearchQuery {
  q_organization_domains_list?: string[];
  person_titles?: string[];
  person_seniorities?: string[];
  [key: string]: any;
}

export interface OrganizationSearchQuery {
  q_organization_domains_list?: string[];
  organization_locations?: string[];
  [key: string]: any;
}

export class ApolloClient {
  private apiKey: string;
  private baseUrl: string;
  private headers: Record<string, string>;
  private axiosInstance: AxiosInstance;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.APOLLO_IO_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('APOLLO_IO_API_KEY environment variable is required');
    }
    
    this.baseUrl = 'https://api.apollo.io/api/v1';
    this.headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${this.apiKey}`
    };

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: this.headers
    });
  }

  /**
   * Use the People Enrichment endpoint to enrich data for 1 person.
   * https://docs.apollo.io/reference/people-enrichment
   */
  async peopleEnrichment(query: PeopleEnrichmentQuery): Promise<any> {
    try {
      const url = `${this.baseUrl}/people/match`;
      const response = await this.axiosInstance.post(url, query);
      
      if (response.status === 200) {
        return response.data;
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return null;
      }
    } catch (error: any) {
      console.error(`Error: ${error.response?.status} - ${error.response?.statusText || error.message}`);
      return null;
    }
  }

  /**
   * Use the Organization Enrichment endpoint to enrich data for 1 company.
   * https://docs.apollo.io/reference/organization-enrichment
   */
  async organizationEnrichment(query: OrganizationEnrichmentQuery): Promise<any> {
    try {
      const url = `${this.baseUrl}/organizations/enrich`;
      const response = await this.axiosInstance.get(url, { params: query });
      
      if (response.status === 200) {
        return response.data;
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return null;
      }
    } catch (error: any) {
      console.error(`Error: ${error.response?.status} - ${error.response?.statusText || error.message}`);
      return null;
    }
  }

  /**
   * Use the People Search endpoint to find people.
   * https://docs.apollo.io/reference/people-search
   */
  async peopleSearch(query: PeopleSearchQuery): Promise<any> {
    try {
      const url = `${this.baseUrl}/mixed_people/search`;
      const response = await this.axiosInstance.post(url, query);
      
      if (response.status === 200) {
        return response.data;
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return null;
      }
    } catch (error: any) {
      console.error(`Error: ${error.response?.status} - ${error.response?.statusText || error.message}`);
      return null;
    }
  }

  /**
   * Use the Organization Search endpoint to find organizations.
   * https://docs.apollo.io/reference/organization-search
   */
  async organizationSearch(query: OrganizationSearchQuery): Promise<any> {
    try {
      const url = `${this.baseUrl}/mixed_companies/search`;
      const response = await this.axiosInstance.post(url, query);
      
      if (response.status === 200) {
        return response.data;
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return null;
      }
    } catch (error: any) {
      console.error(`Error: ${error.response?.status} - ${error.response?.statusText || error.message}`);
      return null;
    }
  }

  /**
   * Use the Organization Job Postings endpoint to find job postings for a specific organization.
   * https://docs.apollo.io/reference/organization-jobs-postings
   */
  async organizationJobPostings(organizationId: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/organizations/${organizationId}/job_postings`;
      const response = await this.axiosInstance.get(url);
      
      if (response.status === 200) {
        return response.data;
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return null;
      }
    } catch (error: any) {
      console.error(`Error: ${error.response?.status} - ${error.response?.statusText || error.message}`);
      return null;
    }
  }
}

// Example usage (for testing)
async function main() {
  try {
    // Get API key from environment variable
    const apiKey = process.env.APOLLO_IO_API_KEY;
    if (!apiKey) {
      throw new Error('APOLLO_IO_API_KEY environment variable is required');
    }

    const client = new ApolloClient(apiKey);

    // Example People Enrichment
    const peopleEnrichmentQuery: PeopleEnrichmentQuery = {
      first_name: "Tim",
      last_name: "Zheng"
    };
    const peopleEnrichmentResponse = await client.peopleEnrichment(peopleEnrichmentQuery);
    if (peopleEnrichmentResponse) {
      console.log("People Enrichment Response:", JSON.stringify(peopleEnrichmentResponse, null, 2));
    } else {
      console.log("People Enrichment failed.");
    }

    // Example Organization Enrichment
    const organizationEnrichmentQuery: OrganizationEnrichmentQuery = {
      domain: "apollo.io"
    };
    const organizationEnrichmentResponse = await client.organizationEnrichment(organizationEnrichmentQuery);
    if (organizationEnrichmentResponse) {
      console.log("Organization Enrichment Response:", JSON.stringify(organizationEnrichmentResponse, null, 2));
    } else {
      console.log("Organization Enrichment failed.");
    }

    // Example People Search
    const peopleSearchQuery: PeopleSearchQuery = {
      person_titles: ["Marketing Manager"],
      person_seniorities: ["vp"],
      q_organization_domains_list: ["apollo.io"]
    };
    const peopleSearchResponse = await client.peopleSearch(peopleSearchQuery);
    if (peopleSearchResponse) {
      console.log("People Search Response:", JSON.stringify(peopleSearchResponse, null, 2));
    } else {
      console.log("People Search failed.");
    }

    // Example Organization Search
    const organizationSearchQuery: OrganizationSearchQuery = {
      organization_locations: ["Japan", "Ireland"]
    };
    const organizationSearchResponse = await client.organizationSearch(organizationSearchQuery);
    if (organizationSearchResponse) {
      console.log("Organization Search Response:", JSON.stringify(organizationSearchResponse, null, 2));
    } else {
      console.log("Organization Search failed.");
    }

    // Example Organization Job Postings
    // Note: You need a valid organization ID for this to work
    const organizationId = "5e60b6381c85b4008c83"; // Replace with a valid organization ID
    const organizationJobPostingsResponse = await client.organizationJobPostings(organizationId);
    if (organizationJobPostingsResponse) {
      console.log("Organization Job Postings Response:", JSON.stringify(organizationJobPostingsResponse, null, 2));
    } else {
      console.log("Organization Job Postings failed.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the example if this file is executed directly
if (process.argv[1] === import.meta.url) {
  main();
}
