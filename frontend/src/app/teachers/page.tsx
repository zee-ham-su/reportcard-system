import useSWR from 'swr';
import { fetcher } from '@/lib/api';

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function TeachersPage() {
  const { data, error } = useSWR<Teacher[]>('/teachers', fetcher);
  if (error) return <div className="p-4">Failed to load teachers.</div>;
  if (!data) return <div className="p-4">Loading teachers...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Teachers</h1>
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((t) => (
            <tr key={t._id} className="border-t border-gray-200 dark:border-gray-700">
              <td className="px-4 py-2">{t.firstName}</td>
              <td className="px-4 py-2">{t.lastName}</td>
              <td className="px-4 py-2">{t.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
