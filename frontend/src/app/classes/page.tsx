import useSWR from 'swr';
import { fetcher } from '@/lib/api';

interface Class {
  _id: string;
  name: string;
  gradeLevel: string;
  classTeacher: string;
}

export default function ClassesPage() {
  const { data, error } = useSWR<Class[]>('/classes', fetcher);
  if (error) return <div className="p-4">Failed to load classes.</div>;
  if (!data) return <div className="p-4">Loading classes...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Classes</h1>
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Grade Level</th>
            <th className="px-4 py-2">Teacher</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c) => (
            <tr key={c._id} className="border-t border-gray-200 dark:border-gray-700">
              <td className="px-4 py-2">{c.name}</td>
              <td className="px-4 py-2">{c.gradeLevel}</td>
              <td className="px-4 py-2">{c.classTeacher}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
