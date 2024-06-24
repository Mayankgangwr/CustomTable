
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
    ISort,
    ISortState,
    ITableHeader,
    ITableItemSearchState,
    ITableProps,
    ITableRows
} from "./Interface";
import { FiterPopover, TableItemSearch } from "./Components";
import Pagination from "./Components/Pagination";

const OptimizeTable: FC<ITableProps> = ({
    tableHeader: initialTableHeader,
    tableRows: initialTableRows,
    initalSort,
    rowInPage
}) => {
    const [tableHeader, setTableHeader] = useState<ITableHeader[]>([]);
    const [tableRows, setTableRows] = useState<ITableRows[]>(initialTableRows);
    const [isSort, setIsSort] = useState<ISortState>({ key: null, sortBy: null });
    const [searchItemBy, setSearchItemBy] = useState<ITableItemSearchState[] | undefined>(undefined);
    const [searchVal, setSearchVal] = useState<string>("");
    const [appliedFilterMap, setAppliedFilterMap] = useState<Map<string, IAppliedFilter>>(new Map());
    const [pagination, setPagination] = useState<IPagination>({
        currPage: 1,
        total: 1,
        rowInPage: initialTableRows.length,
        paginationOptions: [10],
    });
    const [offSet, setOffSet] = useState<ITableRows[]>([]);

    useEffect(() => {
        if (initialTableHeader) {
            const searchBy = initialTableHeader
                .filter(el => el.isSearch)
                .map(el => ({
                    key: el.key,
                    dataType: el.dataType || "string"
                }));

            if (searchBy.length > 0) {
                setSearchItemBy(searchBy);
            }
            setTableHeader(initialTableHeader);
        }

        if (initialTableRows) {
            setTableRows(initialTableRows);
            if (rowInPage) {
                const totalPages = getNumberOfPage(initialTableRows.length, rowInPage[0]);
                setPagination({
                    currPage: 1,
                    total: totalPages,
                    rowInPage: rowInPage[0],
                    paginationOptions: rowInPage
                });
            }
        }

        if (initalSort) {
            setIsSort(initalSort);
            const sortedTableRows = handleSortTable(initalSort, initialTableRows);
            setTableRows(sortedTableRows || []);
        }
    }, [initialTableHeader, initialTableRows, initalSort, rowInPage]);

    useEffect(() => {
        const sortedTableRows = handleSortTable({ key: isSort.key || "name", sortBy: isSort.sortBy || ISort.ASC }, tableRows);
        setTableRows(sortedTableRows || []);
        const offset = handlePaginate(sortedTableRows || []);
        setOffSet(offset);
    }, [pagination, tableRows]);

    const handleSortFn = async (key: string) => {
        if (!tableRows) return;
        const result = await handleSort(key, isSort, tableRows);
        setIsSort(result.isSort);
        setTableRows(result.tableRows || []);
        if (result.tableRows) {
            const offset = handlePaginate(result.tableRows);
            setOffSet(offset);
        }
    };

    const handleFilterFn = (column: string, value: string, operation: FilterOperationsEnum, dataType: "string" | "number" | "date") => {
        let updatedRows = tableRows;
        let updatedFilterMap = new Map(appliedFilterMap);

        if (appliedFilterMap.has(column)) {
            const { appliedFilter, filteredRows } = handleClearFilter(column, appliedFilterMap, initialTableRows);
            updatedFilterMap = appliedFilter;
            updatedRows = filteredRows;
        }

        const filteredRows = handleFilter(updatedRows, column, value, operation, dataType);
        updatedFilterMap.set(column, { column, value, operation, dataType });

        setAppliedFilterMap(updatedFilterMap);
        setTableRows(filteredRows);
    };

    const handleClearFilterFn = (column: string) => {
        const result = handleClearFilter(column, appliedFilterMap, initialTableRows);
        setAppliedFilterMap(result.appliedFilter);
        let filteredRows = result.filteredRows;
        if (searchVal && searchItemBy) {
            filteredRows = handleItemSearch(searchVal, result.filteredRows, searchItemBy);
        }
        setTableRows(filteredRows);
        const offset = handlePaginate(filteredRows);
        setOffSet(offset);
    };

    const handleItemSearchFn = (searchVal: string) => {
        if (!searchVal) {
            let filteredRows = initialTableRows;
            if (appliedFilterMap.size > 0) {
                appliedFilterMap.forEach(({ column, value, operation, dataType }) => {
                    filteredRows = handleFilter(filteredRows, column, value, operation, dataType);
                });
            }
            setTableRows(filteredRows);
            const offset = handlePaginate(filteredRows);
            setOffSet(offset);
        } else if (searchItemBy) {
            const searchedRows = handleItemSearch(searchVal, tableRows, searchItemBy);
            setTableRows(searchedRows);
            const offset = handlePaginate(searchedRows);
            setOffSet(offset);
        }
    };

    const handlePaginate = (tableRows: ITableRows[]) => {
        const startIndex = (pagination.currPage - 1) * pagination.rowInPage;
        return tableRows.slice(startIndex, startIndex + pagination.rowInPage);
    };

    const handleNumberOfRows = (numberOfRows: number) => {
        const totalPages = getNumberOfPage(tableRows.length, numberOfRows);
        setPagination(prevState => ({ ...prevState, total: totalPages, rowInPage: numberOfRows }));
    };

    const handlePagination = (pageNumber: number) => {
        setPagination(prevState => ({ ...prevState, currPage: pageNumber }));
    };

    return (
        <div className={Styles.TableContainer}>
            <TableItemSearch
                tableRows={tableRows}
                searchBy={searchItemBy}
                handleItemSearch={(searchVal: string) => {
                    setSearchVal(searchVal);
                    handleItemSearchFn(searchVal);
                }}
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
                                    <FiterPopover
                                        key={th.key}
                                        column={th.key}
                                        dataType={th.dataType || "string"}
                                        options={th.options}
                                        handleFilter={handleFilterFn}
                                        handleClearFilterfn={handleClearFilterFn}
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

export default OptimizeTable;