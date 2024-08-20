import { StudentBasicDto } from '@/dtos/StudentDto';
import ReportingDto from '@/dtos/ReportingDto';

interface ExtendedReportingDto extends ReportingDto {
  [key: string]: any;
}

interface TableProps {
  data: ExtendedReportingDto[];
  isFetching: boolean;
  tableHeaders: { name: string; key: string; style?: string }[];
  tableRows: {
    name: string;
    key: string;
    type: string;
    style?: string;
  }[];
}

const Table = ({ data, isFetching, tableHeaders, tableRows }: TableProps) => {
  return (
    <div className="tw-bg-secondary tw-pb-xl">
      <div className="tw-min-w-[1016px] tw-mx-4xl tw-p-0 tw-border tw-border-secondary tw-border-solid tw-rounded-xl tw-overflow-hidden">
        <table className="tw-w-full tw-bg-white">
          <thead>
            <tr className="tw-border-solid tw-border-b tw-border-secondary tw-border-x-0 tw-border-t-0">
              {tableHeaders &&
                tableHeaders.map((header, index) => {
                  return (
                    <td
                      className={`tw-py-lg first:tw-pl-4xl last:tw-pr-4xl tw-px-3xl tw-text-xs-medium tw-text-tertiary tw-bg-secondary ${
                        header.style ? header.style : ''
                      }`}
                      key={`header-${header}-${index}`}
                    >
                      {header.name}
                    </td>
                  );
                })}
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item: ExtendedReportingDto, itemIndex: number) => {
                return (
                  <tr
                    key={`table-row-${item.id}-${itemIndex}`}
                    className="tw-w-full tw-border-solid tw-border-b tw-border-secondary tw-border-x-0 tw-border-t-0 hover:tw-bg-secondary last:tw-border-b-0 tw-items-center"
                  >
                    {tableRows &&
                      tableRows.map((row) => {
                        switch (row.type) {
                          case 'text':
                            return (
                              <td
                                className={`tw-py-xl tw-px-3xl ${row.style ? row.style : 'tw-text-primary'}`}
                                key={`table-row-${item.id}-${row.name}-${itemIndex}`}
                              >
                                {item[row.key]?.firstName
                                  ? `${item[row.key]?.firstName} ${item[row.key]?.lastName}`
                                  : item[row.key]}
                              </td>
                            );

                          case 'box':
                            return (
                              <td
                                className="tw-py-xl tw-px-3xl last:tw-pr-4xl"
                                key={`table-row-${item.id}-${row.name}-${itemIndex}`}
                              >
                                <div className="tw-flex tw-space-x-xs tw-items-center tw-justify-center tw-rounded-md tw-border-primary tw-border tw-border-solid tw-px-sm tw-py-xxs tw-w-fit tw-bg-white">
                                  {item[row.key]}
                                </div>
                              </td>
                            );
                        }
                      })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
