import { FC, useEffect, useState } from "react";
import Styles from "./Table.module.scss";
import {
    Table as UITable,
    TableHeader as Thead,
    TableHeaderCell as Th,
    TableBody as Tbody,
    TableRow as Tr,
    TableCell as Td
} from "@fluentui/react-components";
import {
    getSortIcon,
    handleSortTable,
    handleSort,
    handleFilter,
    handleClearFilter,
    handleItemSearch,
    getNumberOfPage
} from "./Utils";
import {
    FilterOperationsEnum,
    IAppliedFilter,
    IPagination,
    ISortState,
    ITableHeader,
    ITableItemSearchState,
    ITableProps,
    ITableRow
} from "./Interface";
import { FilterPopover, TableItemSearch } from "./Components";
import Pagination from "./Components/Pagination";

const Table: FC<ITableProps> = ({
    tableHeader: initialTableHeader,
    tableRows: initialTableRows,
    initialSort,
    rowsPerPage
}) => {
    const [tableHeader, setTableHeader] = useState<ITableHeader[]>(initialTableHeader);
    const [tableRows, setTableRows] = useState<ITableRow[]>(initialTableRows);
    const [isSort, setIsSort] = useState<ISortState>(initialSort || { key: null, sortBy: null });
    const [searchItemBy, setSearchItemBy] = useState<ITableItemSearchState[] | undefined>(undefined);
    const [appliedFilterMap, setAppliedFilterMap] = useState<Map<string, IAppliedFilter>>(new Map());
    const [pagination, setPagination] = useState<IPagination>({
        currPage: 1,
        total: getNumberOfPage(initialTableRows.length, rowsPerPage ? rowsPerPage[0] : 10),
        rowsPerPage: rowsPerPage ? rowsPerPage[0] : 10,
        paginationOptions: rowsPerPage ? rowsPerPage : [10, 15, 20],
    });
    const [offSet, setOffSet] = useState<ITableRow[]>([]);

    useEffect(() => {
        const searchBy = initialTableHeader
            .filter(el => el.isSearch)
            .map(el => ({
                key: el.key,
                dataType: el.dataType || "string"
            }));

        if (searchBy.length > 0) {
            setSearchItemBy(searchBy);
        }

        if (initialSort) {
            const sortedTableRows = handleSortTable(initialSort, initialTableRows);
            setTableRows(sortedTableRows || []);
        }

        setTableHeader(initialTableHeader);
        setTableRows(initialTableRows);
    }, [initialTableHeader, initialTableRows, initialSort, rowsPerPage]);

    useEffect(() => {
        const offset = handlePaginate(tableRows);
        setOffSet(offset);
    }, [pagination, tableRows]);

    const handleSortFn = async (key: string) => {
        const result = await handleSort(key, isSort, tableRows);
        setIsSort(result.isSort);
        if (result.tableRows) {
            setTableRows(result.tableRows);
        }
    };

    const handleFilterFn = (column: string, value: string, operation: FilterOperationsEnum, dataType: "string" | "number" | "date") => {
        let { appliedFilter, filteredRows } = handleClearFilter(column, appliedFilterMap, initialTableRows);
        const newFilteredRows = handleFilter(filteredRows, column, value, operation, dataType);
        appliedFilter.set(column, { column, value, operation, dataType });

        setAppliedFilterMap(new Map(appliedFilter));
        setTableRows(newFilteredRows);
    };

    const handleClearFilterFn = (column: string) => {
        const { appliedFilter, filteredRows } = handleClearFilter(column, appliedFilterMap, initialTableRows);

        setAppliedFilterMap(new Map(appliedFilter));
        setTableRows(filteredRows);
    };

    const handleItemSearchFn = (searchVal: string) => {
        const searchedRows = searchVal ? handleItemSearch(searchVal, initialTableRows, searchItemBy || []) : initialTableRows;
        setTableRows(searchedRows);
    };

    const handlePaginate = (tableRows: ITableRow[]) => {
        const startIndex = (pagination.currPage - 1) * pagination.rowsPerPage;
        return tableRows.slice(startIndex, startIndex + pagination.rowsPerPage);
    };

    const handleNumberOfRows = (numberOfRows: number) => {
        const totalPages = getNumberOfPage(tableRows.length, numberOfRows);
        setPagination(prevState => ({ ...prevState, total: totalPages, rowsPerPage: numberOfRows }));
    };

    const handlePagination = (pageNumber: number) => {
        setPagination(prevState => ({ ...prevState, currPage: pageNumber }));
    };

    return (
        <div className={Styles.TableContainer}>
            <TableItemSearch
                tableRows={tableRows}
                searchBy={searchItemBy}
                handleItemSearch={handleItemSearchFn}
            />
            <UITable className={Styles.UITable}>
                <Thead className={Styles.Thead}>
                    {tableHeader.map((th, index) => (
                        <Th className={Styles.Th} key={th.key + index}>
                            <div className={Styles.OuterBox}>
                                <div
                                    className={Styles.InnerBox}
                                    onClick={() => (th.isSort === undefined || th.isSort) && handleSortFn(th.key)}
                                >
                                    <span className={Styles.Title}>{th.title}</span>
                                    {(th.isSort === undefined || th.isSort) && getSortIcon(th.key, isSort)}
                                </div>
                                {(th.isFilter === undefined || th.isFilter) && (
                                    <FilterPopover
                                        key={th.key}
                                        column={th.key}
                                        dataType={th.dataType || "string"}
                                        options={th.options}
                                        handleFilter={handleFilterFn}
                                        handleClearFilter={handleClearFilterFn}
                                        appliedFilter={appliedFilterMap.get(th.key)}
                                    />
                                )}
                            </div>
                        </Th>
                    ))}
                </Thead>
                <Tbody className={Styles.Tbody}>
                    {offSet.map((row, idx) => (
                        <Tr className={Styles.Tr} key={idx}>
                            {Object.keys(row).map(el => (
                                <Td className={Styles.Td} key={el}>{row[el].value}</Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </UITable>
            <Pagination
            pagination={pagination}
            handleNumberOfRows={handleNumberOfRows}
            handlePagination={handlePagination}
        />
        </div>
    );
};

export default Table;
