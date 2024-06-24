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
import { getSortIcon, handleSortTable, handleSort, handleFilter, handleClearFilter, handleItemSearch, getNumberOfPage } from "./Utils";
import { FilterOperationsEnum, IAppliedFilter, IPagination, ISort, ISortState, ITableHeader, ITableItemSearchState, ITableProps, ITableRows } from "./Interface";
import { FiterPopover, TableItemSearch } from "./Components";
import Pagination from "./Components/Pagination";

const Table: FC<ITableProps> = ({ tableHeader: initialTableHeader, tableRows: initialTableRows, initalSort, rowInPage }) => {
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
                .filter(el => el.isSearch === true)
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
                setPagination(() => ({
                    currPage: 1,
                    total: totalPages,
                    rowInPage: rowInPage[0],
                    paginationOptions: rowInPage
                }));
            }
        }

        if (initalSort) {
            setIsSort(initalSort);
            const sortedTableRows = handleSortTable(initalSort, initialTableRows);
            sortedTableRows && setTableRows(() => sortedTableRows);
        }
    }, [initialTableHeader, initialTableRows, initalSort, rowInPage]);

    useEffect(() => {
        const sortedTableRows = handleSortTable({ key: isSort.key || "name", sortBy: isSort.sortBy || ISort.ASC }, tableRows || initialTableRows);
        sortedTableRows && setTableRows(() => sortedTableRows);
        const offset = handlePaginate(sortedTableRows || tableRows, pagination);
        setOffSet(() => offset);
    }, [pagination]);

    const handleSortfn = async (key: string) => {
        if (!tableRows) return;
        const result = await handleSort(key, isSort, tableRows);
        setIsSort(result.isSort);
        if (result.tableRows) {
            setTableRows(result.tableRows);
            const offset = handlePaginate(result.tableRows, pagination);
            setOffSet(() => offset);
        }
    };

    const handleFilterfn = (
        column: string,
        value: string,
        operation: FilterOperationsEnum,
        dataType: "string" | "number" | "date"
    ) => {
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

    const handleClearFilterfn = (column: string) => {
        const result = handleClearFilter(column, appliedFilterMap, initialTableRows);
        setAppliedFilterMap(() => result.appliedFilter);
        let filteredRows = result.filteredRows;
        if (searchVal !== "" && searchItemBy) {
            filteredRows = handleItemSearch(searchVal, result.filteredRows, searchItemBy);
        }
        setTableRows(() => filteredRows);
        const offset = handlePaginate(filteredRows, pagination);
        setOffSet(() => offset);
    };

    const handleItemSearchfn = (searchVal: string) => {
        if (searchVal === "") {
            let filteredRows = initialTableRows;
            const newMap = new Map(appliedFilterMap);
            if (newMap.size > 0) {
                newMap.forEach(({ column, value, operation, dataType }: any) => {
                    filteredRows = handleFilter(filteredRows, column, value, operation, dataType);
                });
            }
            setTableRows(() => filteredRows);
            const offset = handlePaginate(filteredRows, pagination);
            setOffSet(() => offset);
        } else {
            if (searchItemBy) {
                const searchedRows = handleItemSearch(searchVal, tableRows, searchItemBy);
                setTableRows(() => searchedRows);
                const offset = handlePaginate(searchedRows, pagination);
                setOffSet(() => offset);
            }
        }
    };

    const handlePaginate = (tableRows: ITableRows[], pagination: IPagination) => {
        const startIndex = (pagination.currPage - 1) * pagination.rowInPage;
        const paginate = tableRows.slice(startIndex, startIndex + pagination.rowInPage);
        return paginate;
    };

    const handleNumberOfRows = (numberOfROws: number) => {
        const totalPages = getNumberOfPage(tableRows.length, numberOfROws);
        setPagination((prevState) => ({ ...prevState, total: totalPages, rowInPage: numberOfROws }));
    };

    const handlePagination = (pageNumber: number) => {
        setPagination((prevState) => ({ ...prevState, currPage: pageNumber }));
    };

    return (
        <div className={Styles.TableContainer}>
            <TableItemSearch
                tableRows={tableRows}
                searchBy={searchItemBy}
                handleItemSearch={(searchVal: string) => {
                    setSearchVal(searchVal);
                    handleItemSearchfn(searchVal);
                }}
            />
            <UITable className={Styles.UITable}>
                <Thead className={Styles.Thead}>
                    {tableHeader.map((th: ITableHeader, index: number) => (
                        <Th className={Styles.Th} key={th.key + index}>
                            <div className={Styles.OuterBox}>
                                <div className={Styles.InnerBox} onClick={() => {
                                    if (th.isSort === undefined || th.isSort) handleSortfn(th.key);
                                }}>
                                    <span className={Styles.Title}>{th.title}</span>
                                    {(th.isSort === undefined || th.isSort) && getSortIcon(th.key, isSort)}
                                </div>
                                {(th.isFilter === undefined || th.isFilter === true) &&
                                    <FiterPopover
                                        key={th.key}
                                        column={th.key}
                                        dataType={th.dataType ? th.dataType : "string"}
                                        options={th.options ? th.options : undefined}
                                        handleFilter={(column: string, value: string, operation: FilterOperationsEnum, dataType: "string" | "number" | "date") =>
                                            handleFilterfn(column, value, operation, dataType)}
                                        handleClearFilterfn={(column: string) => handleClearFilterfn(column)}
                                        appliedFilter={appliedFilterMap.get(th.key)}
                                    />
                                }
                            </div>
                        </Th>
                    ))}
                </Thead>
                <Tbody className={Styles.Tbody}>
                    {offSet.map((row: ITableRows, idx: number) => (
                        <Tr className={Styles.Tr} key={idx}>
                            {Object.keys(row).map((el) => (
                                <Td className={Styles.Td} key={el}>{row[el].value}</Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </UITable>
            <Pagination
                pagination={pagination}
                handleNumberOfRows={(numberOfROws: number) => handleNumberOfRows(numberOfROws)}
                handlePagination={(pageNumber: number) => handlePagination(pageNumber)}
            />
        </div>
    );
};

export default Table;
