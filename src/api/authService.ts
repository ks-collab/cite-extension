import axios, { AxiosPromise } from "axios";
import {
  AccessTokenResponse,
  AuthBody,
  DocumentCollection,
  DocumentCollectionUpdateBody,
  DocumentReadResponse,
  DocumentUpdateBody,
  OrganizationList,
  TagList,
} from "models/api/response.types";

const authUsingPassword = (
  requestBody: AuthBody
): AxiosPromise<AccessTokenResponse> => {
  return axios.post<AccessTokenResponse>(`/api/auth`, requestBody);
};

const fetchUserOrganizationList = (
  userId: number
): AxiosPromise<OrganizationList> => {
  return axios.get<OrganizationList>(`/api/user/${userId}/organization/list`);
};

const fetchDocumentCollections = (
  organizationId: number
): AxiosPromise<DocumentCollection[]> => {
  return axios.get(`/api/organization/${organizationId}/collection/list`);
};

const updateDocumentCollection = (
  payload: DocumentCollectionUpdateBody
): AxiosPromise<DocumentCollection[]> => {
  return axios.post(`/api/collection/update`, payload);
};

const fetchTags = (
  organizationId: number,
): AxiosPromise<TagList> => {
  return axios.get(`/api/organization/${organizationId}/tag/list`);
};

const updateDocument = (
  id: number,
  updates: DocumentUpdateBody
): AxiosPromise<DocumentReadResponse> =>
  axios.post(`/api/document/${id}/update`, updates);

export const authService = {
  authUsingPassword,
  fetchUserOrganizationList,
  fetchDocumentCollections,
  updateDocumentCollection,
  fetchTags,
  updateDocument
};

export default authService;
