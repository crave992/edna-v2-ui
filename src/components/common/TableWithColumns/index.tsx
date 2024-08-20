import { Table } from "react-bootstrap";
import ActionButton from "../ButtonControls/ActionButton";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import Sorting from "../Sorting";
import { ActionButtonTypes } from "@/helpers/ActionButtonTypes";
import React from "react";

interface ActionItemProps {
  name: string;
  displayOrder: number;
  actionButtonType: ActionButtonTypes;
  tooltipText: string;
  onClick?: (id: any) => void;
  title?: string;
  linkUrl?: string;
  linkTarget?: "_self" | "_blank" | "_parent" | "_top";
  inPopup?: boolean;
}

interface TableColumnConfig<T> {
  key: keyof T | string;
  header: string;
  displayOrder: number;
  type?: "normal" | "date" | "time";
  isSortingColumn?: boolean;
  sortData?: (sortingColumn: string, sortDirection: string) => void;
  sortingColumnName?: string;
  currentSortingColumn?: string;
  currentSortDirection?: string;
  headerClassNames?: string;
  columnClassNames?: string;
  customJsx?: string;
}

interface TableWithColumnsProps<T> {
  data?: T[];
  idKey?: keyof T;
  columns: TableColumnConfig<T>[];
  actionItems?: ActionItemProps[];
}

const TableWithColumns = <T extends {}>({
  data,
  idKey: id,
  columns,
  actionItems,
}: TableWithColumnsProps<T>) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const sortedColumns = [...columns].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  const sortedActionItems =
    actionItems &&
    [...actionItems].sort((a, b) => a.displayOrder - b.displayOrder);

  const renderCell = (item: T, column: TableColumnConfig<T>) => {
    const keyPath = column.key.toString().split(".");
    let value: any = item;
    for (const key of keyPath) {
      value = value ? value[key] : undefined;
    }

    if (value) {
      if (column.type === "date") {
        value = unitOfService.DateTimeService.convertToLocalDate(value);
      } else if (column.type === "time") {
        value = unitOfService.DateTimeService.convertTimeToAmPm(value);
      }
    }
    return value;
  };

  const replaceTextInJSX = (
    element: string,
    replaceValue: string
  ): React.ReactNode => {
    return element.replace(/\[DynamicValue\]/g, replaceValue);
  };

  return (
    <>
      <Table striped hover className="custom_design_table mb-0">
        <thead>
          <tr>
            {sortedColumns.map((column) => (
              <th
                key={column.key.toString()}
                className={column.headerClassNames && column.headerClassNames}
              >
                {column.header}
                {column.isSortingColumn &&
                  column.sortData &&
                  column.sortingColumnName &&
                  column.currentSortingColumn &&
                  column.currentSortDirection && (
                    <Sorting
                      sortingColumn={column.sortingColumnName}
                      currentSortingColumn={column.currentSortingColumn}
                      currentSortDirection={column.currentSortDirection}
                      sortData={column.sortData}
                    />
                  )}
              </th>
            ))}
            {sortedActionItems && sortedActionItems.length > 0 && (
              <th className="text-center">Action</th>
            )}
          </tr>
        </thead>

        <tbody>
          {data &&
            id &&
            data.map((singleItem: T) => {
              return (
                <tr key={singleItem[id] as any}>
                  {sortedColumns.map((column) => (
                    <td
                      key={column.key.toString()}
                      className={
                        column.columnClassNames && column.columnClassNames
                      }
                    >
                      {column.customJsx ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              replaceTextInJSX(
                                column.customJsx,
                                renderCell(singleItem, column)
                              ) || "",
                          }}
                        />
                      ) : (
                        renderCell(singleItem, column)
                      )}
                    </td>
                  ))}

                  {sortedActionItems && sortedActionItems.length > 0 && (
                    <td className="text-center">
                      {sortedActionItems.map((action) => {
                        return (
                          <ActionButton
                            key={action.name}
                            actionButtonType={action.actionButtonType}
                            tooltipText={action.tooltipText}
                            id={singleItem[id] as any}
                            inPopup={action.inPopup}
                            linkUrl={
                              action.linkUrl &&
                              `${action.linkUrl}${singleItem[id]}`
                            }
                            onClick={() => {
                              if (action.onClick) {
                                action.onClick(singleItem[id] as any);
                              }
                            }}
                          />
                        );
                      })}
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </Table>
    </>
  );
};

export default TableWithColumns;
