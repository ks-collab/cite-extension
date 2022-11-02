export interface AccessTokenResponse {
  id: number;
  name?: string;
  email: string;
  created_at: string;
  meta: {
    [k: string]: any;
  };
  is_active: boolean;
  last_active_at: string;
  verification_status: string;
  organization_ids: number[];
  organization_roles?: string[];
  role?: string;
  access_token: string;
}

export interface AuthBody {
  email: string;
  password: string;
}

export interface DocumentCollection {
  id: number;
  organization_id: number;
  parent_id: number;
  user_id: number;
  name: string;
  document_ids: number[];
  modified_at: string;
  created_at: string;
  is_shared: boolean;
}

export interface DocumentCollectionUpdate {
  id: number;
  name?: string;
  document_ids?: number[];
  is_shared?: boolean;
}
export interface DocumentCollectionUpdateBody {
  collections: DocumentCollectionUpdate[];
}

export interface Organization {
  id: number;
  name?: string;
  description: string;
  user_id?: number;
  is_personal: boolean;
  meta: {
    [k: string]: any;
  };
  schema: OrganizationSchema[];
  created_at: string;
  modified_at: string;
  modified_by: number;
}
export interface OrganizationSchema {
  name: string;
  type: string;
  default?: boolean;
  description?: string;
  label?: string;
}

export type OrganizationList = Organization[];
