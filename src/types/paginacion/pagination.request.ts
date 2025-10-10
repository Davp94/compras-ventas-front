export interface PaginationRequest<T> {
    pageSize: number;
    pageNumber: number;
    sortField: string;
    sortOrder: string;
    criterials: T;
    filterValue: string;
}