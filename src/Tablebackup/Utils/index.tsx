import { ArrowBidirectionalUpDownRegular, ArrowDownRegular, ArrowUpRegular } from "@fluentui/react-icons";
import { FilterOperationsEnum, IAppliedFilter, IFilterOperations, ISort, ISortState, ITableItemSearchState, ITableRow } from "../Interface";

export const handleSort = async (key: string, isSort: ISortState, tableRows: ITableRow[] | null): Promise<{
    isSort: ISortState;
    tableRows: ITableRow[] | null;
}> => {
    const newSortBy = (isSort.key === key && isSort.sortBy === ISort.ASC) ? ISort.DESC : ISort.ASC;
    const newIsSort = { key, sortBy: newSortBy };
    if (!tableRows) return { isSort: newIsSort, tableRows: tableRows };

    const sortedTableRows = handleSortTable(newIsSort, tableRows);
    return { isSort: newIsSort, tableRows: sortedTableRows };
};

export const handleSortTable = ({ key, sortBy }: { key: string; sortBy: ISort }, tableRows: ITableRow[] | null): ITableRow[] | null => {
    if (!tableRows) return tableRows;

    return [...tableRows].sort((row1, row2) => {
        const value1 = row1[key]?.key ?? '';
        const value2 = row2[key]?.key ?? '';

        if (value1 < value2) return sortBy === ISort.ASC ? -1 : 1;
        if (value1 > value2) return sortBy === ISort.ASC ? 1 : -1;
        return 0;
    });
};

export const handleFilter = (tableRows: ITableRow[], column: string, value: string, operation: FilterOperationsEnum, dataType: "string" | "number" | "date"): ITableRow[] => {
    if (!tableRows.length) return tableRows;

    const lowerValue = value.toLowerCase();

    return tableRows.filter(row => {
        const rowValue = String(row[column]?.key ?? "").toLowerCase();

        switch (operation) {
            case FilterOperationsEnum.CONTAINS:
                return rowValue.includes(lowerValue);
            case FilterOperationsEnum.STARTS_WITH:
                return rowValue.startsWith(lowerValue);
            case FilterOperationsEnum.ENDS_WITH:
                return rowValue.endsWith(lowerValue);
            case FilterOperationsEnum.EQUAL_TO:
                return rowValue === lowerValue;
            case FilterOperationsEnum.LESS_THAN:
                return dataType === "number" && Number(row[column]?.key) < Number(value);
            case FilterOperationsEnum.GREATER_THAN:
                return dataType === "number" && Number(row[column]?.key) > Number(value);
            default:
                return false;
        }
    });
};

export const handleClearFilter = (column: string, appliedFilter: Map<string, IAppliedFilter>, initialTableRows: ITableRow[]): { appliedFilter: Map<string, IAppliedFilter>, filteredRows: ITableRow[] } => {
    const newMap = new Map(appliedFilter);
    newMap.delete(column);
    let filteredRows = initialTableRows;

    newMap.forEach(({ column, value, operation, dataType }) => {
        filteredRows = handleFilter(filteredRows, column, value, operation, dataType);
    });

    return { appliedFilter: newMap, filteredRows };
};

export const getSortIcon = (key: string, isSort: ISortState) => {
    if (isSort.key !== key) {
        return <ArrowBidirectionalUpDownRegular fontSize={20} />;
    }
    return isSort.sortBy === ISort.ASC ? <ArrowUpRegular fontSize={16} /> : <ArrowDownRegular fontSize={16} />;
};

export const FilterOperations: IFilterOperations[] = [
    { value: FilterOperationsEnum.STARTS_WITH, text: 'Starts With' },
    { value: FilterOperationsEnum.ENDS_WITH, text: 'Ends With' },
    { value: FilterOperationsEnum.CONTAINS, text: 'Contains' },
    { value: FilterOperationsEnum.EQUAL_TO, text: 'Equal To' },
    { value: FilterOperationsEnum.LESS_THAN, text: 'Less Than' },
    { value: FilterOperationsEnum.GREATER_THAN, text: 'Greater Than' }
];

export const handleItemSearch = (searchVal: string, tableRows: ITableRow[], searchItemBy: ITableItemSearchState[]): ITableRow[] => {
    if (!searchItemBy.length) return tableRows;

    const lowerSearchVal = searchVal.toLowerCase();

    return tableRows.filter(row =>
        searchItemBy.some(searchCol => {
            const rowValue = String(row[searchCol.key]?.key ?? "").toLowerCase();

            if (searchCol.dataType === "number") {
                return Number(row[searchCol.key]?.key) === Number(searchVal);
            }
            return rowValue.includes(lowerSearchVal);
        })
    );
};

export const getNumberOfPage = (totalRows: number, maxRowsPerPage: number): number => {
    return Math.ceil(totalRows / maxRowsPerPage);
};
