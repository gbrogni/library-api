export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  title?: string;
  authorName?: string;
}