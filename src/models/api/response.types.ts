/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export type APIErrorList = APIError[];
export type ActivityResponse = Activity[];
export type AnnotationDetailedList = AnnotationDetailed[];
export type AttachmentList = Attachment[];
export type AutoExtractionRuleList = AutoExtractionRule[];
export type AutoTaggingRuleList = AutoTaggingRule[];
export type CommentList = Comment[];
export type DocumentBibtexResponse = BibtexEntry[];
export type DocumentCollectionList = DocumentCollection[];
export type DocumentKeywordsResponse = SearchKeyword[];
export type DocumentLinksResponse = DocumentLink[];
export type DocumentList = Document[];
export type DocumentLookupResponse = DocumentLookupResult[];
export type DocumentOutlineResponse = DocumentOutline[];
export type DocumentTextSpansResponse = string[];
export type EventList = Event[];
export type InviteList = Invite[];
export type MediaList = Media[];
export type NotificationList = Notification[];
export type OrganizationSchemaList = OrganizationSchema[];
export type OrganizationDetailedList = OrganizationDetailed[];
export type OrganizationList = Organization[];
export type ReferralList = Referral[];
export type SiteList = Site[];
export type TagFromTextResponse = TagFromText[];
export type TagList = Tag[];
export type TelemetryList = Telemetry[];
export type QAListResponse = QAResponse[];
export type TextResponse = string;
export type UserExtraDetailedList = UserExtraDetailed[];
export type UserList = User[];

export interface APIError {
  id: number;
  user_id: number;
  organization_id: number;
  method: string;
  endpoint: string;
  full_path: string;
  remote_addr: string;
  traceback: string;
  created_at: string;
}
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
export interface Activity {
  created_at: string;
  text: string;
}
export interface ActivityQuery {
  initiated_before?: string;
  initiated_after?: string;
}
export interface Annotation {
  id: number;
  type: string;
  description: string;
  document_id: number;
  user_id: number;
  comment_count: number;
  is_hidden: boolean;
  use_ocr: boolean;
  created_at: string;
  modified_at: string;
  modified_by: number;
}
export interface AnnotationCreateBody {
  document_id: number;
  type?: string;
  text?: string;
  description?: string;
  comment?: string;
  meta?: {
    [k: string]: any;
  };
  is_hidden?: boolean;
  use_ocr?: boolean;
}
export interface AnnotationDetailed {
  id: number;
  type: string;
  description: string;
  document_id: number;
  organization_id: number;
  user_id: number;
  comment_count: number;
  is_hidden: boolean;
  use_ocr: boolean;
  created_at: string;
  modified_at: string;
  modified_by: number;
  text: string;
  meta: {
    [k: string]: any;
  };
}
export interface AnnotationListQuery {
  organization_id: number;
  document_id?: number;
  user_id?: number;
  modified_by?: number;
  comment_count?: number;
  type?: string;
  created_before?: string;
  created_after?: string;
  modified_before?: string;
  modified_after?: string;
  include_hidden?: boolean;
  sort_by?: string;
  descending?: boolean;
  page?: number;
  page_size?: number;
}
export interface AnnotationListResponse {
  _meta: {
    [k: string]: any;
  };
  _list: AnnotationDetailedList;
  _links: {
    [k: string]: any;
  };
}
export interface AnnotationMetaSearchQuery {
  q?: string;
  organization_id: number;
  html?: any;
  page?: number;
  page_size?: number;
}
export interface AnnotationUpdateBody {
  type?: string;
  description?: string;
  text?: string;
  meta?: {
    [k: string]: any;
  };
  is_hidden?: boolean;
  use_ocr?: boolean;
}
export interface Attachment {
  id: number;
  filename: string;
  document_id: number;
  user_id: number;
  created_at: string;
  modified_at: string;
  modified_by: number;
}
export interface AttachmentCreateBody {
  document_id: number;
  filename?: string;
}
export interface AttachmentUpdateBody {
  filename?: string;
}
export interface AuthBody {
  email: string;
  password: string;
}
export interface AutoExtractionRule {
  id: number;
  organization_id: number;
  type: string;
  modified_at: string;
  modified_by: number;
  meta_json: string;
  meta: {
    [k: string]: any;
  };
}
export interface AutoExtractionRuleCreateBody {
  organization_id: number;
  tag_ids?: number[];
  type: string;
  meta: {
    [k: string]: any;
  };
}
export interface AutoExtractionRuleUpdateBody {
  type: string;
  meta: {
    [k: string]: any;
  };
}
export interface AutoTaggingRule {
  id: number;
  organization_id: number;
  tag_ids: number[];
  type: string;
  modified_at: string;
  modified_by: number;
  meta_json: string;
  meta: {
    [k: string]: any;
  };
}
export interface AutoTaggingRuleAddTagsBody {
  tag_ids: number[];
}
export interface AutoTaggingRuleCreateBody {
  organization_id: number;
  tag_ids?: number[];
  type: string;
  meta: {
    [k: string]: any;
  };
}
export interface AutoTaggingRuleUpdateBody {
  type: string;
  meta: {
    [k: string]: any;
  };
}
export interface BaseModelConfig {}
export interface BatchTasksResponse {
  success?: boolean;
  message: string;
  task_id: string;
}
export interface BibtexEntry {
  citekey: string;
  entrytype: string;
  properties: {
    [k: string]: any;
  };
}
export interface CacheStats {
  size: number;
  cache_hit_ratio: number;
  recent_requests: CachedRequest[];
}
export interface CachedRequest {
  endpoint: string;
  request_text: string;
  response_json: {
    [k: string]: any;
  };
  created_at: string;
  expires_at: string;
  accessed_at: string;
}
export interface CheckStaleAnnotations {
  document_id: number;
  last_fetched: string;
}
export interface CheckStaleBody {
  organization?: CheckStaleOrganization;
  documents?: CheckStaleDocuments;
  document?: CheckStaleOrganization;
  annotations?: CheckStaleAnnotations;
  comments?: CheckStaleAnnotations;
}
export interface CheckStaleOrganization {
  id: number;
  last_fetched: string;
}
export interface CheckStaleDocuments {
  organization_id: number;
  last_fetched: string;
}
export interface CheckStaleResponse {
  organization?: number[];
  documents?: number[];
  document?: number[];
  annotations?: number[];
  comments?: number[];
}
export interface Comment {
  id: number;
  annotation_id: number;
  user_id: number;
  created_at: string;
  modified_at: string;
  modified_by: number;
  content: string;
  user: UserSimple;
}
export interface UserSimple {
  id: number;
  name?: string;
}
export interface CommentCreateBody {
  annotation_id: number;
  content: string;
}
export interface CommentUpdateBody {
  content?: string;
}
export interface DictResponse {}
export interface Document {
  annotation_ids: number[];
  created_at: string;
  modified_at: string;
  modified_by: number;
  id: number;
  is_trash: boolean;
  use_ocr: boolean;
  meta: {
    [k: string]: any;
  };
  status: {
    [k: string]: number;
  };
  organization_id: number;
  tag_ids: number[];
  user: UserSimple;
  doctype: string;
  filename?: string;
  file_size: number;
  pages: number;
  resource_size: number;
  file_resource_size: number;
}
export interface DocumentAddMetaBody {
  meta: {
    [k: string]: any;
  };
}
export interface DocumentAddMetasBody {
  documents: DocumentAddMetasItem[];
}
export interface DocumentAddMetasItem {
  document_id: number;
  meta: {
    [k: string]: any;
  };
}
export interface DocumentAddTagBody {
  tag_ids: number[];
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
export interface DocumentCollectionCreateBody {
  organization_id: number;
  parent_id: number;
  name: string;
  document_ids?: number[];
  is_shared?: boolean;
  allow_duplicate?: boolean;
}
export interface DocumentCollectionDeleteBody {
  collection_ids: number[];
}
export interface DocumentCollectionUpdate {
  id: number;
  name?: string;
  document_ids?: number[];
  is_shared?: boolean;
  allow_duplicate?: boolean;
  parent_id?: number;
}
export interface DocumentCollectionUpdateBody {
  collections: DocumentCollectionUpdate[];
}
export interface DocumentCopyBody {
  destination_id: number;
  document_ids: number[];
  copy_annotations: boolean;
  copy_tags: boolean;
}
export interface DocumentCopyResponse {
  success?: boolean;
  new_document_ids: number[];
}
export interface DocumentDelMultiBody {
  document_ids: number[];
}
export interface DocumentDoiSearchBody {
  doi: string;
}
export interface DocumentDoiSearchResponse {}
export interface DocumentDownloadBody {
  document_ids: string;
}
export interface DocumentGrobidIdentifyResponse {
  title: string;
  abstract: string;
  author: string;
  matches: BibtexEntry[];
}
export interface DocumentKeywordsBody {
  document_ids: number[];
  weights?: number[];
}
export interface SearchKeyword {
  score: number;
  text: string;
}
export interface DocumentLink {
  type: string;
  page: number;
  area: number[];
  dest?: DocumentLinkDestination;
  action?: string;
}
export interface DocumentLinkDestination {
  page?: number;
  area?: number[];
  filename?: string;
  parameters?: string;
  url?: string;
  is_external?: boolean;
}
export interface DocumentListQuery {
  document_ids: number[];
}
export interface DocumentLookupBody {
  author: string;
  title: string;
  sources?: string[];
}
export interface DocumentLookupResult {
  source: string;
  score: number;
  properties: {
    [k: string]: string;
  };
}
export interface DocumentOutline {
  children: any[];
  page: number;
  title: string;
}
export interface DocumentReadResponse {
  annotation_ids: number[];
  created_at: string;
  modified_at: string;
  modified_by: number;
  id: number;
  is_trash: boolean;
  use_ocr: boolean;
  meta: {
    [k: string]: any;
  };
  detexiFiedMeta?: {
    [k: string]: any;
  };
  status: {
    [k: string]: number;
  };
  organization_id: number;
  tag_ids: number[];
  user: UserSimple;
  doctype: string;
  filename?: string;
  file_size: number;
  pages: number;
  resource_size: number;
  file_resource_size: number;
  resource_stats?: DocumentResourceStats;
  annotations?: Annotation[];
  comments?: Comment[];
  tasks?: Task[];
  ranking?: number;
  snippet?: string;
  keywords?: any[];
  site_ids?: number[];
}

export interface DocumentResourceStats {
  file_size: number;
  file_size_by_res_type?: any;
  file_size_by_mime_type?: any;
  file_list?: any;
}
export interface Task {
  task_id: string;
  created_at?: any;
  updated_at?: any;
  state?: string;
  task_name: string;
  args_json: string;
  retries?: number;
  traceback?: any;
  runtime?: number;
}
export interface DocumentRegexBody {
  name: string;
  overwrite?: boolean;
  pattern: string;
}
export interface DocumentRegexResponse {
  pattern: string;
  matches: RegexMatch[];
  time_exceeded: boolean;
  match_exceeded: boolean;
}
export interface RegexMatch {
  start: number;
  end: number;
  text: string;
  groups: any[];
}
export interface DocumentRemoveMetaBody {
  meta_keys: string[];
}
export interface DocumentRerunUploadBody {
  use_ocr?: boolean;
}
export interface DocumentScoreResponse {
  id: number;
  score: number;
  filename: string;
}
export interface DocumentSearchQuery {
  q?: string;
  organization_id: number;
  html?: any;
  meta?: boolean;
}
export interface DocumentSearchResponse {
  snippets: Snippet[];
  tokens: Token[];
  text_length: number;
}
export interface Snippet {
  start: number;
  end: number;
  matches: SearchMatch[];
  score: number;
  text: string;
}
export interface SearchMatch {
  color: number;
  span: number[];
  text: string;
  weight: number;
}
export interface Token {
  text: string;
  color: number;
  weight: number;
  matches: SearchMatch[];
}
export interface DocumentSimple {
  filename?: string;
  id: number;
}
export interface DocumentStub {
  meta_json: string;
}
export interface DocumentStubCreateBody {
  organization_id: number;
  stubs: DocumentStub[];
}
export interface DocumentSummaryQuery {
  query?: string;
  start_page?: number;
  end_page?: number;
}
export interface DocumentSummaryResponse {
  success?: boolean;
  sentences: Sentence[];
}
export interface Sentence {
  text: string;
  start: number;
  end: number;
  offset: number;
  rank: number;
  score: number;
  matches?: number;
}
export interface DocumentTextSpansQuery {
  start_indices: string;
  end_indices: string;
}
export interface DocumentToggleOcrBody {
  use_ocr?: boolean;
}
export interface DocumentTrashBody {
  document_ids: number[];
}
export interface DocumentUpdateBody {
  organization_id?: number;
  meta_json?: string;
  tags_json?: string;
  content?: string;
  filename?: string;
  doctype?: string;
  use_ocr?: boolean;
  is_trash?: boolean;
  file?: any;
}
export interface DoiApiResponse {
  success: boolean;
  error?: DoiErrorDict;
  bib_info?: BibtexEntry;
}
export interface DoiErrorDict {
  status_code: number;
  message: string;
}
export interface DoiUpdateResponse {
  document_id: number;
  success: boolean;
  message: string;
}
export interface ErrorReportBody {
  method?: string;
  endpoint?: string;
  request_json?: string;
  response_code?: number;
  response_json?: string;
  comment?: string;
  user_id?: number;
  organization_id?: number;
}
export interface ErrorResponse {
  error: string;
  success?: boolean;
}
export interface Event {
  document: DocumentSimple;
  event: string;
  meta: {
    [k: string]: any;
  };
  file?: {
    [k: string]: any;
  };
  timestamp: string;
  user: UserSimple;
}
export interface File {
  id: number;
  user_id: number;
  created_at: string;
  modified_at: string;
  modified_by: string;
  doctype: string;
  meta: {
    [k: string]: any;
  };
  status: {
    [k: string]: any;
  };
  file_size: number;
  pages: number;
  resource_size: number;
}
export interface FileUpdateBody {
  meta_json?: string;
  content?: string;
  doctype?: string;
  file?: any;
}
export interface ForgotPasswordCodeAcceptBody {
  email: string;
  verification_code: string;
}
export interface ForgotPasswordCodeVerifyBody {
  email: string;
  verification_code: string;
}
export interface ForgotPasswordEmailSendBody {
  email: string;
}
export interface IdResponse {
  id: number;
}
export interface Invite {
  id: number;
  user_id: number;
  email: string;
  invited_by_user_id: number;
  invited_by_email: string;
  invited_by_name: string;
  organization_id: number;
  organization_name: string;
  sent_at: string;
  accepted_at?: string;
  declined_at?: string;
}
export interface InviteCreateBody {
  email: string;
  organization_id: number;
}
export interface InviteUserPermittedQuery {
  email: string;
  organization_id: number;
}
export interface InviteUserPermittedResponse {
  user_status: string;
}
export interface LoginAsUserRequest {
  user_id: number;
}
export interface Media {
  id: number;
  user_id: number;
  site_id: number;
  created_at: string;
  modified_at: string;
  modified_by: string;
  filename: string;
  extension: string;
  meta: {
    [k: string]: any;
  };
  file_size: number;
}
export interface MultiDocumentSearchResponse {
  documents: DocumentReadResponse[];
  tags: Tag[];
}
export interface Tag {
  id: number;
  organization_id: number;
  name: string;
  color: string;
  document_count: number;
  modified_at: string;
  modified_by: number;
}
export interface Notification {
  id: number;
  type: string;
  user_id: number;
  scope: string;
  creator: {
    [k: string]: any;
  };
  payload: {
    [k: string]: any;
  };
  read_at?: string;
  created_at: string;
}
export interface NotificationCountUnreadQuery {
  type?: string;
}
export interface NotificationCountUnreadResponse {
  num_unread: number;
}
export interface NotificationListQuery {
  type?: string;
  unread?: boolean;
}
export interface NotificationMarkBody {
  read: boolean;
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
  schema: OrganizationSchemaList;
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
export interface OrganizationCreateBody {
  organization_name: string;
  organization_description?: string;
  creator_user_id: number;
}
export interface OrganizationCreateResponse {
  message: string;
  organization_id: number;
}
export interface OrganizationDetailed {
  id: number;
  name: string;
  description: string;
  user_id?: number;
  is_personal: boolean;
  meta: {
    [k: string]: any;
  };
  schema: OrganizationSchemaList;
  created_at: string;
  modified_at: string;
  modified_by: number;
  users: UserDetailed[];
}
export interface UserDetailed {
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
  organization_roles: string[];
  role?: string;
  organizations: Organization[];
  referral_id?: number;
}
export interface OrganizationReadQuery {
  user_id?: number;
  name: string;
}
export interface OrganizationSetRoleBody {
  user_id: number;
  role: string;
}
export interface OrganizationUpdateBody {
  name?: string;
  description?: string;
  meta?: {
    [k: string]: any;
  };
}
export interface OrganizationUsageQuery {
  initiated_before?: string;
  initiated_after?: string;
}
export interface OrganizationUsageResponse {
  usage: {
    [k: string]: any;
  };
  usage_limits: {
    [k: string]: any;
  };
}

export interface OrganizationUserRemoveBody {
  user_id: number;
}
export interface PageLayoutResponse {
  width: number;
  height: number;
  span: number[];
  locations: number[][];
}
export interface Referral {
  id: number;
  user_id: number;
  email: string;
  referred_by_user_id: number;
  referred_by_email: string;
  message?: string;
  sent_at: string;
  accepted_at?: string;
  declined_at?: string;
  invite_id?: number;
  verification_code?: string;
}
export interface ReferralCodeAcceptBody {
  email: string;
  verification_code: string;
}
export interface ReferralCodeVerifyBody {
  email: string;
  verification_code: string;
}
export interface ReferralCreateBody {
  email: string;
}
export interface ReferralUserPermittedQuery {
  email: string;
}
export interface ReferralUserPermittedResponse {
  exists: boolean;
  has_password: boolean;
  verification_status: string;
  permitted: boolean;
}
export interface ResetResponse {
  success?: boolean;
  organization_id: number;
  user_id: number;
}
export interface ResponseResponse {
  response?: any;
  success?: boolean;
}
export interface SearchQuery {
  q?: string;
  organization_id: number;
  html?: any;
}
export interface SearchResponse {
  results: SearchResult[];
  tags: Tag[];
  schema: any[];
}
export interface SearchResult {
  annotation?: Annotation;
  document: Document;
  ranking: number;
  snippet: string;
  type: string;
}
export interface SignupCodeAcceptBody {
  email: string;
  verification_code: string;
}
export interface SignupCodeVerifyBody {
  email: string;
  verification_code: string;
}
export interface SignupCreateBody {
  email: string;
}
export interface SignupEmailSendBody {
  email: string;
}
export interface SignupRemindResponse {
  deleted?: number[];
  remind_one_week?: number[];
  remind_three_weeks?: number[];
}
export interface SignupUserPermittedQuery {
  email: string;
}
export interface SignupUserPermittedResponse {
  exists: boolean;
  has_password: boolean;
  verification_status: string;
  permitted: boolean;
}
export interface SimpleSearchQuery {
  q?: string;
}
export interface Site {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
  modified_at: string;
  modified_by: number;
  data: {
    [k: string]: any;
  };
}
export interface SiteBuildBody {
  id: number;
  uuid: string;
  status: string;
  log: string;
}
export interface SiteCreateBody {
  name: string;
  data: {
    [k: string]: any;
  };
}
export interface SiteDocumentUpdateRequestBody {
  document_ids: number[];
}
export interface SiteUpdateBody {
  data: {
    [k: string]: any;
  };
}
export interface SuccessResponse {
  success?: boolean;
}
export interface SupportEmailBody {
  "g-recaptcha-response": string;
  email: string;
  description: string;
}
export interface SupportEmailResponse {
  success: boolean;
  message: string;
  "g-recaptcha-success": boolean;
}
export interface TagAddDocumentsBody {
  document_ids: number[];
}
export interface TagCreateBody {
  organization_id: number;
  name: string;
  color?: string;
  add_document_ids?: number[];
}
export interface TagCreateManyBody {
  tags: TagCreateBody[];
}
export interface TagFromText {
  tag_name: string;
  tfidf: number;
  exists: boolean;
  tag?: Tag;
}
export interface TagUpdateBody {
  name?: string;
  color?: string;
}
export interface TaskIdResponse {
  task_id: string;
}
export interface TaskInfoResponse {
  args_json: string;
  created_at: string;
  function: string;
  group_id: string;
  id: string;
  module: string;
  nrequeue: number;
  parent_id: number;
  parent_table: string;
  runtime: number;
  status: string;
  traceback: string;
  updated_at: string;
}
export interface TaskStatusResponse {
  extract: string;
}
export interface QAResponse {
  created_at: string;
  document_id: number;
  id: number;
  query: string;
  response: string;
  user_id: number;
  task_id: string;
  status: string;
}
export interface Telemetry {
  user_id: number;
  organization_id: number;
  action: string;
  payload_json: string;
  timestamp: string;
}
export interface TelemetryQuery {
  user_id?: number;
  organization_id?: number;
  action?: string;
  created_before?: string;
  created_after?: string;
}
export interface TotalUsageQuery {
  initiated_before?: string;
  initiated_after?: string;
}
export interface TotalUsageResponse {
  total_usage: {
    [k: string]: any;
  }[];
}
export interface User {
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
  referral_email: string;
  role?: string;
}
export interface UserCreateBody {
  email: string;
  name: string;
  password: string;
}
export interface UserExtraDetailed {
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
  storage?: {
    [k: string]: any;
  };
  tasks?: {
    [k: string]: any;
  };
  referral_email?: string;
}
export interface UserJoinOrganizationBody {
  organization_id: number;
  role?: string;
}
export interface UserLeaveOrganizationBody {
  organization_id: number;
}
export interface UserMetrics {
  active_hourly: number;
  recurring_weekly: number;
  daily_signups: number;
}
export interface UserUpdateBody {
  name?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
  meta?: {
    [k: string]: any;
  };
}
export interface UserUsageQuery {
  initiated_before?: string;
  initiated_after?: string;
}
export interface UserUsageResponse {
  storage: {
    [k: string]: any;
  };
  tasks: {
    [k: string]: any;
  };
}
export interface VerificationStatusQuery {
  email: string;
}
export interface VerificationStatusResponse {
  status: string;
}

export interface SauceDocSearch {
  identifier: string;
  description: string;
  author: string;
  year: number[];
  journal: string;
  publisher: string;
}

export interface SauceDoc {
  meta: {
    [k: string]: any;
  };
}

export interface SauceReference extends SauceDoc {
  id: string;
}

export type CiteGenListResponseList = CiteGenListResponse[];
export interface CiteGenListCreateBody {
  data_json: {
    [k: string]: any;
  };
}
export interface CiteGenListResponse {
  id: number;
  user_id: number;
  data_json: {
    [k: string]: any;
  };
  created_at: string;
  modified_at: string;
}
export interface CiteGenListUpdateBody {
  data_json: {
    [k: string]: any;
  };
}
export interface CiteGenQuery {
  type: string;
  query: string;
}
export interface CiteGenSearchResultItem {
  csljson: {
    [k: string]: any;
  };
}
export interface CiteGenSearchResults {
  items: CiteGenSearchResultItem[];
  message: string;
}
