import { columns, Payment } from '../../../../components/data-table/columns';
import { DataTable } from '../../../../components/data-table/data-table';

async function getData(): Promise<Payment[]> {
  return [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com'
    },
    {
      id: '728ed522',
      amount: 100,
      status: 'processing',
      email: 'm1@example.com'
    }
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className='container mx-auto py-10'>
      <DataTable
        columns={columns}
        data={data}
      />
    </div>
  );
}
