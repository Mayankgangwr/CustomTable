export enum ISort {
    ASC,
    DESC,
    NONE
};

export enum FilterOperationsEnum {
    EQUAL_TO = "eqaulTo",
    STARTS_WITH = "startsWith",
    ENDS_WITH = "endsWith",
    CONTAINS = "contains",
    LESS_THEN = 'Less Then',
    GREATER_THEN = "Greater Then"
}
export interface IFilterOperations {
    value: FilterOperationsEnum;
    text: string;
};

export interface ITableHeaderOptions {
    value: string | number;
    text: string;
};

export interface ITableHeader {
    key: string;
    title: string;
    dataType?: 'string' | 'number' | 'date';
    isSort?: boolean;
    isFilter?: boolean;
    options?: ITableHeaderOptions[];
    isSearch?: true | false;
};

export interface ITableRows {
    [key: string]: {
        key: string | number;
        value: string | number | JSX.Element | null;
    }
};

export interface ISortState {
    key: string | null;
    sortBy: ISort | null;
};

export interface ITableProps {
    tableHeader: ITableHeader[];
    tableRows: ITableRows[];
    initalSort?: {
        key: string;
        sortBy: ISort;
    };
    rowInPage?: number[];
};
export interface IAppliedFilter {
    column: string;
    value: string;
    operation: FilterOperationsEnum;
    dataType: "string" | "number" | "date"
};
export interface IFiterPopoverProps {
    column: string;
    options?: ITableHeaderOptions[];
    handleFilter: (column: string, value: string, operation: FilterOperationsEnum, dataType: 'string' | 'number' | 'date') => void;
    handleClearFilterfn: (column: string) => void;
    dataType?: 'string' | 'number' | 'date';
    appliedFilter?: IAppliedFilter;
};

export interface ITableItemSearchState {
    key: string;
    dataType: "string" | "number" | "date";
}

export interface ITableItemSearchProps {
    tableRows: ITableRows[];
    searchBy?: { key: string; dataType: string }[] | undefined;
    handleItemSearch: (searchVal: string) => void;
};
export interface IPagination{ 
    currPage: number;
    total: number;
    rowInPage: number;
    paginationOptions: number[];
}
export interface IPaginationProps{
    pagination: IPagination;
    handleNumberOfRows: (numberOfRows: number) => void;
    handlePagination: (pageNumber: number) => void
}