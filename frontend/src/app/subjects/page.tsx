import useSWR from 'swr';
import { fetcher } from '@/lib/api';

interface Subject {
  _id: string;
  name: string;
  code: string;
  credits: number;
}

export default function SubjectsPage() {
  const { data, error } = useSWR<Subject[]>('/subjects', fetcher);
  if (error) return <div className="p-4">Failed to load subjects.</div>;
  if (!data) return <div className="p-4">Loading subjects...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Subjects</h1>
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Credits</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s) => (
            <tr key={s._id} className="border-t border-gray-200 dark:border-gray-700">
              <td className="px-4 py-2">{s.name}</td>
              <td className="px-4 py-2">{s.code}</td>
              <td className="px-4 py-2">{s.credits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
