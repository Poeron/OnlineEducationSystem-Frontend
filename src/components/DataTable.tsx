import "@/assets/css/DataTable.css";

type Column<T> = {
  header: string;
  key: keyof T;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (id: number) => void;
  idKey: keyof T; // id alanının ismini belirtmek için yeni bir prop ekliyoruz
};

const DataTable = <T extends {}>({
  data,
  columns,
  onEdit,
  onDelete,
  idKey,
}: DataTableProps<T>) => {
  return (
    <section className="data-table">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)}>{column.header}</th>
            ))}
            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={String(item[idKey])}>
                {columns.map((column) => (
                  <td key={String(column.key)}>
                    {item[column.key] !== undefined
                      ? String(item[column.key])
                      : "N/A"}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td>
                    {onEdit && (
                      <button onClick={() => onEdit(item)}>Edit</button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(item[idKey] as number)}>
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1}>No data found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default DataTable;
